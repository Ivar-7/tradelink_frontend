import { formatCurrency } from '../../../shared/utils/formatters';

/**
 * Displays order/cart summary with items
 */
const OrderSummary = ({ items = [], subtotal = 0, shipping = 0, tax = 0 }) => {
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-lg font-bold text-foreground">Order Summary</h3>

      {/* Items List */}
      <div className="mt-6 space-y-3 border-b border-border pb-6">
        {items.length === 0 ? (
          <p className="text-sm text-muted">No items in your order</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.product_name || 'Product'}</p>
                <p className="text-xs text-muted">
                  {item.quantity} × {formatCurrency(item.unit_price || 0)}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                {formatCurrency(item.subtotal || 0)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
        </div>
        
        {shipping > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Shipping</span>
            <span className="font-semibold text-foreground">{formatCurrency(shipping)}</span>
          </div>
        )}

        {tax > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Tax</span>
            <span className="font-semibold text-foreground">{formatCurrency(tax)}</span>
          </div>
        )}

        <div className="border-t border-border pt-3 flex items-center justify-between">
          <span className="font-bold text-foreground">Total</span>
          <span className="text-2xl font-black text-primary-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Info */}
      <p className="mt-4 text-xs text-muted">
        ✓ Free returns within 30 days
        <br />✓ 24/7 customer support
        <br />✓ Secure payment processing
      </p>
    </div>
  );
};

export default OrderSummary;
