import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCartHook from '../../cart/hooks/useCartHook';
import usePaymentHook from '../hooks/usePaymentHook';
import CheckoutForm from '../components/CheckoutForm';
import PaymentStatus from '../components/PaymentStatus';
import OrderSummary from '../components/OrderSummary';
import { useAuthHook } from '../../auth/hooks/useAuthHook';
import { ROUTES } from '../../../shared/constants/routes';
import { useToast } from '../../../shared/hooks/useToastHook';
import * as cartApi from '../../cart/api/cartApi';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { user } = useAuthHook();

  // Cart state
  const cart = useCartHook((state) => state.cart);
  const fetchCart = useCartHook((state) => state.fetchCart);

  // Payment state
  const {
    paymentStatus,
    loading: paymentLoading,
    error: paymentError,
    initiatePayment,
    pollPaymentStatus,
    fulfillPayment,
    resetPayment,
    cleanup,
  } = usePaymentHook();

  // Local state
  const [currentStep, setCurrentStep] = useState('form'); // form, processing, success, error
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    // Fetch cart on mount
    fetchCart();

    const pollRef = pollIntervalRef.current;
    return () => {
      cleanup();
      if (pollRef) {
        clearInterval(pollRef);
      }
    };
  }, [fetchCart, cleanup]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      addToast({ message: 'Please log in to proceed with checkout', type: 'info' });
      navigate(ROUTES.AUTH.LOGIN, { state: { from: location.pathname } });
    }
  }, [addToast, location, navigate, user]);

  const handleCheckoutSubmit = async (formData) => {
    if (!cart || cart.products.length === 0) {
      addToast({ message: 'Your cart is empty', type: 'error' });
      return;
    }

    setCurrentStep('processing');

    // Normalize phone number (remove spaces/dashes)
    const normalizedPhone = formData.phone_number.replace(/[\s-]/g, '');

    // Initiate payment
    const initResult = await initiatePayment({
      phone_number: normalizedPhone,
      amount: Math.round(cart.total_price || 0),
      provider: formData.provider,
      external_reference: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      shipping_method: formData.shipping_method,
      county: formData.county,
      delivery_address: formData.delivery_address,
      notes: formData.notes,
      agree_terms: formData.agree_terms,
    });

    if (!initResult.success) {
      setCurrentStep('error');
      return;
    }

    // Start polling for payment status
    const handleStatusChange = async (status) => {
      if (status === 'completed') {
        // Payment successful - fulfill order
        setCurrentStep('success');

        try {
          const fulfillResult = await fulfillPayment({
            user_id: user.id,
            amount: cart.total_price,
            items: cart.products,
            shipping_method: formData.shipping_method,
            delivery_address: formData.delivery_address,
            notes: formData.notes,
          });

          if (fulfillResult.success) {
            // Clear cart after successful order
            await cartApi.clearCart();
            
            // Redirect to order detail page
            setTimeout(() => {
              navigate(ROUTES.ORDERS.DETAIL(fulfillResult.order.id));
              addToast({ message: 'Order placed successfully!', type: 'success' });
            }, 2000);
          }
        } catch (err) {
          console.error('Fulfillment error:', err);
          addToast({ message: 'Order creation failed. Please contact support.', type: 'error' });
        }
      } else if (status === 'failed') {
        setCurrentStep('error');
      }
    };

    // Poll for status
    await pollPaymentStatus(initResult.providerReference, handleStatusChange);
  };

  const handleRetry = () => {
    resetPayment();
    setCurrentStep('form');
  };

  // Redirect if no cart
  if (!user) {
    return null;
  }

  if (!cart) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 mx-auto rounded bg-slate-200 dark:bg-slate-900" />
            <div className="h-4 w-64 mx-auto mt-4 rounded bg-slate-200 dark:bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  const isEmptyCart = !cart.products || cart.products.length === 0;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 lg:px-6">
      {/* Header */}
      <header className="mb-8 border-b border-border pb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-600">Secure Checkout</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground">Complete Your Purchase</h1>
        <p className="mt-2 text-sm text-muted">Review your items and finalize payment</p>
      </header>

      {/* Empty Cart */}
      {isEmptyCart && (
        <section className="rounded-2xl border border-border bg-surface p-8 text-center md:p-12">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-5xl dark:bg-slate-900">
            🛒
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-foreground">Your cart is empty</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Add some products to proceed with checkout.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.PRODUCTS)}
            className="mt-8 inline-flex rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700"
          >
            Continue Shopping
          </button>
        </section>
      )}

      {!isEmptyCart && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'form' && <CheckoutForm cartTotal={cart.total_price} onSubmit={handleCheckoutSubmit} loading={paymentLoading} />}

            {currentStep === 'processing' && (
              <PaymentStatus
                status={paymentStatus}
                error={paymentError}
                maxAttempts={12}
              />
            )}

            {currentStep === 'success' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/40 dark:bg-emerald-900/20">
                <div className="flex justify-center">
                  <div className="rounded-full bg-emerald-100 p-4 text-5xl dark:bg-emerald-900/40">✅</div>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                  Order Placed Successfully!
                </h3>
                <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200">
                  Your payment has been confirmed and your order is being processed.
                </p>
                <p className="mt-4 text-xs text-emerald-700 dark:text-emerald-400">
                  You will be redirected to your order details shortly...
                </p>
              </div>
            )}

            {currentStep === 'error' && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
                <div className="flex justify-center">
                  <div className="rounded-full bg-destructive/10 p-4 text-5xl">⚠️</div>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-destructive">Payment Failed</h3>
                <p className="mt-2 text-sm text-destructive/80">
                  {paymentError || 'There was an issue processing your payment. Please try again.'}
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary items={cart.products || []} subtotal={cart.total_price || 0} shipping={0} tax={0} />

              {/* Trust Badges */}
              <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
                <h4 className="text-sm font-bold text-foreground">We Keep You Safe</h4>
                <ul className="mt-4 space-y-3 text-xs text-muted">
                  <li className="flex items-center gap-2">
                    <span>🔒</span> SSL encrypted checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> PCI DSS compliant
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🛡️</span> Fraud protection
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💳</span> Secure M-Pesa integration
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
