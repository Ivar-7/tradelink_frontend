import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './shared/components/Layout';
import ErrorBoundary from './shared/components/ErrorBoundary';
import PageLoader from './shared/components/PageLoader';
import NotFoundPage from './shared/components/NotFoundPage';
import { ROUTES } from './shared/constants/routes';

const withSuspense = (Component) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

// ── Home ──────────────────────────────────────────────────
const HomePage = lazy(() => import('./features/home/pages/HomePage'));

// ── Auth ──────────────────────────────────────────────────
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('./features/auth/pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./features/auth/pages/ForgotPasswordPage'));
const UnsubscribeConfirmationPage = lazy(() => import('./features/auth/pages/UnsubscribeConfirmationPage'));

// ── Products ──────────────────────────────────────────────
const ProductsPage = lazy(() => import('./features/products/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./features/products/pages/ProductDetailPage'));

// ── Cart ──────────────────────────────────────────────────
const CartPage = lazy(() => import('./features/cart/pages/CartPage'));

// ── Orders ────────────────────────────────────────────────
const OrdersPage = lazy(() => import('./features/orders/pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./features/orders/pages/OrderDetailPage'));

// ── Payments ──────────────────────────────────────────────
const PaymentPage = lazy(() => import('./features/payments/pages/PaymentPage'));

// ── Profile ───────────────────────────────────────────────
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage'));

// ── Vendor ────────────────────────────────────────────────
const VendorDashboardPage = lazy(() => import('./features/vendor/pages/VendorDashboardPage'));
const VendorProductsPage = lazy(() => import('./features/vendor/pages/VendorProductsPage'));

// ── Admin ─────────────────────────────────────────────────
const AdminDashboardPage = lazy(() => import('./features/admin/pages/AdminDashboardPage'));

// ── Reviews ───────────────────────────────────────────────
const ReviewsPage = lazy(() => import('./features/reviews/pages/ReviewsPage'));

// ── Feedback ──────────────────────────────────────────────
const FeedbackPage = lazy(() => import('./features/feedback/pages/FeedbackPage'));

const router = createBrowserRouter([
  // All pages — one shared Layout with global Navbar and Footer
  {
    element: <Layout />,
    children: [
      { path: ROUTES.AUTH.LOGIN, element: withSuspense(LoginPage) },
      { path: ROUTES.AUTH.SIGNUP, element: withSuspense(SignupPage) },
      { path: ROUTES.AUTH.FORGOT_PASSWORD, element: withSuspense(ForgotPasswordPage) },
      { path: ROUTES.AUTH.UNSUBSCRIBE_CONFIRMATION, element: withSuspense(UnsubscribeConfirmationPage) },
      { path: ROUTES.HOME, element: withSuspense(HomePage) },
      { path: ROUTES.PRODUCTS, element: withSuspense(ProductsPage) },
      { path: ROUTES.PRODUCT_DETAIL, element: withSuspense(ProductDetailPage) },
      { path: ROUTES.CART, element: withSuspense(CartPage) },
      { path: ROUTES.CHECKOUT, element: withSuspense(PaymentPage) },
      { path: ROUTES.ORDERS, element: withSuspense(OrdersPage) },
      { path: ROUTES.ORDER_DETAIL, element: withSuspense(OrderDetailPage) },
      { path: ROUTES.PROFILE, element: withSuspense(ProfilePage) },
      { path: ROUTES.REVIEWS, element: withSuspense(ReviewsPage) },
      { path: ROUTES.FEEDBACK, element: withSuspense(FeedbackPage) },
      { path: ROUTES.VENDOR.DASHBOARD, element: withSuspense(VendorDashboardPage) },
      { path: ROUTES.VENDOR.PRODUCTS, element: withSuspense(VendorProductsPage) },
      { path: ROUTES.ADMIN.DASHBOARD, element: withSuspense(AdminDashboardPage) },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);

export default router;
