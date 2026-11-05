import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import useCart from '@/features/cart/useCart';
import Button from '@/shared/ui/Button/Button';
import { EmptyCartError, placeOrder } from './api';
import { shippingSchema, type ShippingData } from './schemas';

const fields = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'address', label: 'Address', autoComplete: 'street-address' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code', autoComplete: 'postal-code' },
] as const satisfies ReadonlyArray<{
  name: keyof ShippingData;
  label: string;
  autoComplete: string;
}>;

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { refresh } = useCart();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ShippingData>({ resolver: zodResolver(shippingSchema) });

  const onSubmit = async (data: ShippingData) => {
    let orderId: number;

    try {
      orderId = await placeOrder(data);
    } catch (error) {
      setError('root', {
        message:
          error instanceof EmptyCartError
            ? 'Your cart is empty.'
            : 'Could not place the order. Please try again.',
      });
      return;
    }

    await navigate(`/orders/${orderId}`);
    refresh().catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {fields.map(({ name, label, autoComplete }) => (
        <div key={name}>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            {label}
            <input
              type="text"
              autoComplete={autoComplete}
              aria-invalid={errors[name] !== undefined}
              className="w-full rounded border border-gray-300 px-3 py-2 font-normal text-gray-900"
              {...register(name)}
            />
          </label>
          {errors[name] && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {errors[name].message}
            </p>
          )}
        </div>
      ))}

      {errors.root && (
        <p role="alert" className="text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Placing order...' : 'Place order'}
      </Button>
    </form>
  );
}
