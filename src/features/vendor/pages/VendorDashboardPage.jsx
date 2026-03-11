import { useVendorDashboardHook } from '../hooks/useVendorHook';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';
import { formatCurrency } from '../../../shared/utils/formatters';

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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Vendor Dashboard</h1>

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
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
                  <span className="text-sm text-muted">#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-sm capitalize text-foreground">{order.status}</span>
                  <span className="text-sm font-medium text-primary-600">{formatCurrency(order.order_amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDashboardPage;
