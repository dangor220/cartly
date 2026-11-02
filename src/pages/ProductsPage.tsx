import ProductList from '@/features/products/ProductList';

export default function ProductsPage() {
  return (
    <section className="w-full py-5 sm:py-8">
      <h1 className="mb-6 text-2xl font-semibold sm:mb-8 sm:text-3xl">Products</h1>

      <ProductList />
    </section>
  );
}
