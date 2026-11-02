import Button from '@/shared/ui/Button/Button';
import useCart from './useCart';
import { useState } from 'react';

type QuantityControlsProps = {
  productId: number;
  quantity: number;
};

export default function QuantityControls({ productId, quantity }: QuantityControlsProps) {
  const { setQuantity, removeItem } = useCart();
  const [isPending, setIsPending] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setIsPending(true);
    try {
      await action();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
      {/* Quantity controls */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          disabled={isPending || quantity <= 1}
          onClick={() => void run(() => setQuantity(productId, quantity - 1))}
          aria-label="Decrease quantity">
          -
        </Button>

        <span className="w-7 text-center text-sm font-medium tabular-nums" aria-live="polite">
          {quantity}
        </span>

        <Button
          aria-label="Increase quantity"
          disabled={isPending}
          onClick={() => void run(() => setQuantity(productId, quantity + 1))}>
          +
        </Button>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost-destructive"
        aria-label="Remove from cart"
        disabled={isPending}
        onClick={() => void run(() => removeItem(productId))}
        className="whitespace-nowrap text-sm">
        Remove
      </Button>
    </div>
  );
}
