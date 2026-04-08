import { ReviewListResponseSchema } from '../reviews.types';
import { getReviewStorageKey, initialReviews } from '../data/reviewsData';

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const readReviews = () => {
  const storageKey = getReviewStorageKey();
  const raw = localStorage.getItem(storageKey);

  if (!raw) {
    localStorage.setItem(storageKey, JSON.stringify(initialReviews));
    return [...initialReviews];
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(storageKey, JSON.stringify(initialReviews));
    return [...initialReviews];
  }
};

const saveReviews = (reviews) => {
  localStorage.setItem(getReviewStorageKey(), JSON.stringify(reviews));
};

const average = (reviews) => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, item) => sum + item.rating_value, 0);
  return Number((total / reviews.length).toFixed(1));
};

export const getReviews = async (productId) => {
  await wait();
  const all = readReviews();
  const reviews = all.filter((item) => item.product_id === productId);

  return ReviewListResponseSchema.parse({
    reviews,
    total: reviews.length,
    average_rating: average(reviews),
  });
};

export const createReview = async (productId, payload) => {
  await wait();
  const all = readReviews();

  const review = {
    id: `rev-${Date.now()}`,
    user_id: 'guest-user',
    username: 'Guest User',
    product_id: productId,
    rating_value: payload.rating_value,
    comment: payload.comment,
    verified_purchase: false,
    helpful_count: 0,
    date: new Date().toISOString(),
  };

  all.unshift(review);
  saveReviews(all);

  return review;
};
