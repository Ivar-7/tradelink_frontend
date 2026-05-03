import { useState } from 'react';
import { SHIPPING_METHODS, KENYA_COUNTIES, PAYMENT_PROVIDERS } from '../../../shared/constants/app';

/**
 * Checkout form for payment and shipping details
 */
const CheckoutForm = ({ cartTotal, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    phone_number: '',
    provider: PAYMENT_PROVIDERS.MPESA,
    shipping_method: SHIPPING_METHODS.DELIVERY,
    county: '',
    delivery_address: '',
    notes: '',
    agree_terms: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Phone validation - Kenyan format
    const phonePattern = /^(?:\+254|0)([0-9]{9})$/;
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!phonePattern.test(formData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Enter a valid Kenyan number (07XXXXXXXX or +254...)';
    }

    if (!formData.county) {
      newErrors.county = 'County is required';
    }

    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = 'Delivery address is required';
    }

    if (!formData.agree_terms) {
      newErrors.agree_terms = 'You must agree to terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Section */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="text-lg font-bold text-foreground">Shipping Details</h3>
        <div className="mt-4 space-y-4">
          {/* County Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground">County</label>
            <select
              name="county"
              value={formData.county}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">Select your county</option>
              {KENYA_COUNTIES.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
            {errors.county && <p className="mt-1 text-xs text-destructive">{errors.county}</p>}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-semibold text-foreground">Delivery Address</label>
            <textarea
              name="delivery_address"
              value={formData.delivery_address}
              onChange={handleChange}
              placeholder="e.g., 123 Main Street, Apartment 4B"
              rows={3}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            {errors.delivery_address && <p className="mt-1 text-xs text-destructive">{errors.delivery_address}</p>}
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block text-sm font-semibold text-foreground">Delivery Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., Please ring doorbell twice"
              rows={2}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="text-lg font-bold text-foreground">Payment Method</h3>
        <div className="mt-4 space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground">Provider</label>
            <div className="mt-3 flex gap-3">
              <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
                style={{
                  borderColor: formData.provider === PAYMENT_PROVIDERS.MPESA ? 'var(--primary-500)' : 'var(--border)',
                  backgroundColor: formData.provider === PAYMENT_PROVIDERS.MPESA ? 'var(--primary-50)' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="provider"
                  value={PAYMENT_PROVIDERS.MPESA}
                  checked={formData.provider === PAYMENT_PROVIDERS.MPESA}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-semibold text-foreground">M-Pesa</span>
              </label>
            </div>
            <p className="mt-2 text-xs text-muted">
              You'll receive an STK prompt on your phone to complete the payment
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-foreground">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="07XXXXXXXX or +254..."
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            {errors.phone_number && <p className="mt-1 text-xs text-destructive">{errors.phone_number}</p>}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">Order Total</span>
          <span className="text-3xl font-black text-primary-600">KSh {cartTotal?.toLocaleString()}</span>
        </div>
        <p className="mt-3 text-xs text-muted">
          Including delivery fee. Taxes calculated at checkout.
        </p>
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="agree_terms"
          checked={formData.agree_terms}
          onChange={handleChange}
          className="mt-1 h-5 w-5 rounded border-border"
        />
        <label className="text-sm text-muted">
          I agree to the{' '}
          <a href="/terms" className="font-semibold text-primary-600 hover:underline">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="font-semibold text-primary-600 hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.agree_terms && <p className="text-xs text-destructive">{errors.agree_terms}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary-600 px-6 py-3 text-center font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  );
};

export default CheckoutForm;
