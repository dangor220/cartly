import ProductList from '@/features/products/ProductList';
import { buttonStyles } from '@/shared/ui/Button/button-styles';
import { Link } from 'react-router';

export default function HomePage() {
  return (
    <div>
      {/* Hero section */}
      <section className="mx-auto flex flex-col items-center justify-center gap-3 py-12 text-center sm:py-16 lg:py-20">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Welcome to Carty
        </h1>

        <p className="max-w-md text-base text-gray-600 sm:text-lg lg:text-xl">
          Discover products at great prices
        </p>
      </section>

      {/* Featured products */}
      <section className="pb-10 sm:pb-12" aria-labelledby="featured-heading">
        <h2
          className="mb-8 text-center text-xl font-semibold sm:mb-10 sm:text-2xl lg:mb-12"
          id="featured-heading">
          Featured products
        </h2>

        <ProductList limit={6} />

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link to="/products" className={buttonStyles()}>
            Show more
          </Link>
        </div>
      </section>
    </div>
  );
}
