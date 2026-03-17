const StkPush = ({ phoneNumber, amount, onCancel }) => {
  const maskedPhone = phoneNumber.replace(/(\d{3})\d{4}(\d{2})/, '$1****$2');

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
      <div className="flex justify-center mb-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-2">Waiting for M-Pesa Payment</h2>

      <div className="text-left bg-indigo-950/40 p-4 rounded-md mb-4 border border-indigo-500/20">
        <p className="mb-2 text-slate-200">📱 <strong>Step 1:</strong> A prompt has been sent to <span className="font-mono">{maskedPhone}</span></p>
        <p className="mb-2 text-slate-200">💰 <strong>Step 2:</strong> Enter your M-Pesa PIN on your phone to authorize <strong>KES {amount}</strong></p>
        <p className="mb-2 text-slate-200">⏳ <strong>Step 3:</strong> This page will update automatically once confirmed</p>
      </div>

      <button
        onClick={onCancel}
        className="px-4 py-2 border border-white/20 rounded-md text-slate-300 hover:bg-white/5 transition-colors"
      >
        Cancel Transaction
      </button>

      <p className="text-sm text-indigo-400 mt-4">
        <button className="hover:underline">Didn't receive the prompt? Resend</button>
      </p>
    </div>
  );
};

export default StkPush;