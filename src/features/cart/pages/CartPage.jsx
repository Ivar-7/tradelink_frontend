import { useNavigate } from 'react-router-dom';
import useCartHook from '../hooks/useCartHook';
import CartItem from '../components/CartItem';
import EmptyState from '../../../shared/components/EmptyState';
import { formatCurrency } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

const CartPage = () => {
  const { cart, loading, updateItem, removeItem } = useCartHook();
  const navigate = useNavigate();

  if (!cart || cart.products.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse our products and add items to your cart."
        actionLabel="Shop now"
        actionTo={ROUTES.PRODUCTS}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">My Cart</h1>

      <div className="flex flex-col gap-4">
        {cart.products.map((item) => (
          <CartItem
            key={item.product_id}
            item={item}
            onUpdate={(qty) => updateItem(item.product_id, qty)}
            onRemove={() => removeItem(item.product_id)}
          />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-2xl font-bold text-primary-600">{formatCurrency(cart.total_price)}</span>
        </div>
        <button
          disabled={loading}
          onClick={() => navigate(ROUTES.CHECKOUT)}
          className="mt-4 w-full rounded-xl bg-primary-600 py-3 text-base font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
