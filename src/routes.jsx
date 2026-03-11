import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './shared/components/Layout';
import ErrorBoundary from './shared/components/ErrorBoundary';
import SkeletonLoader from './shared/components/SkeletonLoader';
import { ROUTES } from './shared/constants/routes';

const PageLoader = () => (
  <div className="mx-auto max-w-7xl px-4 py-10">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonLoader key={i} className="h-64 w-full" />
      ))}
    </div>
  </div>
);

const withSuspense = (Component) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

// ── Auth ──────────────────────────────────────────────────
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('./features/auth/pages/SignupPage'));

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

// ── Feedback ──────────────────────────────────────────────
const FeedbackPage = lazy(() => import('./features/feedback/pages/FeedbackPage'));

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.PRODUCTS} replace /> },
      { path: ROUTES.PRODUCTS, element: withSuspense(ProductsPage) },
      { path: ROUTES.PRODUCT_DETAIL, element: withSuspense(ProductDetailPage) },
      { path: ROUTES.CART, element: withSuspense(CartPage) },
      { path: ROUTES.CHECKOUT, element: withSuspense(PaymentPage) },
      { path: ROUTES.ORDERS, element: withSuspense(OrdersPage) },
      { path: ROUTES.ORDER_DETAIL, element: withSuspense(OrderDetailPage) },
      { path: ROUTES.PROFILE, element: withSuspense(ProfilePage) },
      { path: ROUTES.FEEDBACK, element: withSuspense(FeedbackPage) },
      { path: ROUTES.VENDOR.DASHBOARD, element: withSuspense(VendorDashboardPage) },
      { path: ROUTES.VENDOR.PRODUCTS, element: withSuspense(VendorProductsPage) },
      { path: ROUTES.ADMIN.DASHBOARD, element: withSuspense(AdminDashboardPage) },
    ],
  },
  {
    path: ROUTES.AUTH.LOGIN,
    element: withSuspense(LoginPage),
  },
  {
    path: ROUTES.AUTH.SIGNUP,
    element: withSuspense(SignupPage),
  },
  {
    path: '*',
    element: (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <p className="text-lg text-foreground">Page not found</p>
        <a href={ROUTES.HOME} className="rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700">
          Go home
        </a>
      </div>
    ),
  },
]);

export default router;
