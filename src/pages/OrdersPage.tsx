// pages/OrdersPage.tsx
import OrdersList from '@/features/orders/OrdersList';
import { buttonStyles } from '@/shared/ui/Button/button-styles';
import { Link } from 'react-router';

export default function OrdersPage() {
  return (
    <div className="w-full py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Your orders</h1>
        <Link to="/products" className={buttonStyles('secondary')}>
          Continue shopping
        </Link>
      </div>
      <OrdersList />
    </div>
  );
}
