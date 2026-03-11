import { useCallback, useEffect, useState } from 'react';
import { getReviews, createReview } from '../api/reviewsApi';
import { mapError } from '../../../shared/utils/errorHandler';

const useReviewsHook = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getReviews(productId);
      setReviews(result.reviews);
      setAverageRating(result.average_rating);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const submitReview = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await createReview(productId, payload);
      await fetchReviews();
    } catch (err) {
      setError(mapError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [productId, fetchReviews]);

  return { reviews, averageRating, loading, error, submitReview };
};

export default useReviewsHook;
