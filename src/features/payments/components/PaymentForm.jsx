import { useState } from 'react';
import { CreatePaymentInputSchema } from '../payments.types';

const PaymentForm = ({ initialPhone = '', initialName = '', amount, onSubmit }) => {
  const [phone, setPhone] = useState(initialPhone);
  const [name, setName] = useState(initialName);
  const [errors, setErrors] = useState({});

  const validate = () => {
    try {
      CreatePaymentInputSchema.parse({
        order_id: 'dummy-uuid',
        payment_provider: 'mpesa',
        phone_number: phone,
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        err.errors.forEach(e => {
          if (e.path.includes('phone_number')) fieldErrors.phone = e.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ phoneNumber: phone, customerName: name });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white mb-4">M-Pesa Payment</h2>
      <p className="mb-4 text-slate-300">Total: KES {amount}</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            M-Pesa Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g., 0712345678"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
            required
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Your Name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400"
          />
        </div>

        <button
          type="submit"
          className="w-full btn-cta py-2 px-4 rounded-xl font-semibold text-white"
        >
          Pay Now via M-Pesa
        </button>
      </form>

      <p className="text-xs text-slate-400 mt-4 flex items-center justify-center">
        <span className="mr-1">🔒</span> You will receive an STK push on your phone
      </p>
    </div>
  );
};

export default PaymentForm;