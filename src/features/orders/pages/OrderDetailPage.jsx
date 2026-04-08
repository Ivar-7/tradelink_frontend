import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrderDetailHook } from '../hooks/useOrdersHook';
import { orderIssueTypes } from '../data/ordersData';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

const statusLabel = {
  pending: 'Pending',
  confirmed: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
};

const returnSteps = ['requested', 'approved', 'shipped_back', 'refunded'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const { order, loading, error, confirmDelivery, cancelOrder, reportIssue, initiateReturn } =
    useOrderDetailHook(id);

  const [cancelReason, setCancelReason] = useState('');
  const [issueType, setIssueType] = useState(orderIssueTypes[0]);
  const [issueDetails, setIssueDetails] = useState('');
  const [returnReason, setReturnReason] = useState(orderIssueTypes[0]);
  const [returnNotes, setReturnNotes] = useState('');
  const [message, setMessage] = useState('');

  if (loading && !order) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-10 lg:px-6">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-10 lg:px-6">
        <h1 className="text-2xl font-black text-foreground">Order not found</h1>
        <Link to={ROUTES.ORDERS} className="mt-4 inline-flex text-sm font-semibold text-primary-600 hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const canCancel = order.status === 'pending' || order.status === 'confirmed';
  const canConfirmDelivery = order.status === 'shipped';
  const canReportIssue = order.status === 'delivered' || order.status === 'cancelled';
  const canInitiateReturn = order.status === 'delivered' && !order.return_request;

  const handleCancelOrder = async (event) => {
    event.preventDefault();
    try {
      await cancelOrder(cancelReason || 'Cancelled by customer');
      setMessage('Order cancelled successfully.');
      setCancelReason('');
    } catch {
      // Error shown by hook
    }
  };

  const handleReportIssue = async (event) => {
    event.preventDefault();
    try {
      await reportIssue({ type: issueType, details: issueDetails });
      setMessage('Issue submitted. Our team will review it shortly.');
      setIssueDetails('');
    } catch {
      // Error shown by hook
    }
  };

  const handleInitiateReturn = async (event) => {
    event.preventDefault();
    try {
      await initiateReturn({ reason: returnReason, notes: returnNotes });
      setMessage('Return request created successfully.');
      setReturnNotes('');
    } catch {
      // Error shown by hook
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 lg:px-6">
      <nav className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        <Link to={ROUTES.ORDERS} className="hover:text-primary-600">My Orders</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Order {order.id}</span>
      </nav>

      <header className="mb-6 rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Order #{order.id}</h1>
            <p className="mt-1 text-sm text-muted">Placed on {formatDate(order.order_date)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${statusStyles[order.status]}`}>
            {statusLabel[order.status]}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Total Amount</p>
            <p className="mt-1 text-sm font-bold text-primary-600">{formatCurrency(order.order_amount)}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Shipping Method</p>
            <p className="mt-1 text-sm font-semibold capitalize text-foreground">{order.shipping_method}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Tracking</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{order.tracking_number ?? 'Not assigned yet'}</p>
          </div>
        </div>

        {(order.status === 'shipped' || order.status === 'delivered') ? (
          <div className="mt-5 rounded-lg border border-border p-4">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Delivery Timeline</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {['Placed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, index) => {
                const activeSteps = order.status === 'delivered' ? 4 : 2;
                const isActive = index < activeSteps;
                return (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${
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
      </header>

      {order.delivery_address ? (
        <section className="mb-6 rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-3 text-lg font-bold text-foreground">Delivery Address</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">County</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{order.delivery_address.county}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">City</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{order.delivery_address.city}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Postal Address</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{order.delivery_address.postal_address}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Contact</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{order.delivery_address.user_contact}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mb-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">Order Items</h2>
        <div className="space-y-3">
          {order.products.map((item) => (
            <div key={item.product_id} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/40">
              <div className="flex min-w-0 items-center gap-3">
                <img src={item.product_image} alt={item.product_name} className="h-16 w-16 rounded-md object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{item.product_name}</p>
                  <p className="text-xs text-muted">Qty {item.quantity}</p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-bold text-foreground">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-lg font-bold text-foreground">Order Actions</h3>

          {canConfirmDelivery ? (
            <button
              type="button"
              onClick={confirmDelivery}
              className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700"
            >
              Confirm Delivery
            </button>
          ) : null}

          {canCancel ? (
            <form onSubmit={handleCancelOrder} className="mt-4 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Cancellation Reason
              </label>
              <textarea
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                rows={3}
                placeholder="Why are you cancelling this order?"
                className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
              >
                Cancel Order
              </button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-muted">This order cannot be cancelled at its current status.</p>
          )}

          {order.cancellation_reason ? (
            <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
              Cancelled reason: {order.cancellation_reason}
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-lg font-bold text-foreground">Support & Returns</h3>

          {canReportIssue ? (
            <form onSubmit={handleReportIssue} className="mt-4 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-muted">Issue Type</label>
              <select
                value={issueType}
                onChange={(event) => setIssueType(event.target.value)}
                className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
              >
                {orderIssueTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <textarea
                value={issueDetails}
                onChange={(event) => setIssueDetails(event.target.value)}
                rows={3}
                placeholder="Share issue details..."
                className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
              />

              <button
                type="submit"
                disabled={loading || !issueDetails.trim()}
                className="w-full rounded-lg border border-border bg-slate-100 px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-slate-200 disabled:opacity-60 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                Report Issue
              </button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-muted">Issue reporting unlocks once the order is delivered.</p>
          )}

          {canInitiateReturn ? (
            <form onSubmit={handleInitiateReturn} className="mt-6 space-y-3 border-t border-border pt-5">
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-muted">Return Reason</label>
              <select
                value={returnReason}
                onChange={(event) => setReturnReason(event.target.value)}
                className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
              >
                {orderIssueTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <textarea
                value={returnNotes}
                onChange={(event) => setReturnNotes(event.target.value)}
                rows={3}
                placeholder="Additional notes for your return..."
                className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
              />

              <button
                type="submit"
                disabled={loading || !returnNotes.trim()}
                className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
              >
                Initiate Return
              </button>
            </form>
          ) : null}
        </section>
      </div>

      {order.return_request ? (
        <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-lg font-bold text-foreground">Return Status</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Return ID</p>
              <p className="mt-1 text-sm font-semibold text-foreground">#{order.return_request.id}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Status</p>
              <p className="mt-1 text-sm font-semibold capitalize text-foreground">{order.return_request.status.replace('_', ' ')}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Reason</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{order.return_request.reason}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Created</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{formatDate(order.return_request.created_at)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-border p-4">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Return Timeline</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {returnSteps.map((step) => {
                const activeIndex = returnSteps.indexOf(order.return_request.status);
                const stepIndex = returnSteps.indexOf(step);
                const isActive = stepIndex <= activeIndex;
                return (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${
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
        </section>
      ) : null}

      {order.issue_report ? (
        <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-lg font-bold text-foreground">Latest Issue Report</h3>
          <p className="mt-2 text-sm text-muted">{order.issue_report.type}</p>
          <p className="mt-2 text-sm text-foreground">{order.issue_report.details}</p>
        </section>
      ) : null}

      {message ? <p className="mt-6 text-sm font-medium text-emerald-600 dark:text-emerald-400">{message}</p> : null}
      {error ? <p className="mt-3 text-sm font-medium text-destructive">{error}</p> : null}
    </div>
  );
};

export default OrderDetailPage;
