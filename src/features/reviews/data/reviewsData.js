import { productCatalog } from '../../products/data/productCatalog';

const reviewStorageKey = 'tradelink-local-reviews';

export const reviewProducts = [
  {
    id: 'prod-001',
    label: 'Studio X1 Wireless',
  },
  {
    id: 'prod-015',
    label: 'Sony Action Camera',
  },
  {
    id: 'prod-007',
    label: 'Sony Compact Camera',
  },
  {
    id: 'prod-014',
    label: 'Lunar Headphones',
  },
];

export const initialReviews = [
  {
    id: 'rev-1001',
    user_id: 'user-1',
    username: 'John D.',
    product_id: 'prod-001',
    rating_value: 5,
    comment:
      'The noise cancellation is top-tier and the comfort is excellent for long listening sessions.',
    date: '2026-02-11T10:15:00.000Z',
    verified_purchase: true,
    helpful_count: 24,
  },
  {
    id: 'rev-1002',
    user_id: 'user-2',
    username: 'Sarah M.',
    product_id: 'prod-001',
    rating_value: 4,
    comment:
      'Great battery life and premium build quality. Sound profile is balanced and clear.',
    date: '2026-02-04T08:30:00.000Z',
    verified_purchase: true,
    helpful_count: 11,
  },
  {
    id: 'rev-1003',
    user_id: 'user-3',
    username: 'Kelvin O.',
    product_id: 'prod-015',
    rating_value: 5,
    comment: 'Perfect for outdoor footage. Stabilization works impressively well.',
    date: '2026-01-28T13:25:00.000Z',
    verified_purchase: true,
    helpful_count: 17,
  },
  {
    id: 'rev-1004',
    user_id: 'user-4',
    username: 'Amina W.',
    product_id: 'prod-007',
    rating_value: 4,
    comment: 'Compact and easy to carry, with solid image quality in daylight.',
    date: '2026-01-20T16:50:00.000Z',
    verified_purchase: false,
    helpful_count: 6,
  },
];

export const getReviewStorageKey = () => reviewStorageKey;

export const getReviewProductName = (productId) => {
  const product = productCatalog.find((item) => item.id === productId);
  return product?.name ?? 'Selected Product';
};
