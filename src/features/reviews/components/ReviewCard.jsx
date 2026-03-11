import { formatDate } from '../../../shared/utils/formatters';

/**
 * @param {{ review: import('../reviews.types').Review }} props
 */
const ReviewCard = ({ review }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{review.username ?? 'Anonymous'}</span>
        <span className="text-xs text-muted">{formatDate(review.date)}</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < review.rating_value ? 'text-warning' : 'text-border'}>★</span>
        ))}
      </div>
      {review.comment && <p className="text-sm text-muted">{review.comment}</p>}
    </div>
  );
};

export default ReviewCard;
