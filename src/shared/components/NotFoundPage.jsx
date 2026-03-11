import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="text-lg text-foreground">Page not found</p>
      <Link
        to={ROUTES.HOME}
        className="rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
      >
        Go home
      </Link>
    </div>
  );
};

export default NotFoundPage;
