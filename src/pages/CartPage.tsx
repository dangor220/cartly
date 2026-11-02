import CartList from '@/features/cart/CartList';

export default function CartPage() {
  return (
    <div className="w-full py-5 sm:py-8">
      <h1 className="mb-5 text-2xl font-semibold sm:mb-6 sm:text-3xl">Your cart</h1>

      <CartList />
    </div>
  );
}
