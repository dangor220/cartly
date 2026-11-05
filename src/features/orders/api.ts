import z from 'zod';
import { supabase } from '@/shared/lib/supabase';
import { orderSchema, type Order, type ShippingData } from './schemas';

export class EmptyCartError extends Error {}

const ORDER_SELECT =
  'id, status, total, full_name, address, city, postal_code, created_at, order_items(id, name, unit_price, quantity)';

export class OrderNotCancellableError extends Error {}

export async function cancelOrder(orderId: number): Promise<void> {
  const { error } = await supabase.rpc('cancel_order', { p_order_id: orderId });

  if (error) {
    if (error.code === 'P0001' && error.message === 'Order cannot be cancelled') {
      throw new OrderNotCancellableError('Order cannot be cancelled');
    }
    throw new Error(error.message);
  }
}

export class OrderNotPayableError extends Error {}

export async function payOrder(orderId: number): Promise<void> {
  const { error } = await supabase.rpc('pay_order', { p_order_id: orderId });

  if (error) {
    if (error.code === 'P0001' && error.message === 'Order cannot be paid') {
      throw new OrderNotPayableError('Order cannot be paid');
    }
    throw new Error(error.message);
  }
}

export async function placeOrder(data: ShippingData): Promise<number> {
  const { data: orderId, error } = await supabase.rpc('place_order', {
    p_full_name: data.fullName,
    p_address: data.address,
    p_city: data.city,
    p_postal_code: data.postalCode,
  });

  if (error) {
    // raise exception в SQL приходит с кодом P0001
    if (error.code === 'P0001' && error.message === 'Cart is empty') {
      throw new EmptyCartError('Cart is empty');
    }
    throw new Error(error.message);
  }

  return z.number().parse(orderId);
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return orderSchema.array().parse(data);
}

export async function getOrder(id: number): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .order('id', { referencedTable: 'order_items' })
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data === null ? null : orderSchema.parse(data);
}
