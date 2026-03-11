import { formatCurrency } from '../../../shared/utils/formatters';

/**
 * @param {{ stats: import('../admin.types').AdminStats | null }} props
 */
const AdminStats = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.total_users.toLocaleString() },
    { label: 'Vendors', value: stats.total_vendors.toLocaleString() },
    { label: 'Total Products', value: stats.total_products.toLocaleString() },
    { label: 'Total Orders', value: stats.total_orders.toLocaleString() },
    { label: 'Pending Orders', value: stats.pending_orders.toLocaleString() },
    { label: 'Total Revenue', value: formatCurrency(stats.total_revenue) },
    { label: 'New Users Today', value: stats.new_users_today.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-muted">{card.label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
