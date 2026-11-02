import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { logInSchema, type LogInData } from './schemas';
import { useNavigate } from 'react-router';
import { InvalidCredentialsError } from './api';
import Button from '@/shared/ui/Button/Button';
import { useAuth } from './useAuth';
import Modal from '@/shared/ui/Modal';

export default function LogInForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LogInData>({ resolver: zodResolver(logInSchema) });

  const { logIn, emailVerification, hideVerifyEmail } = useAuth();

  const onSubmit = async (data: LogInData) => {
    try {
      await logIn(data);
      await navigate('/');
    } catch (error) {
      setError('root', {
        message:
          error instanceof InvalidCredentialsError
            ? error.message
            : 'Something went wrong, please try again later.',
      });
    }
  };

  return (
    <>
      <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="login-password"
            className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            type="password"
            autoComplete="current-password"
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
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <Modal open={emailVerification} onClose={hideVerifyEmail} title="Verify your email">
        {emailVerification && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="size-7"
                aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.2 5.2a1.875 1.875 0 0 1-2.01 0l-8.2-5.2"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">Check your email</h3>

            <p className="max-w-sm text-sm leading-6 text-gray-500">
              We've sent you a verification link. Please check your inbox and confirm your account
              to get started.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
