// pages/payment/PaymentPage.jsx
import { useEffect, useMemo, useState } from 'react';
import PaymentForm from '../components/PaymentForm';
import PaymentConfirm from '../components/PaymentConfirm';
import PaymentFailure from '../components/PaymentFailure';
import StkPush from '../components/StkPush';
import usePaymentsHook from '../hooks/usePaymentsHook';
import useCartHook from '../../cart/hooks/useCartHook';

const VERIFY_ATTEMPTS = 6;
const VERIFY_INTERVAL_MS = 4000;

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const PaymentPage = () => {
  const cart = useCartHook((state) => state.cart);
  const cartLoading = useCartHook((state) => state.loading);
  const cartError = useCartHook((state) => state.error);
  const fetchCart = useCartHook((state) => state.fetchCart);
  const [step, setStep] = useState('form');
  const [paymentDetails, setPaymentDetails] = useState({
    orderId: '',
    amount: 0,
    phoneNumber: '',
    customerName: '',
    email: '',
    pickupLocation: ''
  });
  const [transactionId, setTransactionId] = useState(null);
  const { error, initiate, verify, loading } = usePaymentsHook();

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, [cart, fetchCart]);

  useEffect(() => {
    if (!cart) return;
    setPaymentDetails((prev) => ({
      ...prev,
      // Use order id placeholder from local cache when available; backend order creation can set this key.
      orderId: localStorage.getItem('checkout_order_id') || prev.orderId || '',
      amount: Number(cart.total_price ?? 0),
    }));
  }, [cart]);

  const checkoutItems = useMemo(() => {
    return (cart?.products ?? []).map((item) => ({
      id: item.cart_item_id,
      name: item.product_name,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      lineTotal: Number(item.subtotal),
      image: item.product_image,
    }));
  }, [cart]);

  const handleFormSubmit = async (data) => {
    const nextPaymentDetails = { ...paymentDetails, ...data };
    setPaymentDetails(nextPaymentDetails);
    setStep('waiting');
    try {
      const payload = {
        order_id: nextPaymentDetails.orderId,
        amount: nextPaymentDetails.amount,
        payment_provider: 'mpesa',
        phone_number: data.phoneNumber,
      };

      if (!payload.order_id) {
        throw new Error('Create an order before making payment.');
      }

      const result = await initiate(payload);
      setTransactionId(result.id);

      let verifiedStatus = result.status;
      for (let attempt = 0; attempt < VERIFY_ATTEMPTS; attempt += 1) {
        if (verifiedStatus === 'completed') {
          setStep('success');
          return;
        }

        if (verifiedStatus === 'failed') {
          setStep('failure');
          return;
        }

        await wait(VERIFY_INTERVAL_MS);
        const verified = await verify(result.id);
        verifiedStatus = verified.status;
      }

      if (verifiedStatus === 'completed') {
        setStep('success');
        return;
      }

      setStep('failure');
    } catch (err) {
      console.error(err);
      setStep('failure');
    }
  };

  const handleRetry = () => setStep('form');
  const handleCancel = () => setStep('form');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartError ? <p className="mb-4 text-sm font-medium text-red-600">{cartError}</p> : null}

        {step === 'form' && (
          <PaymentForm
            initialPhone={paymentDetails.phoneNumber}
            initialName={paymentDetails.customerName}
            initialEmail={paymentDetails.email}
            amount={paymentDetails.amount}
            cartItems={checkoutItems}
            loadingCart={cartLoading}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        )}
        {step === 'waiting' && (
          <StkPush
            phoneNumber={paymentDetails.phoneNumber}
            amount={paymentDetails.amount}
            onCancel={handleCancel}
          />
        )}
        {step === 'success' && (
          <PaymentConfirm
            transactionId={transactionId}
            amount={paymentDetails.amount}
            cartItems={checkoutItems}
            phoneNumber={paymentDetails.phoneNumber}
            customerName={paymentDetails.customerName}
            customerEmail={paymentDetails.email}
            pickupLocation={paymentDetails.pickupLocation}
          />
        )}
        {step === 'failure' && (
          <PaymentFailure
            error={error || 'Transaction timeout — we didn\'t receive confirmation from your phone.'}
            onRetry={handleRetry}
            amount={paymentDetails.amount}
            phoneNumber={paymentDetails.phoneNumber}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
