import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import useCartHook from '../hooks/useCartHook';
import { formatCurrency } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

const CartPage = () => {
  const cart = useCartHook((state) => state.cart);
  const loading = useCartHook((state) => state.loading);
  const error = useCartHook((state) => state.error);
  const fetchCart = useCartHook((state) => state.fetchCart);
  const updateItem = useCartHook((state) => state.updateItem);
  const removeItem = useCartHook((state) => state.removeItem);
  const clear = useCartHook((state) => state.clear);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartItems = useMemo(() => cart?.products ?? [], [cart]);

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const total = cart?.total_price ?? subtotal;
    return { subtotal, total };
  }, [cart?.total_price, cartItems]);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 lg:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-600">Cart</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground">Shopping Cart</h1>
          <p className="mt-2 text-sm text-muted">Review your items from your live cart data.</p>
        </div>

        <Link
          to={ROUTES.PRODUCTS}
          className="rounded-lg border border-border bg-slate-100 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          Continue Shopping
        </Link>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
        </div>
      ) : cartItems.length === 0 ? (
        <section className="rounded-2xl border border-border bg-surface p-8 text-center md:p-12">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-5xl dark:bg-slate-900">
            🛒
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-foreground">Your cart is empty</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Add products from the catalog to see them here with live totals, quantity controls,
            and checkout summary.
          </p>
          <Link
            to={ROUTES.PRODUCTS}
            className="mt-8 inline-flex rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700"
          >
            Browse Products
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-5 lg:col-span-8">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Items ({cartItems.length})</h2>
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs font-bold uppercase tracking-[0.15em] text-destructive hover:underline"
                >
                  Clear cart
                </button>
              </div>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cart_item_id}
                    item={item}
                    onUpdate={(nextQty) => updateItem(item.cart_item_id, item.product_id, nextQty)}
                    onRemove={() => removeItem(item.cart_item_id)}
                  />
                ))}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <h2 className="text-xl font-black tracking-tight text-foreground">Order Summary</h2>

              <div className="mt-5 space-y-3 border-b border-border pb-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold text-foreground">{formatCurrency(summary.subtotal)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-2xl font-black text-primary-600">{formatCurrency(summary.total)}</span>
              </div>

              <Link
                to={ROUTES.CHECKOUT}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-primary-700"
              >
                Proceed to checkout
              </Link>

              <p className="mt-4 text-xs text-muted">
                Totals are based on the current cart values from the backend.
              </p>
            </div>
          </aside>
        </div>
      )}

      {error ? <p className="mt-6 text-sm font-medium text-destructive">{error}</p> : null}
    </div>
  );
};

export default CartPage;
