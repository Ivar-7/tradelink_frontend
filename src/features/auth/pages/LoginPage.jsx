import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { APP_NAME } from '../../../shared/constants/app';
import LoginForm from '../components/LoginForm';
import { useAuthHook } from '../hooks/useAuthHook';

const LoginPage = () => {
  const { login, loading, error } = useAuthHook();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await login({
        email: formData.get('email'),
        password: formData.get('password'),
      });
      navigate(ROUTES.PRODUCTS);
    } catch {
      // error state handled in hook
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary-600">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-muted">Sign in to your account</p>
        </div>

        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.AUTH.SIGNUP} className="font-medium text-primary-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
