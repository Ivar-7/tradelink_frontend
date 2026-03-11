import { useNavigate } from 'react-router-dom';
import usePaymentsHook from '../hooks/usePaymentsHook';
import PaymentForm from '../components/PaymentForm';
import useCartHook from '../../cart/hooks/useCartHook';
import { ROUTES } from '../../../shared/constants/routes';

const PaymentPage = () => {
  const { cart } = useCartHook();
  const { loading, error, initiate } = usePaymentsHook();
  const navigate = useNavigate();

  const handlePayment = async (payload) => {
    try {
      await initiate(payload);
      navigate(ROUTES.ORDERS);
    } catch {
      // error state handled in hook
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Checkout</h1>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <PaymentForm
          orderId={cart?.id ?? ''}
          orderAmount={cart?.total_price ?? 0}
          onSubmit={handlePayment}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
