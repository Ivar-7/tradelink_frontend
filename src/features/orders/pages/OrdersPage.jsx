import { useOrdersHook } from '../hooks/useOrdersHook';
import OrderCard from '../components/OrderCard';
import EmptyState from '../../../shared/components/EmptyState';
import SkeletonLoader from '../../../shared/components/SkeletonLoader';
import { ROUTES } from '../../../shared/constants/routes';

const OrdersPage = () => {
  const { orders, loading, error } = useOrdersHook();

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonLoader key={i} className="h-24 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">My Orders</h1>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {!orders.length ? (
        <EmptyState
          title="No orders yet"
          message="Place your first order from the shop."
          actionLabel="Shop now"
          actionTo={ROUTES.PRODUCTS}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
