import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { APP_NAME } from '../constants/app';
import { useTheme } from '../hooks/useThemeHook';
import useCartHook from '../../features/cart/hooks/useCartHook';

const PAGES_LINKS = [
  { label: 'Products',  to: ROUTES.PRODUCTS },
  { label: 'Vendor Store', to: ROUTES.VENDOR.PRODUCTS },
  { label: 'Cart',      to: ROUTES.CART },
  { label: 'Payment',   to: ROUTES.CHECKOUT },
  { label: 'Orders',    to: ROUTES.ORDERS },
  { label: 'Profile',   to: ROUTES.PROFILE },
  { label: 'Reviews',   to: ROUTES.REVIEWS },
  { label: 'Feedback',  to: ROUTES.FEEDBACK },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const cart = useCartHook((state) => state.cart);
  const fetchCart = useCartHook((state) => state.fetchCart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartCount = cart?.products?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, [cart, fetchCart]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/85 shadow-sm backdrop-blur-xl dark:bg-slate-950/80 dark:shadow-none">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-8">
          <Link
            to={ROUTES.HOME}
            className="shrink-0 text-xl font-black tracking-tight text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {APP_NAME}
          </Link>

          <div className="relative hidden max-w-xl flex-1 md:block">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900 dark:focus:ring-primary-900"
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
            </svg>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink
            to={ROUTES.PROFILE}
            className={({ isActive }) =>
              `border-b-2 text-sm font-semibold tracking-tight transition-colors ${
                isActive
                  ? 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-300'
                  : 'border-transparent text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-300'
              }`
            }
          >
            Account
          </NavLink>

          <NavLink
            to={ROUTES.ORDERS}
            className={({ isActive }) =>
              `text-sm font-medium tracking-tight transition-colors ${
                isActive
                  ? 'text-primary-700 dark:text-primary-300'
                  : 'text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-300'
              }`
            }
          >
            Orders
          </NavLink>

          <button
            onClick={() => navigate(ROUTES.CART)}
            className="relative text-sm font-medium tracking-tight text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-300"
            aria-label="Go to cart"
          >
            Cart
            <span className="absolute -right-4 -top-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
              {Math.min(cartCount, 99)}
            </span>
          </button>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              className="flex items-center gap-1 text-sm font-medium tracking-tight text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-300"
            >
              Explore
              <svg
                className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                {PAGES_LINKS.map(({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-primary-50 font-medium text-primary-700 dark:bg-slate-900 dark:text-primary-300'
                          : 'text-foreground hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-900 dark:hover:text-primary-300'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.5M12 18.5V21M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M3 12h2.5M18.5 12H21M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
              </svg>
            )}
          </button>

          <Link
            to={ROUTES.AUTH.LOGIN}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />
    </header>
  );
};

export default Navbar;
