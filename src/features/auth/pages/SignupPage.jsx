import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { APP_NAME } from '../../../shared/constants/app';
import SignupForm from '../components/SignupForm';
import { useAuthHook } from '../hooks/useAuthHook';

const SignupPage = () => {
  const { signup, loading, error } = useAuthHook();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await signup({
        username: formData.get('username'),
        user_fname: formData.get('user_fname'),
        user_lname: formData.get('user_lname'),
        user_email: formData.get('user_email'),
        user_password: formData.get('user_password'),
        confirm_password: formData.get('confirm_password'),
        user_role: formData.get('user_role'),
      });
      navigate(ROUTES.PRODUCTS);
    } catch {
      // error state handled in hook
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary-600">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-muted">Create your account</p>
        </div>

        <SignupForm onSubmit={handleSubmit} loading={loading} error={error} />

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to={ROUTES.AUTH.LOGIN} className="font-medium text-primary-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
