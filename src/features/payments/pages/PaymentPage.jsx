// pages/payment/PaymentPage.jsx
import { useState } from 'react';
import PaymentForm from '../components/PaymentForm';
import PaymentConfirm from '../components/PaymentConfirm';
import PaymentFailure from '../components/PaymentFailure';
import StkPush from '../components/StkPush';
import usePaymentsHook from '../hooks/usePaymentsHook';

const PaymentPage = () => {
  const [step, setStep] = useState('form');
  const [paymentDetails, setPaymentDetails] = useState({
    orderId: '123e4567-e89b-12d3-a456-426614174000',
    amount: 64900,
    phoneNumber: '',
    customerName: '',
    email: '',
    pickupLocation: ''
  });
  const [transactionId, setTransactionId] = useState(null);
  const { error, initiate, loading } = usePaymentsHook();

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
      const result = await initiate(payload);
      setTransactionId(result.id);
      // Simulate payment processing
      setTimeout(() => {
        setStep('success');
      }, 5000);
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
        {step === 'form' && (
          <PaymentForm
            initialPhone={paymentDetails.phoneNumber}
            initialName={paymentDetails.customerName}
            initialEmail={paymentDetails.email}
            amount={paymentDetails.amount}
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
