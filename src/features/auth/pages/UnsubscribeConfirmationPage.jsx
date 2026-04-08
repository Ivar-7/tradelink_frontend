import { Link } from 'react-router-dom';
import { APP_NAME } from '../../../shared/constants/app';
import { ROUTES } from '../../../shared/constants/routes';

const UnsubscribeConfirmationPage = () => {
  return (
    <main className="flex min-h-[calc(100vh-180px)] items-center justify-center px-4 py-12 md:px-6">
      <section className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-8 text-center shadow-[0_30px_70px_-30px_rgba(27,27,27,0.18)] md:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <span className="text-5xl text-green-600">✓</span>
        </div>

        <h1 className="mt-7 text-4xl font-black tracking-tight text-foreground">Successfully Unsubscribed</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
          You have been removed from our marketing email list. You will still receive essential
          order notifications.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={ROUTES.HOME}
            className="inline-flex rounded-xl border border-border bg-slate-100 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            Back to Homepage
          </Link>
          <button
            type="button"
            className="inline-flex rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700"
          >
            Wait, resubscribe me
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-8 border-t border-border pt-8 text-left text-[11px] uppercase tracking-[0.18em] text-muted">
          <div>
            <p>Status</p>
            <p className="mt-1 font-mono text-foreground">LIST_REMOVED</p>
          </div>
          <div>
            <p>Reference</p>
            <p className="mt-1 font-mono text-foreground">TRDL-99421-X</p>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted">{APP_NAME} Digital Atelier</p>
      </section>
    </main>
  );
};

export default UnsubscribeConfirmationPage;
