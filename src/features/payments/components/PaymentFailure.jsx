const PaymentFailure = ({ error, onRetry }) => {
  const commonErrors = [
    'Insufficient M-Pesa balance.',
    'Transaction cancelled.',
    'Network error. Please try again.',
    'Incorrect M-Pesa PIN entered.',
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
      <div className="flex justify-center mb-4">
        <div className="bg-red-500/20 rounded-full p-3">
          <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-red-400 mb-2">Payment Failed</h2>
      <p className="text-slate-300 mb-4">{error}</p>

      <div className="bg-white/5 p-4 rounded-md text-left mb-4 border border-white/10">
        <p className="font-medium text-slate-200 mb-2">Possible reasons:</p>
        <ul className="list-disc list-inside text-sm text-slate-300">
          {commonErrors.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 btn-cta py-2 px-4 rounded-xl font-semibold text-white"
        >
          Try Again
        </button>
        <button className="flex-1 border border-white/20 hover:bg-white/5 text-slate-300 font-semibold py-2 px-4 rounded-xl transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;