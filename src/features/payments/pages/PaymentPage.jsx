import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartHook from '../../cart/hooks/useCartHook';
import usePaymentsHook from '../hooks/usePaymentsHook';
import { createOrder } from '../../orders/api/ordersApi';
import { formatCurrency, buildRoute } from '../../../shared/utils/formatters';
import { ROUTES } from '../../../shared/constants/routes';

const providerLabel = {
  card: 'Card',
  mpesa: 'M-Pesa',
  bank_transfer: 'Bank Transfer',
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const cart = useCartHook((state) => state.cart);
  const fetchCart = useCartHook((state) => state.fetchCart);
  const clearCart = useCartHook((state) => state.clear);
  const {
    methods,
    loading,
    error,
    fetchMethods,
    addMethod,
    setDefaultMethod,
    removeMethod,
    initiate,
  } = usePaymentsHook();

  const [provider, setProvider] = useState('card');
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [cardBrand, setCardBrand] = useState('Visa');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCart();
    fetchMethods();
  }, [fetchCart, fetchMethods]);

  useEffect(() => {
    const defaultMethod = methods.find((item) => item.is_default);
    if (defaultMethod) {
      setSelectedMethodId(defaultMethod.id);
    }
  }, [methods]);

  const cartItems = useMemo(() => cart?.products ?? [], [cart]);

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [cartItems]);

  const handleAddMethod = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (cardNumber.replace(/\s/g, '').length < 12) {
      setLocalError('Enter a valid card number.');
      return;
    }

    try {
      await addMethod({
        brand: cardBrand,
        card_number: cardNumber.replace(/\s/g, ''),
        expiry_month: expiryMonth,
        expiry_year: expiryYear,
        holder_name: holderName,
      });

      setHolderName('');
      setCardNumber('');
      setExpiryMonth('');
      setExpiryYear('');
      setSuccessMessage('Payment method added.');
    } catch {
      // hook error displayed
    }
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (cartItems.length === 0) {
      setLocalError('Your cart is empty.');
      return;
    }

    if (provider === 'card' && !selectedMethodId) {
      setLocalError('Select a saved card.');
      return;
    }

    if (provider === 'mpesa' && !phoneNumber.trim()) {
      setLocalError('Phone number is required for M-Pesa.');
      return;
    }

    try {
      const order = await createOrder({
        shipping_method: 'delivery',
        products: cartItems,
        delivery_address: {
          county: 'Nairobi',
          city: 'Westlands',
          postal_address: 'P.O. Box 1001',
          user_contact: phoneNumber || '+254700000000',
        },
      });

      await initiate({
        order_id: order.id,
        payment_provider: provider,
        payment_method_id: provider === 'card' ? selectedMethodId : undefined,
        phone_number: provider === 'mpesa' ? phoneNumber : undefined,
        amount: summary.total,
      });

      await clearCart();
      navigate(buildRoute(ROUTES.ORDER_DETAIL, { id: order.id }));
    } catch {
      // hook/local errors shown in UI
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 lg:px-6">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Checkout & Payment</h1>
        <p className="mt-2 text-sm text-muted">Complete your purchase securely and place your order.</p>
      </header>

      {cartItems.length === 0 ? (
        <section className="rounded-2xl border border-border bg-surface p-10 text-center">
          <h2 className="text-2xl font-black text-foreground">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted">Add products before proceeding to checkout.</p>
          <Link
            to={ROUTES.PRODUCTS}
            className="mt-6 inline-flex rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
          >
            Browse Products
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-xl font-black tracking-tight text-foreground">Payment Provider</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {Object.keys(providerLabel).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setProvider(item)}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                      provider === item
                        ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'border-border bg-slate-100 text-foreground hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800'
                    }`}
                  >
                    {providerLabel[item]}
                  </button>
                ))}
              </div>

              {provider === 'mpesa' ? (
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Phone Number</label>
                  <input
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    type="tel"
                    placeholder="e.g. +254700123456"
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight text-foreground">Saved Payment Methods</h2>
              </div>

              {methods.length === 0 ? (
                <p className="text-sm text-muted">No saved cards yet. Add one below.</p>
              ) : (
                <div className="space-y-3">
                  {methods.map((method) => (
                    <article key={method.id} className="rounded-xl border border-border bg-slate-50 p-4 dark:bg-slate-900/40">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="radio"
                            checked={selectedMethodId === method.id}
                            onChange={() => setSelectedMethodId(method.id)}
                            className="h-4 w-4 border-border text-primary-600"
                          />
                          <span className="text-sm font-semibold text-foreground">
                            {method.brand} ending in {method.last4}
                          </span>
                          {method.is_default ? (
                            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                              Default
                            </span>
                          ) : null}
                        </label>

                        <div className="flex items-center gap-3">
                          {!method.is_default ? (
                            <button
                              type="button"
                              onClick={() => setDefaultMethod(method.id)}
                              className="text-xs font-semibold text-primary-600 hover:underline"
                            >
                              Set default
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => removeMethod(method.id)}
                            className="text-xs font-semibold text-destructive hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleAddMethod} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-xl font-black tracking-tight text-foreground">Add Payment Method</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Card Holder</label>
                  <input
                    value={holderName}
                    onChange={(event) => setHolderName(event.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Brand</label>
                  <select
                    value={cardBrand}
                    onChange={(event) => setCardBrand(event.target.value)}
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="American Express">American Express</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Card Number</label>
                  <input
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value)}
                    required
                    placeholder="4111 1111 1111 1111"
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Expiry Month</label>
                  <input
                    value={expiryMonth}
                    onChange={(event) => setExpiryMonth(event.target.value)}
                    required
                    placeholder="MM"
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Expiry Year</label>
                  <input
                    value={expiryYear}
                    onChange={(event) => setExpiryYear(event.target.value)}
                    required
                    placeholder="YY"
                    className="w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 rounded-lg border border-border bg-slate-100 px-4 py-2.5 text-sm font-bold text-foreground hover:bg-slate-200 disabled:opacity-60 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                Add Method
              </button>
            </form>
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="text-xl font-black tracking-tight text-foreground">Order Summary</h2>
              <div className="mt-4 space-y-2 border-b border-border pb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold text-foreground">{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Shipping</span>
                  <span className="font-semibold text-foreground">{summary.shipping === 0 ? 'Free' : formatCurrency(summary.shipping)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-2xl font-black text-primary-600">{formatCurrency(summary.total)}</span>
              </div>

              <form onSubmit={handleCheckout} className="mt-6">
                <button
                  type="submit"
                  disabled={loading || summary.total <= 0}
                  className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
                >
                  Pay Now
                </button>
              </form>

              <p className="mt-3 text-xs text-muted">This will create the order, process payment, and redirect to order details.</p>
            </div>
          </aside>
        </div>
      )}

      {localError ? <p className="mt-6 text-sm font-medium text-destructive">{localError}</p> : null}
      {error ? <p className="mt-2 text-sm font-medium text-destructive">{error}</p> : null}
      {successMessage ? <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">{successMessage}</p> : null}
    </div>
  );
};

export default PaymentPage;
