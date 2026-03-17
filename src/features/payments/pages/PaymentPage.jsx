// pages/payment/PaymentPage.jsx
import { useState } from 'react';
import PaymentForm from '../components/PaymentForm';
import PaymentConfirm from '../components/PaymentConfirm';
import PaymentFailure from '../components/PaymentFailure';
import StkPush from '../components/StkPush';
import usePaymentsHook from '../hooks/usePaymentsHook';
// If the global CSS already applies the gradient everywhere, you can skip this wrapper.
// Otherwise, add the same classes as HomePage:
import '../../../features/home/styles/home.css'; // ensure the styles are loaded

const PaymentPage = () => {
  const [step, setStep] = useState('form');
  const [paymentDetails, setPaymentDetails] = useState({
    orderId: '123e4567-e89b-12d3-a456-426614174000',
    amount: 1500,
    phoneNumber: '',
    customerName: '',
  });
  const [transactionId, setTransactionId] = useState(null);
  const { error, initiate } = usePaymentsHook();

  const handleFormSubmit = async (data) => {
    setPaymentDetails(prev => ({ ...prev, ...data }));
    setStep('waiting');
    try {
      const payload = {
        order_id: paymentDetails.orderId,
        payment_provider: 'mpesa',
        phone_number: data.phoneNumber,
      };
      const result = await initiate(payload);
      setTransactionId(result.id);
      setStep('success'); // simplified; in reality check status
    } catch (err) {
      console.error(err);
      setStep('failure');
    }
  };

  const handleRetry = () => setStep('form');
  const handleCancel = () => setStep('form');

  return (
    <div className="home-page w-full text-white min-h-screen">
      <div className="hero-overlay px-4 py-10">
        <div className="mx-auto max-w-lg">
          <h1 className="text-2xl font-bold text-foreground mb-6">Payment</h1>

          {step === 'form' && (
            <PaymentForm
              initialPhone={paymentDetails.phoneNumber}
              initialName={paymentDetails.customerName}
              amount={paymentDetails.amount}
              onSubmit={handleFormSubmit}
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
              phoneNumber={paymentDetails.phoneNumber}
            />
          )}
          {step === 'failure' && (
            <PaymentFailure
              error={error || 'Payment failed. Please try again.'}
              onRetry={handleRetry}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;