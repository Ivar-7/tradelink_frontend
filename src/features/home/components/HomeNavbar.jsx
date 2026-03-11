import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const HomeNavbar = () => (
  <nav className="w-full px-6 py-4 lg:px-12">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-white">
          Trade<span className="text-gradient">Link</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link to={ROUTES.PRODUCTS} className="text-slate-300 hover:text-white transition-colors">
          Browse
        </Link>
        <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">
          How It Works
        </a>
        <a href="#features" className="text-slate-300 hover:text-white transition-colors">
          Features
        </a>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="hidden sm:block px-4 py-2 text-slate-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          to={ROUTES.AUTH.SIGNUP}
          className="btn-cta px-5 py-2.5 rounded-xl font-medium text-white"
        >
          Get Started
        </Link>
      </div>
    </div>
  </nav>
);

export default HomeNavbar;
