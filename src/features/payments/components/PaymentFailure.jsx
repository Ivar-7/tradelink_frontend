// components/PaymentFailure.jsx
const PaymentFailure = ({ error, onRetry, amount, phoneNumber, attemptReference }) => {
  const maskPhone = (phone) => {
    if (!phone) return '+254 ......+88';
    const cleaned = phone.replace(/\D/g, '');
    const last2 = cleaned.slice(-2);
    const firstPart = cleaned.slice(0, -2);
    const masked = firstPart.slice(0, -4) + '......' + firstPart.slice(-2);
    return `+254 ${masked}${last2}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Failure Header */}
        <div className="text-center py-12 px-6 bg-gray-50 border-b border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">TRADING ISSUE</h2>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Payment Failed</h3>
          <p className="text-gray-600">
            {error || 'Transaction timeout — we didn\'t receive confirmation from your phone.'}
          </p>
        </div>

        {/* Amount Due */}
        <div className="p-6 border-b border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-1">TOTAL AMOUNT DUE</p>
          <p className="text-3xl font-bold text-gray-900">KES {amount?.toLocaleString() || '67,522.72'}</p>
        </div>

        {/* Transaction Details */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Attempt Reference</span>
              <span className="font-mono text-gray-900">{attemptReference || 'TL-992-8X20'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile Number</span>
              <span className="font-mono text-gray-900">{maskPhone(phoneNumber)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="text-gray-900">M-PESA Global</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex flex-col gap-4">
          <button
            onClick={onRetry}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            Try Again
          </button>
          <button className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;