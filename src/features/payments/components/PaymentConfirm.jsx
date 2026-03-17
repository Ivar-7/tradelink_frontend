const PaymentConfirm = ({ transactionId, amount, phoneNumber }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
      <div className="flex justify-center mb-4">
        <div className="bg-green-500/20 rounded-full p-3">
          <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h2>
      <p className="text-slate-300 mb-4">Your transaction has been completed.</p>

      <div className="bg-white/5 p-4 rounded-md text-left mb-4 border border-white/10">
        <p className="text-slate-200"><strong>Transaction ID:</strong> {transactionId || 'MPE123456789'}</p>
        <p className="text-slate-200"><strong>Amount:</strong> KES {amount}</p>
        <p className="text-slate-200"><strong>Phone:</strong> {phoneNumber}</p>
        <p className="text-slate-200"><strong>Date:</strong> {new Date().toLocaleString()}</p>
      </div>

      <p className="text-sm text-slate-400 mb-4">You will receive an SMS confirmation shortly.</p>

      <div className="flex gap-3">
        <button className="flex-1 btn-cta py-2 px-4 rounded-xl font-semibold text-white">
          View Order Details
        </button>
        <button className="flex-1 border border-white/20 hover:bg-white/5 text-slate-300 font-semibold py-2 px-4 rounded-xl transition-colors">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirm;