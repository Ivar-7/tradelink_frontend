// components/PaymentConfirm.jsx
const PaymentConfirm = ({ 
  transactionId, 
  amount, 
  phoneNumber, 
  customerName, 
  customerEmail,
  pickupLocation 
}) => {
  const orderReference = '#TRD-' + Math.floor(Math.random() * 10000000);
  
  const cartItems = [
    { name: 'Studio X1 Wireless', quantity: 1, price: 39900, variant: 'Midnight Black' },
    { name: 'Lunar Series 04', quantity: 1, price: 25000, variant: 'Titanium / White' }
  ];
  const subtotal = amount ?? 64900;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        {/* Success Header */}
        <div className="bg-gray-50 px-6 py-12 text-center dark:bg-slate-800">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-slate-100">TRANSACTION COMPLETE</h2>
          <p className="mb-2 text-lg text-gray-700 dark:text-slate-200">Payment Successful!</p>
          <p className="text-gray-600 dark:text-slate-300">
            A confirmation email has been sent to{' '}
            <span className="font-medium">{customerEmail || 'your email address'}</span>
            . Your order is now being processed.
          </p>
        </div>

        {/* Order Reference */}
        <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-slate-400">Order Reference</span>
            <span className="font-mono font-semibold text-gray-900 dark:text-slate-100">{orderReference}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-slate-100">Order Summary</h3>
              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-100 py-2 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{item.name}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{item.variant}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-gray-900 dark:text-slate-100">KES {item.price.toLocaleString()}</p>
                  </div>
                ))}
                
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-slate-100">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">Pickup Fee</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4 text-xl font-bold dark:border-slate-700">
                    <span className="text-gray-900 dark:text-slate-100">TOTAL AMOUNT</span>
                    <span className="text-gray-900 dark:text-slate-100">KES {amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Information */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-slate-100">Pickup Information</h3>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <div className="flex items-start gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Pick Up Mtaani</p>
                </div>
                <p className="font-medium text-gray-800 dark:text-slate-100">{pickupLocation || 'Selected pickup point'}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                  Your order will be ready for pickup within 2-3 business days. 
                  You'll receive an SMS with collection instructions.
                </p>
              </div>

              {/* Customer Details */}
              <div className="mt-6">
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-slate-100">Customer Details</h3>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
                  <p className="font-medium text-gray-900 dark:text-slate-100">{customerName}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">{customerEmail}</p>
                  {phoneNumber && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                      Phone: {phoneNumber.replace(/(\d{3})\d{4}(\d{2})/, '$1****$2')}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-slate-100">Payment Method</h3>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">M-Pesa</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                        Transaction ID: {transactionId || 'MPESA' + Math.random().toString(36).substring(7).toUpperCase()}
                      </p>
                    </div>
                    <span className="text-green-600 text-sm font-medium">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 border-t border-gray-200 pt-6 dark:border-slate-700">
            <button 
              onClick={() => window.location.href = '/'} 
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => window.location.href = `/orders/${orderReference}`}
              className="flex-1 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
            >
              View Order Details
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Need help with pickup?{' '}
              <a href="/support" className="text-gray-900 underline hover:no-underline dark:text-slate-100">
                Contact our support atelier
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirm;