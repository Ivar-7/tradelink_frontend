import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { APP_NAME } from '../constants/app';
import { useTheme } from '../theme/ThemeProvider';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
