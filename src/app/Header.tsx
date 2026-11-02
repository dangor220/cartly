import { useState } from 'react';
import UserMenu from '@/features/auth/UserMenu';
import useCart from '@/features/cart/useCart';
import Logo from '@/shared/ui/Logo';
import { NavLink } from 'react-router';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  ].join(' ');

export default function Header() {
  const { count } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo */}
        <NavLink className="shrink-0" to="/" aria-label="Cartly, at home" onClick={closeMenu}>
          <Logo />
        </NavLink>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <NavLink className={navLinkClass} to="/" end>
            Home
          </NavLink>

          <NavLink className={navLinkClass} to="/products">
            Products
          </NavLink>

          <NavLink className={navLinkClass} to="/cart">
            Cart
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold tabular-nums text-white">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Right section */}
        <div className="flex shrink-0 items-center gap-2">
          <UserMenu />

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation">
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-gray-200 bg-white px-4 py-3 md:hidden"
          aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            <NavLink className={navLinkClass} to="/" end onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink className={navLinkClass} to="/products" onClick={closeMenu}>
              Products
            </NavLink>

            <NavLink className={navLinkClass} to="/cart" onClick={closeMenu}>
              Cart
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold tabular-nums text-white">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
