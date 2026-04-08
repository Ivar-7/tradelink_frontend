import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFeedbackHook from '../hooks/useFeedbackHook';
import { contactChannels, faqs, feedbackSubjects, helpCategories } from '../data/feedbackPageData';
import { ROUTES } from '../../../shared/constants/routes';

const subjectToType = {
  shipping: 'general',
  product: 'feature_request',
  billing: 'complaint',
  returns: 'complaint',
  other: 'general',
};

const FeedbackPage = () => {
  const { loading, error, submitted, submit } = useFeedbackHook();
  const [activeTab, setActiveTab] = useState('help');
  const [expandedFaq, setExpandedFaq] = useState(faqs[0]?.id ?? '');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: '',
  });
  const [localMessage, setLocalMessage] = useState('');

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return faqs;
    return faqs.filter(
      (item) =>
        item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query)
    );
  }, [search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalMessage('');

    const subjectType = subjectToType[form.subject] ?? 'general';
    const combinedMessage = [
      `Name: ${form.firstName} ${form.lastName}`.trim(),
      `Email: ${form.email}`,
      form.orderNumber ? `Order Number: ${form.orderNumber}` : null,
      `Subject: ${form.subject || 'general'}`,
      `Message: ${form.message}`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await submit({
        type: subjectType,
        message: combinedMessage,
      });
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        orderNumber: '',
        subject: '',
        message: '',
      });
      setLocalMessage('Your message was sent successfully. Our team will contact you shortly.');
    } catch {
      // Hook handles error state
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 lg:px-6">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Support Center</h1>
        <p className="mt-2 text-sm text-muted">Find answers quickly or message our support team directly.</p>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={() => setActiveTab('help')}
            className={`pb-2 text-sm font-semibold ${
              activeTab === 'help'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Help Center
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`pb-2 text-sm font-semibold ${
              activeTab === 'contact'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Contact Us
          </button>
        </div>
      </header>

      {activeTab === 'help' ? (
        <section className="space-y-10">
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
            <h2 className="text-3xl font-black tracking-tight text-foreground">How can we help you today?</h2>
            <div className="mt-5 rounded-xl border border-border bg-slate-50 px-4 py-3 dark:bg-slate-900/40">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search topics, orders, or return policies..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {helpCategories.map((item) => (
              <article key={item.id} className="rounded-xl border border-border bg-surface p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-600">{item.icon}</p>
                <h3 className="mt-2 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="mb-5 text-2xl font-black tracking-tight text-foreground">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {filteredFaqs.map((item) => {
                const open = expandedFaq === item.id;
                return (
                  <div key={item.id} className="overflow-hidden rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq((prev) => (prev === item.id ? '' : item.id))}
                      className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left dark:bg-slate-900/40"
                    >
                      <span className="text-sm font-semibold text-foreground">{item.question}</span>
                      <span className="text-lg text-primary-600">{open ? '−' : '+'}</span>
                    </button>
                    {open ? <p className="px-4 py-4 text-sm text-muted">{item.answer}</p> : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-slate-100 to-slate-50 p-8 text-center dark:from-slate-900 dark:to-slate-900/70">
            <h3 className="text-3xl font-black tracking-tight text-foreground">Still need help?</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              Our support team is available 24/7 for order, account, and technical questions.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className="mt-6 rounded-lg bg-primary-600 px-6 py-3 text-sm font-bold text-white hover:bg-primary-700"
            >
              Contact Support
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === 'contact' ? (
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            {contactChannels.map((channel) => (
              <article key={channel.id} className="rounded-xl border border-border bg-surface p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-600">{channel.title}</p>
                <p className="mt-2 text-base font-semibold text-foreground">{channel.detail}</p>
                <p className="mt-1 text-xs text-muted">{channel.subtext}</p>
              </article>
            ))}

            <article className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-bold text-foreground">Useful shortcuts</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Link to={ROUTES.ORDERS} className="block text-primary-600 hover:underline">Track an order</Link>
                <Link to={ROUTES.REVIEWS} className="block text-primary-600 hover:underline">See product reviews</Link>
                <Link to={ROUTES.PROFILE} className="block text-primary-600 hover:underline">Manage account settings</Link>
              </div>
            </article>
          </div>

          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={form.firstName}
                  onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                  placeholder="First Name"
                  className="rounded-lg border border-border bg-slate-50 px-3 py-3 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                />
                <input
                  required
                  value={form.lastName}
                  onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                  placeholder="Last Name"
                  className="rounded-lg border border-border bg-slate-50 px-3 py-3 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Email Address"
                  className="rounded-lg border border-border bg-slate-50 px-3 py-3 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                />
                <input
                  value={form.orderNumber}
                  onChange={(event) => setForm((prev) => ({ ...prev, orderNumber: event.target.value }))}
                  placeholder="Order Number (Optional)"
                  className="rounded-lg border border-border bg-slate-50 px-3 py-3 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
                />
              </div>

              <select
                required
                value={form.subject}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                className="mt-4 w-full rounded-lg border border-border bg-slate-50 px-3 py-3 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
              >
                {feedbackSubjects.map((subject) => (
                  <option key={subject.label} value={subject.value} disabled={subject.value === ''}>
                    {subject.label}
                  </option>
                ))}
              </select>

              <textarea
                required
                minLength={10}
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                rows={6}
                placeholder="How can we help you?"
                className="mt-4 w-full rounded-lg border border-border bg-slate-50 px-3 py-3 text-sm text-foreground focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-slate-900"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-lg bg-gradient-to-br from-primary-700 to-primary-500 px-5 py-3 text-sm font-bold text-white hover:opacity-95 disabled:opacity-60"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>

              {error ? <p className="mt-4 text-sm font-medium text-destructive">{error}</p> : null}
              {submitted || localMessage ? (
                <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {localMessage || 'Thank you. We received your message.'}
                </p>
              ) : null}
            </form>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default FeedbackPage;
