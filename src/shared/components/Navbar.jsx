import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { APP_NAME } from '../constants/app';
import { useTheme } from '../hooks/useThemeHook';

const PAGES_LINKS = [
  { label: 'Products',  to: ROUTES.PRODUCTS },
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <header className="sticky top-0 z-50 border-b border-border bg-surface shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={ROUTES.HOME} className="text-xl font-bold text-primary-600">
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink
            to={ROUTES.PRODUCTS}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-foreground hover:text-primary-500'}`
            }
          >
            Shop
          </NavLink>

          {/* Pages dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-primary-500"
            >
              Pages
              <svg
                className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                {PAGES_LINKS.map(({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-primary-50 font-medium text-primary-600'
                          : 'text-foreground hover:bg-border hover:text-primary-500'
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

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg p-2 text-muted hover:bg-border hover:text-foreground"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => navigate(ROUTES.CART)}
            aria-label="Cart"
            className="rounded-lg p-2 text-muted hover:bg-border hover:text-foreground"
          >
            🛒
          </button>
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
