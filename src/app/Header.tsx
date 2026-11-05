import { useState } from 'react';
import { NavLink } from 'react-router';
import UserMenu from '@/features/auth/UserMenu';
import { useAuth } from '@/features/auth/useAuth';
import useCart from '@/features/cart/useCart';
import Button from '@/shared/ui/Button/Button';
import Logo from '@/shared/ui/Logo';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  ].join(' ');

function CartBadge() {
  const { count } = useCart();

  if (count === 0) return null;

  return (
    <>
      <span
        aria-hidden="true"
        className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold tabular-nums text-white">
        {count > 99 ? '99+' : count}
      </span>
      <span className="sr-only">items in cart</span>
    </>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();

  return (
    <>
      <NavLink className={navLinkClass} to="/" end onClick={onNavigate}>
        Home
      </NavLink>
      <NavLink className={navLinkClass} to="/products" onClick={onNavigate}>
        Products
      </NavLink>
      {user && (
        <NavLink className={navLinkClass} to="/orders" onClick={onNavigate}>
          Orders
        </NavLink>
      )}
      <NavLink className={navLinkClass} to="/cart" onClick={onNavigate}>
        Cart
        <CartBadge />
      </NavLink>
    </>
  );
}

export default function Header() {
  const { user, logOut, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : '';

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <NavLink
          className="shrink-0 justify-self-start"
          to="/"
          aria-label="Cartly, at home"
          onClick={closeMenu}>
          <Logo />
        </NavLink>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <NavLinks />
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2 justify-self-end">
          {!isLoading && (
            // вошедшему на мобильном достаточно меню-бургера, гостю нужна кнопка Log In
            <div className={user ? 'hidden md:block' : undefined}>
              <UserMenu />
            </div>
          )}

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-indigo-600 md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation">
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true">
              <path d={isMenuOpen ? 'M18 6 6 18M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-gray-200 bg-white px-4 py-3 md:hidden"
          aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            <NavLinks onNavigate={closeMenu} />

            {!isLoading && user && (
              <div className="mt-2 border-t border-gray-200 pt-3">
                <div className="mb-3 px-3">
                  <p className="text-sm font-medium text-gray-900">{fullName}</p>
                  <p className="break-all text-xs text-gray-500">{user.email}</p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    closeMenu();
                    void logOut();
                  }}>
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
