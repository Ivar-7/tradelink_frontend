import { formatCurrency } from '../../../shared/utils/formatters';

/**
 * @param {{ product: import('../vendor.types').VendorProductInput & { id: string }, onEdit?: () => void, onDelete: () => void }} props
 */
const VendorProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <img
        src={product.image_url}
        alt={product.name}
        className="h-16 w-16 rounded-lg object-cover"
      />
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-semibold text-foreground">{product.name}</p>
        <p className="text-sm text-primary-600 font-medium">{formatCurrency(product.price)}</p>
        <p className="text-xs text-muted">Stock: {product.stock_quantity}</p>
      </div>
      <div className="flex gap-2">
        {onEdit ? (
          <button
            onClick={onEdit}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-border"
          >
            Edit
          </button>
        ) : null}
        <button
          onClick={onDelete}
          className="rounded-lg bg-destructive px-3 py-1 text-xs font-medium text-white hover:opacity-80"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default VendorProductCard;
