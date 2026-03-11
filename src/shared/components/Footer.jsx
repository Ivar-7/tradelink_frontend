import { Link } from 'react-router-dom';
import { APP_NAME, APP_COUNTRY } from '../constants/app';
import { ROUTES } from '../constants/routes';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface px-4 py-8 text-sm text-muted">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 font-semibold text-foreground">{APP_NAME}</h3>
            <p className="text-xs leading-relaxed">
              {APP_COUNTRY}&apos;s trusted marketplace. Buy and sell everything except food.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Shop</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to={ROUTES.PRODUCTS} className="hover:text-primary-500">All Products</Link></li>
              <li><Link to={ROUTES.CART} className="hover:text-primary-500">My Cart</Link></li>
              <li><Link to={ROUTES.ORDERS} className="hover:text-primary-500">My Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Sell</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to={ROUTES.AUTH.SIGNUP} className="hover:text-primary-500">Become a Vendor</Link></li>
              <li><Link to={ROUTES.VENDOR.DASHBOARD} className="hover:text-primary-500">Vendor Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Support</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to={ROUTES.FEEDBACK} className="hover:text-primary-500">Contact Us</Link></li>
              <li><Link to={ROUTES.PROFILE} className="hover:text-primary-500">My Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4 text-center text-xs">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
