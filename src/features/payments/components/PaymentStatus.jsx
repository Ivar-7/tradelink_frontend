import { useEffect, useState } from 'react';

/**
 * Component to display payment status and polling progress
 */
const PaymentStatus = ({ status, error, maxAttempts = 12 }) => {
  const [displayStatus, setDisplayStatus] = useState(null);
  const [pollAttempt, setPollAttempt] = useState(0);

  useEffect(() => {
    setDisplayStatus(status);
  }, [status]);

  useEffect(() => {
    if (status === 'polling') {
      const interval = setInterval(() => {
        setPollAttempt((prev) => Math.min(prev + 1, maxAttempts));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [status, maxAttempts]);

  const renderPendingState = () => {
    const progress = Math.min((pollAttempt / maxAttempts) * 100, 95);
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="flex justify-center">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 transition-transform duration-500"
              style={{
                borderTopColor: 'var(--primary-600)',
                transform: `rotateZ(${progress * 3.6}deg)`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
          </div>
        </div>
        <h3 className="mt-6 text-2xl font-bold text-foreground">Waiting for Payment</h3>
        <p className="mt-2 text-sm text-muted">
          An STK prompt has been sent to your phone. Please enter your M-Pesa PIN to complete the payment.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="text-xs text-muted">
            Attempt {pollAttempt} of {maxAttempts}
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-primary-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-xs text-muted">
          This will timeout in {Math.ceil((maxAttempts - pollAttempt) * 5)} seconds
        </p>
      </div>
    );
  };

  const renderSuccessState = () => (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/40 dark:bg-emerald-900/20">
      <div className="flex justify-center">
        <div className="rounded-full bg-emerald-100 p-4 text-5xl dark:bg-emerald-900/40">
          ✅
        </div>
      </div>
      <h3 className="mt-6 text-2xl font-bold text-emerald-900 dark:text-emerald-300">Payment Successful!</h3>
      <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200">
        Your payment has been confirmed. Your order is being processed.
      </p>
    </div>
  );

  const renderFailureState = () => (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-destructive/10 p-4 text-5xl">❌</div>
      </div>
      <h3 className="mt-6 text-2xl font-bold text-destructive">Payment Failed</h3>
      <p className="mt-2 text-sm text-destructive/80">{error || 'The payment could not be processed.'}</p>
      <button
        type="button"
        className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
      >
        Try Again
      </button>
    </div>
  );

  const renderTimeoutState = () => (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900/40 dark:bg-amber-900/20">
      <div className="flex justify-center">
        <div className="rounded-full bg-amber-100 p-4 text-5xl dark:bg-amber-900/40">⏱️</div>
      </div>
      <h3 className="mt-6 text-2xl font-bold text-amber-900 dark:text-amber-300">Payment Pending</h3>
      <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
        We haven't received confirmation yet. Your payment may still be processing. We'll check again shortly.
      </p>
    </div>
  );

  if (displayStatus === 'completed') {
    return renderSuccessState();
  }

  if (displayStatus === 'failed') {
    return renderFailureState();
  }

  if (displayStatus === 'timeout') {
    return renderTimeoutState();
  }

  // pending, polling, or other
  return renderPendingState();
};

export default PaymentStatus;
