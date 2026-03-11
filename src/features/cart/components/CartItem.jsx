import { formatCurrency } from '../../../shared/utils/formatters';

/**
 * @param {{ item: import('../cart.types').CartItem, onUpdate: (qty: number) => void, onRemove: () => void }} props
 */
const CartItem = ({ item, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <img
        src={item.product_image}
        alt={item.product_name}
        className="h-20 w-20 rounded-lg object-cover"
      />
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-semibold text-foreground">{item.product_name}</p>
        <p className="text-sm text-muted">{formatCurrency(item.unit_price)} each</p>
        <div className="mt-1 flex items-center gap-2">
          <button
            onClick={() => onUpdate(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-foreground disabled:opacity-40"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantity}</span>
          <button
            onClick={() => onUpdate(item.quantity + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-foreground"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="font-bold text-primary-600">{formatCurrency(item.subtotal)}</p>
        <button onClick={onRemove} className="text-xs text-destructive hover:underline">Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
