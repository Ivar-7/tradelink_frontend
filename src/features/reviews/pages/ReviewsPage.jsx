import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useReviewsHook from '../hooks/useReviewsHook';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import { getReviewProductName, reviewProducts } from '../data/reviewsData';
import { ROUTES } from '../../../shared/constants/routes';

const ratingLevels = [5, 4, 3, 2, 1];

const ReviewsPage = () => {
  const [params, setParams] = useSearchParams();
  const productId = params.get('product') || 'prod-001';
  const [activeRatings, setActiveRatings] = useState([]);
  const [sortBy, setSortBy] = useState('helpful');

  const { reviews, averageRating, loading, error, submitReview } = useReviewsHook(productId);

  const ratingDistribution = useMemo(() => {
    const total = reviews.length || 1;
    return ratingLevels.map((rating) => {
      const count = reviews.filter((item) => item.rating_value === rating).length;
      return {
        rating,
        count,
        percentage: Math.round((count / total) * 100),
      };
    });
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const byRating = activeRatings.length
      ? reviews.filter((item) => activeRatings.includes(item.rating_value))
      : reviews;

    if (sortBy === 'newest') {
      return [...byRating].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (sortBy === 'highest') {
      return [...byRating].sort((a, b) => b.rating_value - a.rating_value);
    }

    return [...byRating].sort((a, b) => (b.helpful_count ?? 0) - (a.helpful_count ?? 0));
  }, [reviews, activeRatings, sortBy]);

  const productName = getReviewProductName(productId);

  const toggleRating = (rating) => {
    setActiveRatings((prev) =>
      prev.includes(rating) ? prev.filter((item) => item !== rating) : [...prev, rating]
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 lg:px-6">
      <nav className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">
        <Link to={ROUTES.HOME} className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Reviews</span>
      </nav>

      <section className="mb-8 rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">{productName} Reviews</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl font-black text-foreground">{averageRating || 0}</span>
              <span className="text-sm text-muted">Based on {reviews.length} review(s)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={productId}
              onChange={(event) => setParams({ product: event.target.value })}
              className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
            >
              {reviewProducts.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>

            <Link
              to={ROUTES.PRODUCTS}
              className="rounded-lg border border-border bg-slate-100 px-4 py-2 text-sm font-semibold text-foreground hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-4 xl:col-span-3">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Rating Distribution</h2>
            <div className="mt-4 space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.rating}>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted">
                    <span>{item.rating} stars</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-primary-600" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Filter By Rating</h2>
            <div className="mt-4 space-y-2">
              {ratingLevels.map((rating) => (
                <label key={rating} className="flex items-center gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={activeRatings.includes(rating)}
                    onChange={() => toggleRating(rating)}
                    className="h-4 w-4 rounded border-border text-primary-600"
                  />
                  <span>{rating} Stars</span>
                </label>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-6 lg:col-span-8 xl:col-span-9">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Write a Review</h2>
            <div className="mt-4">
              <ReviewForm onSubmit={submitReview} loading={loading} error={error} />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Community Reviews</h2>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-foreground dark:bg-slate-900"
              >
                <option value="helpful">Most Helpful</option>
                <option value="newest">Newest</option>
                <option value="highest">Highest Rated</option>
              </select>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900" />
                ))}
              </div>
            ) : filteredReviews.length === 0 ? (
              <p className="text-sm text-muted">No reviews match the current filter.</p>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  );
};

export default ReviewsPage;
