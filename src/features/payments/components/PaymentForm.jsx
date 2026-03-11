import { useState } from 'react';

const PaymentForm = ({ orderId, orderAmount, onSubmit, loading, error }) => {
  const [provider, setProvider] = useState('mpesa');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      order_id: orderId,
      payment_provider: provider,
      phone_number: formData.get('phone_number') || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Payment Method</label>
        <div className="flex gap-3">
          {[
            { value: 'mpesa', label: 'M-Pesa' },
            { value: 'card', label: 'Card' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setProvider(opt.value)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                provider === opt.value
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-border bg-surface text-foreground hover:border-primary-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {provider === 'mpesa' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="phone_number" className="text-sm font-medium text-foreground">
            M-Pesa Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            required
            placeholder="07XXXXXXXX"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-lg bg-border p-3 text-sm text-foreground">
        <span className="font-semibold">Amount due: </span>
        <span className="font-bold text-primary-600">
          {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(orderAmount)}
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary-600 py-3 text-base font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {loading ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentForm;
