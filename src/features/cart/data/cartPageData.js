import { productCatalog } from '../../products/data/productCatalog';

export const cartPageCopy = {
  title: 'Shopping Cart',
  subtitle: 'Review your items before checkout.',
  freeShippingThreshold: 150,
  shippingFee: 9.99,
  serviceFee: 2.5,
};

export const cartHighlights = [
  {
    title: 'Secure Checkout',
    description: 'All payment details are encrypted end-to-end.',
  },
  {
    title: 'Fast Delivery',
    description: 'Most orders arrive within 2-3 business days.',
  },
  {
    title: 'Easy Returns',
    description: 'Return eligible items within 14 days.',
  },
];

export const recommendedProducts = productCatalog.slice(0, 6);
