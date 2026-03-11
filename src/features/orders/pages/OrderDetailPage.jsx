import { useParams } from 'react-router-dom';
import { useOrderDetailHook } from '../hooks/useOrdersHook';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';
import EmptyState from '../../../shared/components/EmptyState';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';
import { ORDER_STATUS } from '../../../shared/constants/app';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { order, loading, error, confirmDelivery } = useOrderDetailHook(id);

  if (loading) {
    return <div className="mx-auto max-w-2xl px-4 py-8"><SkeletonLoader className="h-64 w-full" /></div>;
  }

  if (error || !order) {
    return <EmptyState title="Order not found" message={error ?? ''} actionLabel="Back to orders" actionTo={ROUTES.ORDERS} />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Order #{order.id.slice(0, 8).toUpperCase()}
      </h1>
      <p className="mb-6 text-sm text-muted">{formatDate(order.order_date)}</p>

      <div className="flex flex-col gap-4">
        {order.products.map((item) => (
          <div key={item.product_id} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
            <img src={item.product_image} alt={item.product_name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{item.product_name}</p>
              <p className="text-sm text-muted">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
            </div>
            <p className="font-bold text-primary-600">{formatCurrency(item.subtotal)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <div className="flex justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-primary-600">{formatCurrency(order.order_amount)}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-sm text-muted">Status</span>
          <span className="text-sm font-medium capitalize text-foreground">{order.status}</span>
        </div>
      </div>

      {order.status === ORDER_STATUS.SHIPPED && (
        <button
          onClick={confirmDelivery}
          className="mt-6 w-full rounded-xl bg-success py-3 text-base font-semibold text-white hover:opacity-90"
        >
          Confirm Delivery
        </button>
      )}
    </div>
  );
};

export default OrderDetailPage;
