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
  const subtotal = 64900;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Success Header */}
        <div className="text-center py-12 px-6 bg-gray-50">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">TRANSACTION COMPLETE</h2>
          <p className="text-lg text-gray-700 mb-2">Payment Successful!</p>
          <p className="text-gray-600">
            A confirmation email has been sent to{' '}
            <span className="font-medium">{customerEmail || 'your email address'}</span>
            . Your order is now being processed.
          </p>
        </div>

        {/* Order Reference */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order Reference</span>
            <span className="font-mono font-semibold text-gray-900">{orderReference}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900 font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">{item.variant}</p>
                      <p className="text-gray-400 text-xs">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-gray-900">KES {item.price.toLocaleString()}</p>
                  </div>
                ))}
                
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pickup Fee</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
                    <span className="text-gray-900">TOTAL AMOUNT</span>
                    <span className="text-gray-900">KES {amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Pickup Information</h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm font-medium text-blue-900">Pick Up Mtaani</p>
                </div>
                <p className="text-gray-800 font-medium">{pickupLocation || 'Selected pickup point'}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Your order will be ready for pickup within 2-3 business days. 
                  You'll receive an SMS with collection instructions.
                </p>
              </div>

              {/* Customer Details */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{customerName}</p>
                  <p className="text-sm text-gray-600 mt-1">{customerEmail}</p>
                  {phoneNumber && (
                    <p className="text-sm text-gray-600 mt-1">
                      Phone: {phoneNumber.replace(/(\d{3})\d{4}(\d{2})/, '$1****$2')}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">M-Pesa</p>
                      <p className="text-xs text-gray-500 mt-1">
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
          <div className="mt-8 flex gap-4 pt-6 border-t border-gray-200">
            <button 
              onClick={() => window.location.href = '/shop'} 
              className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => window.location.href = `/orders/${orderReference}`}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition"
            >
              View Order Details
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help with pickup?{' '}
              <a href="/support" className="text-gray-900 underline hover:no-underline">
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