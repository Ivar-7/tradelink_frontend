import { useState } from 'react';

const ReviewForm = ({ onSubmit, loading, error }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      rating_value: rating,
      comment: formData.get('comment') || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Your Rating</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(0)}
              className={`text-2xl transition-colors ${
                i < (hovered || rating) ? 'text-warning' : 'text-border'
              }`}
              aria-label={`${i + 1} star`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="comment" className="text-sm font-medium text-foreground">Comment (optional)</label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          maxLength={500}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Share your experience…"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
