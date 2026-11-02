import type { Product } from './schemas';
import { Link } from 'react-router';
import { buttonStyles } from '@/shared/ui/Button/button-styles';
import AddToCartButton from '../cart/AddToCartButton';

type ProductCardProps = {
  product: Product;
  onPreview: (product: Product) => void;
};

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function ProductCard({ product, onPreview }: ProductCardProps) {
  const { name, price, description, image } = product;

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Product image */}
      {image ? (
        <img
          onClick={() => onPreview(product)}
          className="aspect-3/2 w-full cursor-pointer object-cover"
          src={image}
          alt={name}
          loading="lazy"
        />
      ) : (
        <div
          onClick={() => onPreview(product)}
          className="aspect-3/2 w-full cursor-pointer bg-gray-100"
          role="button"
          tabIndex={0}
          aria-label={`Preview ${name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPreview(product);
            }
          }}
        />
      )}

      {/* Product information */}
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <h3 className="break-words text-sm font-medium text-gray-900 sm:text-base">{name}</h3>

        {description && (
          <p className="line-clamp-2 break-words text-xs text-gray-600 sm:text-sm">{description}</p>
        )}

        {/* Price */}
        <p className="mt-auto text-base font-semibold sm:text-lg">{priceFormatter.format(price)}</p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/products/${product.id}`} className={buttonStyles('secondary')}>
            Learn more
          </Link>

          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </article>
  );
}
