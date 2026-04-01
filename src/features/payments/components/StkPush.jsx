// components/StkPush.jsx
import { useState, useEffect } from 'react';

const StkPush = ({ phoneNumber, amount, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  
  const maskPhone = (phone) => {
    if (!phone) return '+254 XXXXXXX';
    const cleaned = phone.replace(/\D/g, '');
    const last3 = cleaned.slice(-3);
    const masked = cleaned.slice(0, -3).replace(/\d/g, 'X');
    return `+254 ${masked}${last3}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        {/* Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">VERIFICATION REQUIRED</h2>
        <p className="text-gray-600 mb-8">
          Waiting for your M-Pesa PIN<br />
          Enter your M-Pesa PIN on your phone to complete the payment for your order.
        </p>

        {/* Amount */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">TOTAL AMOUNT</p>
          <p className="text-3xl font-bold text-gray-900">KES {amount.toLocaleString()}</p>
        </div>

        {/* Phone Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-700">
              SENDING TO <span className="font-mono font-medium">{maskPhone(phoneNumber)}</span>
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="w-full bg-gray-100 rounded-full h-1 mb-2">
            <div 
              className="bg-gray-900 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">Waiting for confirmation... {timeLeft}s</p>
        </div>

        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900 transition font-medium underline underline-offset-2"
        >
          Cancel transaction
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Don't see the prompt? Make sure your phone is nearby and has network coverage
        </p>
      </div>
    </div>
  );
};

export default StkPush;