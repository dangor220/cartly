import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpData } from './schemas';
import { EmailTakenError, signUp } from './api';
import { useNavigate } from 'react-router';
import Button from '@/shared/ui/Button/Button';
import { useAuth } from './useAuth';

export default function SignUpForm() {
  const navigate = useNavigate();
  const { showVerifyEmail } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpData>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (data: SignUpData) => {
    try {
      await signUp(data);
      showVerifyEmail();
      await navigate('/login');
    } catch (error) {
      if (error instanceof EmailTakenError) {
        setError('email', { message: error.message });
      } else {
        setError('root', {
          message: error instanceof Error ? error.message : 'Something went wrong',
        });
      }
    }
  };

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="signup-first-name" className="text-sm font-medium text-gray-700">
          First name
        </label>
        <input
          id="signup-first-name"
          className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          type="text"
          autoComplete="given-name"
          placeholder="John"
          {...register('firstName')}
        />
        {errors.firstName && (
          <p className="text-sm italic text-red-500" role="alert">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="signup-last-name" className="text-sm font-medium text-gray-700">
          Last name
        </label>
        <input
          id="signup-last-name"
          className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          type="text"
          autoComplete="family-name"
          placeholder="Smith"
          {...register('lastName')}
        />
        {errors.lastName && (
          <p className="text-sm italic text-red-500" role="alert">
            {errors.lastName.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="signup-email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="signup-email"
          className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm italic text-red-500" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="signup-password"
          className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          type="password"
          autoComplete="new-password"
          placeholder="********"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm italic text-red-500" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="text-sm italic text-red-500" role="alert">
          {errors.root.message}
        </p>
      )}

      <Button
        className="mt-2 w-full sm:w-auto sm:self-center"
        type="submit"
        disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create account'}
      </Button>
    </form>
  );
}
