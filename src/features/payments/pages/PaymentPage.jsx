import PaymentConfirm from "../components/PaymentConfirm";
import PaymentFailure from "../components/PaymentFailure";
import PaymentForm from "../components/PaymentForm";
import StkPush from "../components/StkPush";

const PaymentPage = () => (
  <div className="mx-auto max-w-lg px-4 py-10">
    <h1 className="text-2xl font-bold text-foreground">Payment Page</h1>
    <PaymentForm />
    <PaymentConfirm />
    <PaymentFailure />
    <StkPush />
  </div>
);

export default PaymentPage;
