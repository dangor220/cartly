import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/features/auth/useAuth';
import { getProductsByIds } from '@/features/products/api';
import type { Product } from '@/features/products/schemas';
import { buttonStyles } from '@/shared/ui/Button/button-styles';
import useCart from './useCart';
import Button from '@/shared/ui/Button/Button';
import QuantityControls from './QuantityControls';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type Loaded = { key: string; products: Product[] | null };

export default function CartList() {
  const { user } = useAuth();
  const { lines, isLoading, error } = useCart();
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  const idsKey = lines
    .map((line) => line.productId)
    .sort((a, b) => a - b)
    .join(',');

  useEffect(() => {
    if (idsKey === '') return;

    const ids = idsKey.split(',').map(Number);
    let ignore = false;

    async function load() {
      try {
        const products = await getProductsByIds(ids);
        if (!ignore) setLoaded({ key: idsKey, products });
      } catch (e) {
        console.error(e);
        if (!ignore) setLoaded({ key: idsKey, products: null });
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [idsKey]);

  if (isLoading) {
    return <p className="py-8 text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return (
      <p className="py-8 text-center text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 py-4">
        <p className="text-sm text-gray-600 sm:text-base">Your cart is empty.</p>

        <Link to="/products" className={buttonStyles()}>
          Browse products
        </Link>
      </div>
    );
  }

  if (loaded?.key !== idsKey) {
    return <p className="py-8 text-center text-gray-500">Loading...</p>;
  }

  if (loaded.products === null) {
    return (
      <p className="py-8 text-center text-red-600" role="alert">
        Failed to load cart items
      </p>
    );
  }

  const byId = new Map(loaded.products.map((product) => [product.id, product]));

  const items = lines.flatMap((line) => {
    const product = byId.get(line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });

  const total = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
      {/* Cart items */}
      <ul className="min-w-0 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200">
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="flex min-w-0 flex-wrap gap-3 p-3 sm:flex-nowrap sm:gap-4 sm:p-4">
            {/* Product image */}
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="size-20 shrink-0 rounded object-cover sm:size-24"
              />
            ) : (
              <div className="size-20 shrink-0 rounded bg-gray-100 sm:size-24" />
            )}

            {/* Product info */}
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              <h2 className="break-words text-sm font-medium text-gray-900 sm:text-base">
                {product.name}
              </h2>

              <p className="text-xs text-gray-600 sm:text-sm">
                {priceFormatter.format(product.price)} × {quantity}
              </p>
            </div>

            {/* Price and quantity */}
            <div className="flex w-full flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:w-auto sm:flex-col sm:items-end sm:justify-center sm:border-0 sm:pt-0">
              <p className="text-sm font-semibold sm:text-base">
                {priceFormatter.format(product.price * quantity)}
              </p>

              <QuantityControls productId={product.id} quantity={quantity} />
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <aside className="h-fit min-w-0 rounded-lg border border-gray-200 bg-white p-4 sm:p-5 lg:sticky lg:top-24">
        <h2 className="mb-4 text-lg font-semibold">Summary</h2>

        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-sm text-gray-600 sm:text-base">Total</span>

          <span className="text-base font-semibold sm:text-lg">{priceFormatter.format(total)}</span>
        </div>

        {user ? (
          <Button type="button" className={`${buttonStyles()} w-full`}>
            Checkout
          </Button>
        ) : (
          <Link to="/login" className={`${buttonStyles()} block w-full text-center`}>
            Log in to checkout
          </Link>
        )}
      </aside>
    </div>
  );
}
