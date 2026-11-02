import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import useProducts from './useProducts';
import type { Product } from './schemas';
import Modal from '@/shared/ui/Modal';
import ProductModal from './ProductModal';

type ProductListType = {
  limit?: number | undefined;
};

export default function ProductList({ limit }: ProductListType) {
  const { isLoading, error, products, setProductLimit } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProductLimit(limit);
  }, [limit, setProductLimit]);

  if (isLoading) {
    return <p className="py-10 text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return (
      <p className="py-10 text-center text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (products.length === 0) {
    return <p className="py-10 text-center text-gray-500">There are no products yet</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {products.map((product) => (
          <li key={product.id} className="min-w-0">
            <ProductCard onPreview={setSelectedProduct} product={product} />
          </li>
        ))}
      </ul>

      <Modal
        open={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name ?? ''}>
        {selectedProduct && <ProductModal product={selectedProduct} />}
      </Modal>
    </>
  );
}
