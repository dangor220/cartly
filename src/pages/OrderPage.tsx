import { Link, useParams } from 'react-router';
import { z } from 'zod';
import OrderSummary from '@/features/orders/OrderSummary';
import NotFoundPage from './NotFoundPage';

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });

export default function OrderPage() {
  const result = paramsSchema.safeParse(useParams());
  if (!result.success) return <NotFoundPage />;

  return (
    <div className="w-full py-8">
      <Link to="/orders" className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900">
        ← All orders
      </Link>
      <OrderSummary orderId={result.data.id} />
    </div>
  );
}
