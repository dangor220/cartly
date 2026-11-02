import { Link } from 'react-router';
import { buttonStyles } from '@/shared/ui/Button/button-styles';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 py-12 text-center">
      <span className="text-7xl font-bold tracking-tight text-indigo-600 sm:text-9xl">404</span>

      <h1 className="mt-4 text-xl font-semibold text-gray-900 sm:text-2xl">Page Not Found</h1>

      <p className="mt-2 max-w-sm text-sm text-gray-600 sm:text-base">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

      <Link to="/" className={`${buttonStyles()} mt-6`}>
        Back to home
      </Link>
    </main>
  );
}
