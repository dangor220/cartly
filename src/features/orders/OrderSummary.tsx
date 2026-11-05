import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { formatDate, formatPrice } from '@/shared/lib/format';
import { buttonStyles } from '@/shared/ui/Button/button-styles';
import { getOrder } from './api';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order } from './schemas';
import CancelOrderButton from './CancelOrderButton';
import PayOrderButton from './PayOrderButton';

type Loaded = { orderId: number; order: Order | null; failed: boolean };

export default function OrderSummary({ orderId }: { orderId: number }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const order = await getOrder(orderId);
        if (!ignore) setLoaded({ orderId, order, failed: false });
      } catch (e) {
        console.error(e);
        if (!ignore) setLoaded({ orderId, order: null, failed: true });
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [orderId, version]);

  if (loaded?.orderId !== orderId) return <p>Loading...</p>;
  if (loaded.failed) return <p role="alert">Failed to load the order</p>;

  const { order } = loaded;

  if (order === null) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-gray-600">Order not found.</p>
        <Link to="/orders" className={buttonStyles()}>
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Order #{order.id}</h1>
          {order.status === 'cancelled' && (
            <p className="text-sm text-gray-600">This order was cancelled.</p>
          )}
          {order.status === 'paid' && (
            <p className="text-sm text-gray-600">Payment received. Thank you for your order!</p>
          )}
          <p className="mt-1 text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {formatPrice(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <aside className="flex h-fit flex-col gap-4 rounded-lg border border-gray-200 p-4">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Shipping to</h2>
            <address className="text-sm not-italic text-gray-600">
              {order.fullName}
              <br />
              {order.address}
              <br />
              {order.postalCode} {order.city}
            </address>
          </div>

          <div className="flex justify-between border-t border-gray-200 pt-4">
            <span>Total</span>
            <span className="font-semibold">{formatPrice(order.total)}</span>
          </div>
          {order.status === 'pending' && (
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
              <PayOrderButton
                orderId={order.id}
                total={order.total}
                onChanged={() => setVersion((v) => v + 1)}
              />
              <CancelOrderButton orderId={order.id} onChanged={() => setVersion((v) => v + 1)} />
            </div>
          )}
        </aside>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/orders" className={buttonStyles('secondary')}>
          All orders
        </Link>
        <Link to="/products" className={buttonStyles()}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
