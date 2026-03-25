import { useState } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../../shared/constants/app';
import { ROUTES } from '../../../shared/constants/routes';
import { useAuthHook } from '../hooks/useAuthHook';

const ForgotPasswordPage = () => {
  const { requestPasswordReset, loading, error, clearError } = useAuthHook();
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess('');
    const formData = new FormData(event.currentTarget);

    try {
      await requestPasswordReset({ email: formData.get('email') });
      setSuccess('Reset link sent. Check your inbox.');
      event.currentTarget.reset();
    } catch {
      // Error shown from context
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-180px)] items-center justify-center px-4 py-12 md:px-6">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-[0_30px_70px_-30px_rgba(27,27,27,0.18)] md:p-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{APP_NAME}</h1>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground">Reset Password</h2>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we will send a reset link.
          </p>
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
              required
              onChange={clearError}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-border bg-slate-100 px-4 py-3.5 text-sm text-foreground placeholder:text-muted focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
            />
          </div>

          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
          {success ? <p className="text-sm font-medium text-green-600 dark:text-green-400">{success}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <Link to={ROUTES.AUTH.LOGIN} className="text-sm font-semibold text-primary-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
