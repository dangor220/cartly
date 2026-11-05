import { useState } from 'react';
import { formatPrice } from '@/shared/lib/format';
import Button from '@/shared/ui/Button/Button';
import Modal from '@/shared/ui/Modal';
import { OrderNotPayableError, payOrder } from './api';

type PayOrderButtonProps = {
  orderId: number;
  total: number;
  onChanged: () => void;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PayOrderButton({ orderId, total, onChanged }: PayOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (isPending) return;
    setIsOpen(false);
    setError(null);
  };

  const handlePay = async () => {
    setIsPending(true);
    setError(null);

    try {
      // задержка имитирует ожидание ответа платёжной системы
      await Promise.all([payOrder(orderId), delay(1000)]);
      setIsOpen(false);
      onChanged();
    } catch (e) {
      if (e instanceof OrderNotPayableError) {
        setError('This order can no longer be paid.');
        onChanged(); // статус мог измениться, обновим страницу
      } else {
        console.error(e);
        setError('Payment failed. Please try again.');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        Pay {formatPrice(total)}
      </Button>

      <Modal open={isOpen} onClose={close} title="Payment">
        <div className="flex flex-col gap-4">
          <p className="rounded bg-amber-50 p-3 text-sm text-amber-800">
            Demo mode: no real payment is made and no card data is collected.
          </p>

          <div className="flex justify-between">
            <span>Amount to pay</span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={close} disabled={isPending}>
              Back
            </Button>
            <Button onClick={() => void handlePay()} disabled={isPending}>
              {isPending ? 'Processing...' : 'Confirm payment'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
