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
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        {/* Failure Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-slate-100">TRADING ISSUE</h2>
          <h3 className="mb-2 text-xl font-medium text-gray-800 dark:text-slate-200">Payment Failed</h3>
          <p className="text-gray-600 dark:text-slate-300">
            {error || 'Transaction timeout — we didn\'t receive confirmation from your phone.'}
          </p>
        </div>

        {/* Amount Due */}
        <div className="border-b border-gray-200 p-6 text-center dark:border-slate-700">
          <p className="mb-1 text-sm text-gray-500 dark:text-slate-400">TOTAL AMOUNT DUE</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-slate-100">KES {amount?.toLocaleString() || '67,522.72'}</p>
        </div>

        {/* Transaction Details */}
        <div className="border-b border-gray-200 bg-gray-50 p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-slate-400">Attempt Reference</span>
              <span className="font-mono text-gray-900 dark:text-slate-100">{attemptReference || 'TL-992-8X20'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-slate-400">Mobile Number</span>
              <span className="font-mono text-gray-900 dark:text-slate-100">{maskPhone(phoneNumber)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-slate-400">Payment Method</span>
              <span className="text-gray-900 dark:text-slate-100">M-PESA Global</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex flex-col gap-4">
          <button
            onClick={onRetry}
            className="w-full rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            Try Again
          </button>
          <button className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;