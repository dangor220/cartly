import { useState } from 'react';
import Button from '@/shared/ui/Button/Button';
import Modal from '@/shared/ui/Modal';
import { OrderNotCancellableError, cancelOrder } from './api';

type CancelOrderButtonProps = {
  orderId: number;
  onChanged: () => void;
};

export default function CancelOrderButton({ orderId, onChanged }: CancelOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (isPending) return;
    setIsOpen(false);
    setError(null);
  };

  const handleConfirm = async () => {
    setIsPending(true);
    setError(null);

    try {
      await cancelOrder(orderId);
      setIsOpen(false);
      onChanged();
    } catch (e) {
      if (e instanceof OrderNotCancellableError) {
        setError('This order can no longer be cancelled.');
        onChanged(); // статус мог измениться, обновим страницу
      } else {
        console.error(e);
        setError('Could not cancel the order. Please try again.');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button variant="ghost-destructive" onClick={() => setIsOpen(true)}>
        Cancel order
      </Button>

      <Modal open={isOpen} onClose={close} title="Cancel this order?">
        <p className="text-gray-600">
          The order will be cancelled and you will not be charged. This cannot be undone.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={close} disabled={isPending}>
            Keep order
          </Button>
          <Button onClick={() => void handleConfirm()} disabled={isPending}>
            {isPending ? 'Cancelling...' : 'Yes, cancel'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
