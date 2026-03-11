import { formatCurrency, formatDate, buildRoute } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  pending: 'bg-warning text-white',
  confirmed: 'bg-primary-600 text-white',
  shipped: 'bg-accent text-white',
  delivered: 'bg-success text-white',
  cancelled: 'bg-destructive text-white',
};

/**
 * @param {{ order: import('../orders.types').Order }} props
 */
const OrderCard = ({ order }) => {
  const detailPath = buildRoute(ROUTES.ORDER_DETAIL, { id: order.id });

  return (
    <Link
      to={detailPath}
      className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-sm text-muted">{formatDate(order.order_date)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{order.products.length} item(s)</p>
        <p className="font-bold text-primary-600">{formatCurrency(order.order_amount)}</p>
      </div>
    </Link>
  );
};

export default OrderCard;
