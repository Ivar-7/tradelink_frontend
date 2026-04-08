import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { APP_NAME } from '../../../shared/constants/app';
import { useAuthHook } from '../hooks/useAuthHook';
import { authBrandSignals, authTrustPartners } from '../data/authPageData';

const resolveRoleDestination = (role) => {
  if (role === 'vendor') return ROUTES.VENDOR.DASHBOARD;
  if (role === 'admin') return ROUTES.ADMIN.DASHBOARD;
  return ROUTES.HOME;
};

const LoginPage = () => {
  const { login, loading, error, clearError } = useAuthHook();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const loggedInUser = await login({
        email: formData.get('email'),
        password: formData.get('password'),
      });
      navigate(resolveRoleDestination(loggedInUser?.role));
    } catch {
      // error state handled in hook
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-180px)] items-center justify-center overflow-hidden px-4 py-14 md:px-6">
      <div className="pointer-events-none absolute right-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-[-6rem] h-72 w-72 rounded-full bg-primary-600/20 blur-3xl" />

      <section className="relative z-10 w-full max-w-xl rounded-2xl border border-border bg-surface p-8 shadow-[0_40px_80px_-20px_rgba(27,27,27,0.08)] md:p-12">
        <header className="mb-9 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{APP_NAME}</h1>
          <h2 className="mt-5 text-2xl font-black tracking-tight text-foreground">Sign In</h2>
          <p className="mt-2 text-sm font-medium text-muted">Access your global trading dashboard</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={clearError}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              onChange={clearError}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted">
              <input type="checkbox" className="h-4 w-4 rounded border-border text-primary-600" />
              Remember Me
            </label>
            <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-xs font-bold text-primary-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 py-3.5 text-sm font-bold tracking-tight text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => navigate(ROUTES.AUTH.SIGNUP)}
            className="w-full rounded-xl border border-border bg-slate-100 py-3.5 text-sm font-bold tracking-tight text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            Create an Account
          </button>
        </form>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{authBrandSignals[0]}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {authTrustPartners.map((partner) => (
              <span key={partner} className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted dark:bg-slate-900">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
