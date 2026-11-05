import z from 'zod';

export const shippingSchema = z.object({
  fullName: z.string().trim().min(1, 'Enter the recipient name'),
  address: z.string().trim().min(1, 'Enter the address'),
  city: z.string().trim().min(1, 'Enter the city'),
  postalCode: z.string().trim().min(1, 'Enter the postal code'),
});

export type ShippingData = z.infer<typeof shippingSchema>;

export const orderStatusSchema = z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

const orderItemSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    unit_price: z.number(),
    quantity: z.number().int().positive(),
  })
  .transform(({ id, name, unit_price, quantity }) => ({
    id,
    name,
    unitPrice: unit_price,
    quantity,
  }));

export const orderSchema = z
  .object({
    id: z.number(),
    status: orderStatusSchema,
    total: z.number(),
    full_name: z.string(),
    address: z.string(),
    city: z.string(),
    postal_code: z.string(),
    created_at: z.string(),
    order_items: z.array(orderItemSchema),
  })
  .transform((row) => ({
    id: row.id,
    status: row.status,
    total: row.total,
    fullName: row.full_name,
    address: row.address,
    city: row.city,
    postalCode: row.postal_code,
    createdAt: row.created_at,
    items: row.order_items,
  }));

export type Order = z.infer<typeof orderSchema>;
