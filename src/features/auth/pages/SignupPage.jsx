import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { APP_NAME } from '../../../shared/constants/app';
import { useAuthHook } from '../hooks/useAuthHook';
import { authSupportLinks } from '../data/authPageData';

const SignupPage = () => {
  const { signup, loading, error, clearError } = useAuthHook();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await signup({
        username: formData.get('username'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('user_email'),
        password: formData.get('user_password'),
        password_confirm: formData.get('confirm_password'),
        phone_number: formData.get('phone_number'),
        gender: formData.get('gender') || undefined,
        role: formData.get('user_role'),
      });
      navigate(ROUTES.AUTH.LOGIN);
    } catch {
      // error state handled in hook
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-180px)] items-center justify-center px-4 py-12 md:px-6">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-surface p-8 shadow-[0_30px_70px_-30px_rgba(27,27,27,0.18)] md:p-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{APP_NAME}</h1>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground">Create Account</h2>
          <p className="mt-2 text-sm text-muted">Join the next generation of trading</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="first_name" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                onChange={clearError}
                placeholder="First name"
                className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="last_name" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                onChange={clearError}
                placeholder="Last name"
                className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              onChange={clearError}
              placeholder="e.g., angela.trader"
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="user_email" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Email Address
            </label>
            <input
              id="user_email"
              name="user_email"
              type="email"
              required
              onChange={clearError}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone_number" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Phone Number
            </label>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              required
              onChange={clearError}
              placeholder="+254700000000"
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              required
              defaultValue=""
              onChange={clearError}
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            >
              <option value="">Select gender</option>
              <option value="F">Female</option>
              <option value="M">Male</option>
              <option value="O">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="user_role" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Account Type
            </label>
            <select
              id="user_role"
              name="user_role"
              defaultValue="buyer"
              onChange={clearError}
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            >
              <option value="buyer">Buyer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="user_password" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Password
            </label>
            <input
              id="user_password"
              name="user_password"
              type="password"
              required
              onChange={clearError}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm_password" className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              onChange={clearError}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            />
          </div>

          <label className="flex items-start gap-3 pt-1 text-xs text-muted">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-border text-primary-600" />
            <span>
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>

          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-800/20 transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-xl border border-border bg-slate-100 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            Google
          </button>
          <button
            type="button"
            className="rounded-xl border border-border bg-slate-100 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            Apple
          </button>
        </div>

        <p className="mt-7 text-center text-sm text-muted">
          Already have an account?
          <Link to={ROUTES.AUTH.LOGIN} className="ml-1 font-bold text-primary-600 hover:underline">
            Sign In
          </Link>
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-4 border-t border-border pt-6">
          {authSupportLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
