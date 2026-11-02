import type { Product } from './schemas';
import AddToCartButton from '../cart/AddToCartButton';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function ProductModal({ product }: { product: Product }) {
  const { name, price, description, image } = product;

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      {image && (
        <img
          src={image}
          alt={name}
          className="aspect-3/2 max-h-[50vh] w-full rounded-lg object-cover"
        />
      )}

      <p className="break-words text-sm leading-relaxed text-gray-600 sm:text-base">
        {description ?? 'No description yet'}
      </p>

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-lg font-semibold sm:text-xl">{priceFormatter.format(price)}</span>

        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}
