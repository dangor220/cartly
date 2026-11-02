import AddToCartButton from '@/features/cart/AddToCartButton';
import useProducts from '@/features/products/useProducts';
import { buttonStyles } from '@/shared/ui/Button/button-styles';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products } = useProducts();

  const product = products.find((product) => product.id === Number(id));

  useEffect(() => {
    if (!product && products.length > 0) {
      navigate('/', { replace: true });
    }
  }, [product, products.length, navigate]);

  if (!product) {
    return null;
  }

  const { name, price, image, description } = product;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs sm:mb-8 sm:text-sm">
          <Link to="/" className="text-gray-500 transition hover:text-gray-900">
            Home
          </Link>

          <span className="text-gray-300">/</span>

          <Link to="/products" className="text-gray-500 transition hover:text-gray-900">
            Products
          </Link>

          <span className="text-gray-300">/</span>

          <span className="max-w-[50%] truncate font-medium text-gray-900">{name}</span>
        </nav>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Product image */}
            <div className="flex min-h-64 items-center justify-center bg-gray-100 p-4 sm:min-h-80 sm:p-8 lg:min-h-140 lg:p-10">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="max-h-80 w-full rounded-xl object-contain transition duration-500 hover:scale-[1.03] sm:max-h-100 lg:max-h-130"
                />
              ) : (
                <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-gray-200">
                  <span className="text-sm text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {/* Product information */}
            <div className="flex min-w-0 flex-col p-5 sm:p-8 lg:p-12">
              <div>
                <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
                  Product
                </span>

                <h1 className="mt-4 break-words text-2xl font-bold tracking-tight text-gray-950 sm:mt-5 sm:text-4xl">
                  {name}
                </h1>

                <div className="mt-5 sm:mt-6">
                  <p className="text-sm font-medium text-gray-500">Price</p>

                  <p className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    {priceFormatter.format(price)}
                  </p>
                </div>
              </div>

              <div className="my-6 h-px bg-gray-200 sm:my-8" />

              {/* Description */}
              <div>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                  About this product
                </h2>

                <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                  {description || 'No description available for this product yet.'}
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-6 space-y-4 sm:mt-8">
                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-700">
                    ✓
                  </span>

                  <div>
                    <p className="text-sm font-medium text-gray-900">Quality you can trust</p>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      Carefully selected for your everyday needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-700">
                    ✓
                  </span>

                  <div>
                    <p className="text-sm font-medium text-gray-900">Simple and convenient</p>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      Everything you need in one place.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-2 sm:mt-auto sm:pt-10">
                <div className="w-full">
                  <AddToCartButton productId={product.id} />
                </div>

                <Link
                  to="/products"
                  className={`${buttonStyles('secondary')} mt-3 flex w-full justify-center`}>
                  Continue shopping
                </Link>

                <p className="mt-4 text-center text-xs text-gray-400">Product ID: {product.id}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
