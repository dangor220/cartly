import { useState } from 'react';
import Button from '@/shared/ui/Button/Button';
import useCart from './useCart';

type AddToCartButtonProps = {
  productId: number;
  className?: string;
};

export default function AddToCartButton({ productId, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = async () => {
    if (status === 'loading') return;

    setStatus('loading');

    try {
      await addItem(productId);
      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={status === 'loading'}
      className={`transition-all duration-200 active:scale-95 ${
        status === 'success' ? 'bg-green-600 hover:bg-green-700' : ''
      } ${className ?? ''}`}>
      {status === 'loading' ? (
        <span className="flex items-center justify-center gap-2">
          <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          Adding...
        </span>
      ) : status === 'success' ? (
        <span className="flex items-center justify-center gap-2">
          <span aria-hidden="true">✓</span>
          Added to cart!
        </span>
      ) : (
        'Add to cart'
      )}
    </Button>
  );
}
