const FEEDBACK_TYPES = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'complaint', label: 'Complaint' },
];

const FeedbackForm = ({ onSubmit, loading, error }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="type" className="text-sm font-medium text-foreground">Type</label>
        <select
          id="type"
          name="type"
          defaultValue="general"
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {FEEDBACK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={1000}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Tell us what's on your mind…"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {loading ? 'Sending…' : 'Send Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
