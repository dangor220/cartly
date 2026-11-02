import SignUpForm from '@/features/auth/SignUpForm';
import { Link } from 'react-router';

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Sign Up</h1>

        <SignUpForm />

        <p className="text-center text-sm italic text-gray-600">
          Already have an account?{' '}
          <Link className="font-medium text-indigo-600 hover:text-indigo-800" to="/login">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
