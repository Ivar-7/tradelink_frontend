import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useOrdersHook } from '../hooks/useOrdersHook';
import { orderTabs } from '../data/ordersData';
import { formatCurrency, formatDate, buildRoute } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';
import { useAuthHook } from '../../auth/hooks/useAuthHook';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
};

const readableStatus = {
  pending: 'Pending',
  confirmed: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const returnStepOrder = ['requested', 'approved', 'shipped_back', 'refunded'];

const statusDescription = (order) => {
  if (order.return_request) {
    const step = order.return_request.status.replace('_', ' ');
    return `Return ${order.return_request.id} is currently ${step}.`;
  }

  if (order.status === 'pending') return 'Waiting for payment confirmation or fulfillment.';
  if (order.status === 'confirmed') return 'Your items are being prepared for shipment.';
  if (order.status === 'shipped') return `In transit${order.tracking_number ? ` • Tracking ${order.tracking_number}` : ''}.`;
  if (order.status === 'delivered') return 'Delivered successfully.';
  if (order.status === 'cancelled') {
    return `Cancelled${order.cancellation_reason ? ` • ${order.cancellation_reason}` : ''}.`;
  }

  return 'Order is being processed.';
};

const OrdersPage = () => {
  const { logout } = useAuthHook();
  const { orders, activeStatus, setActiveStatus, loading, error } = useOrdersHook('all');

  const summary = useMemo(() => {
    const totalValue = orders.reduce((sum, order) => sum + order.order_amount, 0);
    return {
      count: orders.length,
      totalValue,
    };
  }, [orders]);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-8 lg:px-6">
      <aside className="hidden h-fit w-64 shrink-0 rounded-2xl border border-border bg-surface p-5 lg:block">
        <h2 className="text-lg font-bold text-foreground">Account Menu</h2>
        <p className="mt-1 text-xs text-muted">Manage your profile</p>

        <nav className="mt-6 space-y-1">
          <Link
            to={ROUTES.PROFILE}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900"
          >
            Dashboard
          </Link>
          <Link
            to={ROUTES.ORDERS}
            className="block w-full rounded-lg bg-primary-100 px-3 py-2 text-left text-sm font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
          >
            My Orders
          </Link>
          <Link
            to={ROUTES.PROFILE}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900"
          >
            Address Book
          </Link>
          <Link
            to={ROUTES.CHECKOUT}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-900"
          >
            Payment Methods
          </Link>
          <button
            type="button"
            onClick={logout}
            className="mt-4 w-full rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-left text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            Log Out
          </button>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-foreground">My Orders</h1>
          <p className="mt-2 text-sm text-muted">View and manage all your purchases and returns.</p>
        </header>

        <section className="mb-8 rounded-xl border border-border bg-surface p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Current View</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{summary.count} order(s)</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Value</p>
              <p className="mt-1 text-sm font-semibold text-primary-600">{formatCurrency(summary.totalValue)}</p>
            </div>
          </div>
        </section>

        <div className="mb-8 flex gap-6 overflow-x-auto border-b border-border pb-1">
          {orderTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStatus(tab.key)}
              className={`whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
                activeStatus === tab.key
                  ? 'border-b-2 border-primary-600 font-bold text-primary-600'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center">
            <h2 className="text-2xl font-black tracking-tight text-foreground">No orders in this tab</h2>
            <p className="mt-2 text-sm text-muted">Try a different status or place a new order from products.</p>
            <Link
              to={ROUTES.PRODUCTS}
              className="mt-6 inline-flex rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
            >
              Shop products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const detailPath = buildRoute(ROUTES.ORDER_DETAIL, { id: order.id });
              return (
                <article key={order.id} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                  <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4">
                    <div className="grid gap-4 sm:grid-cols-3 sm:gap-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Order Number</p>
                        <p className="mt-1 text-sm font-bold text-foreground">#{order.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Placed On</p>
                        <p className="mt-1 text-sm text-foreground">{formatDate(order.order_date)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Total</p>
                        <p className="mt-1 text-sm font-bold text-primary-600">{formatCurrency(order.order_amount)}</p>
                      </div>
                    </div>

                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${statusStyles[order.status]}`}>
                      {readableStatus[order.status]}
                    </span>
                  </header>

                  <div className="px-5 py-4">
                    <div className="mb-4 rounded-lg bg-slate-50 p-3 text-xs font-medium text-muted dark:bg-slate-900/50">
                      {statusDescription(order)}
                    </div>

                    {order.status === 'shipped' || order.status === 'delivered' ? (
                      <div className="mb-4 rounded-lg border border-border p-3">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Shipping Progress</p>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {['Placed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => {
                            const activeSteps = order.status === 'delivered' ? 4 : 2;
                            const isActive = index < activeSteps;
                            return (
                              <div key={step} className="flex flex-col items-center gap-2">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${
                                    isActive ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'
                                  }`}
                                />
                                <span className={`text-[10px] font-semibold ${isActive ? 'text-foreground' : 'text-muted'}`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {order.return_request ? (
                      <div className="mb-4 rounded-lg border border-border p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Return Progress</p>
                          <p className="text-xs font-semibold text-foreground">{order.return_request.id}</p>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {returnStepOrder.map((step) => {
                            const activeIndex = returnStepOrder.indexOf(order.return_request.status);
                            const currentIndex = returnStepOrder.indexOf(step);
                            const isActive = currentIndex <= activeIndex;
                            return (
                              <div key={step} className="flex flex-col items-center gap-2">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${
                                    isActive ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'
                                  }`}
                                />
                                <span className={`text-[10px] font-semibold capitalize ${isActive ? 'text-foreground' : 'text-muted'}`}>
                                  {step.replace('_', ' ')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {order.products.slice(0, 2).map((item) => (
                        <div key={item.product_id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">{item.product_name}</p>
                            <p className="text-xs text-muted">Qty {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-muted">
                        {order.products.length} item(s)
                        {order.return_request ? ' • Return in progress' : ''}
                      </p>
                      <Link
                        to={detailPath}
                        className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {error ? <p className="mt-6 text-sm font-medium text-destructive">{error}</p> : null}
      </main>
    </div>
  );
};

export default OrdersPage;
