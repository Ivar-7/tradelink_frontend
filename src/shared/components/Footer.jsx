import { Link } from 'react-router-dom';
import { APP_NAME, APP_COUNTRY } from '../constants/app';
import { ROUTES } from '../constants/routes';

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950 px-4 pb-8 pt-16 text-sm text-slate-300">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-6 text-xl font-bold text-white tracking-tight">{APP_NAME}</h3>
            <p className="max-w-xs text-xs leading-relaxed text-slate-400">
              {APP_COUNTRY}&apos;s trusted digital marketplace. Discover precision products with fast checkout and reliable delivery.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Customer Service</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to={ROUTES.FEEDBACK} className="text-xs text-slate-400 transition-colors hover:text-white">Help Center</Link></li>
              <li><Link to={ROUTES.ORDERS} className="text-xs text-slate-400 transition-colors hover:text-white">Shipping Info</Link></li>
              <li><Link to={ROUTES.PROFILE} className="text-xs text-slate-400 transition-colors hover:text-white">Return Policy</Link></li>
              <li><Link to={ROUTES.REVIEWS} className="text-xs text-slate-400 transition-colors hover:text-white">Product Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Company</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to={ROUTES.HOME} className="text-xs text-slate-400 transition-colors hover:text-white">About {APP_NAME}</Link></li>
              <li><Link to={ROUTES.VENDOR.PRODUCTS} className="text-xs text-slate-400 transition-colors hover:text-white">Vendor Storefront</Link></li>
              <li><Link to={ROUTES.PRODUCTS} className="text-xs text-slate-400 transition-colors hover:text-white">Sustainability</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Connect</h3>
            <div className="flex gap-4">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-primary-600"
                aria-label="Contact by email"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4 6 8 6 8-6M4 6h16v12H4z" />
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-primary-600"
                aria-label="Visit our social channels"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-[10px] uppercase tracking-[0.2em] text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to={ROUTES.PROFILE} className="transition-colors hover:text-white">Privacy</Link>
            <Link to={ROUTES.FEEDBACK} className="transition-colors hover:text-white">Terms</Link>
            <Link to={ROUTES.VENDOR.DASHBOARD} className="transition-colors hover:text-white">Vendor</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
