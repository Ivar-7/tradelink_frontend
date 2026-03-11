import useFeedbackHook from '../hooks/useFeedbackHook';
import FeedbackForm from '../components/FeedbackForm';

const FeedbackPage = () => {
  const { loading, error, submitted, submit } = useFeedbackHook();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await submit({
        type: formData.get('type'),
        message: formData.get('message'),
      });
    } catch {
      // error state handled in hook
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-foreground">Thank you for your feedback!</h2>
        <p className="text-sm text-muted">We&apos;ll review your message and get back to you if needed.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Contact Us</h1>
      <p className="mb-6 text-sm text-muted">Have a question or feedback? We&apos;d love to hear from you.</p>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <FeedbackForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default FeedbackPage;
