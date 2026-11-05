import { Link } from 'react-router';
import useCart from '@/features/cart/useCart';
import CheckoutForm from '@/features/orders/CheckoutForm';
import { buttonStyles } from '@/shared/ui/Button/button-styles';

export default function CheckoutPage() {
  const { lines, isLoading } = useCart();

  if (isLoading) return <p>Loading...</p>;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 py-8">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link to="/products" className={buttonStyles()}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg py-8">
      <h1 className="mb-6 text-3xl font-semibold">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
