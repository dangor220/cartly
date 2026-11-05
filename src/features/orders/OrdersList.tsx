import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { formatDate, formatPrice } from '@/shared/lib/format';
import { buttonStyles } from '@/shared/ui/Button/button-styles';
import { getOrders } from './api';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order } from './schemas';

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await getOrders();
        if (!ignore) setOrders(data);
      } catch (e) {
        console.error(e);
        if (!ignore) setError('Failed to load orders');
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (orders === null) return <p>Loading...</p>;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-gray-600">You have no orders yet.</p>
        <Link to="/products" className={buttonStyles()}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
      {orders.map((order) => {
        const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

        return (
          <li key={order.id}>
            <Link
              to={`/orders/${order.id}`}
              className="flex flex-col gap-3 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-gray-900">Order #{order.id}</span>
                <span className="text-sm text-gray-500">
                  {formatDate(order.createdAt)} · {itemsCount} item{itemsCount === 1 ? '' : 's'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <OrderStatusBadge status={order.status} />
                <span className="font-semibold">{formatPrice(order.total)}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
