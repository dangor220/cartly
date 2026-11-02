import { NavLink } from 'react-router';
import { useAuth } from './useAuth';
import Button from '@/shared/ui/Button/Button';
import { buttonStyles } from '@/shared/ui/Button/button-styles';

export default function UserMenu() {
  const { user, logOut, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return (
      <NavLink to="/login" className={buttonStyles()}>
        Log In
      </NavLink>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium sm:text-base">
          {user.firstName} {user.lastName}
        </span>
        <span className="max-w-32 truncate text-xs italic text-gray-500 sm:max-w-none sm:text-sm">
          {user.email}
        </span>
      </div>

      <Button onClick={logOut} className="shrink-0 px-3 py-2 text-sm sm:px-4 sm:text-base">
        Log Out
      </Button>
    </div>
  );
}
