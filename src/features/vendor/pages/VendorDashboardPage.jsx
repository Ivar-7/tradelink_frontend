import { useVendorDashboardHook } from '../hooks/useVendorHook';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';
import { formatCurrency } from '../../../shared/utils/formatters';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-border bg-surface p-5">
    <p className="text-sm text-muted">{label}</p>
    <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const VendorDashboardPage = () => {
  const { dashboard, loading, error } = useVendorDashboardHook();

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-24 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 lg:px-6">
      <header className="mb-8 rounded-2xl border border-border bg-surface p-6">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Vendor Dashboard</h1>
        <p className="mt-2 text-sm text-muted">Monitor sales performance and manage your Sony storefront.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to={ROUTES.VENDOR.PRODUCTS} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            Open Storefront
          </Link>
          <Link to={ROUTES.ORDERS} className="rounded-lg border border-border bg-slate-100 px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800">
            View Marketplace Orders
          </Link>
        </div>
      </header>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {dashboard && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Total Revenue" value={formatCurrency(dashboard.total_revenue)} />
            <StatCard label="Total Orders" value={dashboard.total_orders} />
            <StatCard label="Pending Orders" value={dashboard.pending_orders} />
            <StatCard label="Active Products" value={dashboard.active_products} />
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Orders</h2>
            <div className="flex flex-col gap-2">
              {dashboard.recent_orders.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">#{order.id}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-muted">{order.status}</span>
                  <span className="text-sm font-medium text-primary-600">{formatCurrency(order.order_amount)}</span>
                </div>
              ))}

              {!dashboard.recent_orders.length ? (
                <div className="rounded-lg border border-border bg-surface px-4 py-6 text-center text-sm text-muted">
                  No vendor-mapped orders yet. Keep your storefront active and promoted.
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDashboardPage;
