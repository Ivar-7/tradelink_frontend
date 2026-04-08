export const helpCategories = [
  {
    id: 'orders',
    icon: 'package',
    title: 'Orders & Tracking',
    description: 'View order status, track shipments, and manage delivery preferences.',
  },
  {
    id: 'returns',
    icon: 'sync',
    title: 'Returns & Refunds',
    description: 'Start a return, check refund status, and review return policies.',
  },
  {
    id: 'account',
    icon: 'person',
    title: 'Account & Payment',
    description: 'Manage profile details, saved cards, and account security.',
  },
  {
    id: 'warranty',
    icon: 'shield',
    title: 'Warranty Support',
    description: 'Register products and request warranty service quickly.',
  },
];

export const faqs = [
  {
    id: 'ship-time',
    question: 'How long does shipping take?',
    answer:
      'Most deliveries arrive within 2 to 5 business days in major towns. Remote locations can take 5 to 8 business days.',
  },
  {
    id: 'return-policy',
    question: 'What is your return policy?',
    answer:
      'You can initiate returns within 14 days for eligible products. Refunds are processed to the original payment method once inspection is complete.',
  },
  {
    id: 'cancel-order',
    question: 'Can I cancel my order after it is placed?',
    answer:
      'Orders can be cancelled while they are pending or processing. Once shipped, cancellation is disabled and a return can be requested after delivery.',
  },
  {
    id: 'promo-codes',
    question: 'How do I use a promotional code?',
    answer:
      'Apply your code at checkout in the promo section before payment. Only one promotional code can be used per order.',
  },
];

export const contactChannels = [
  {
    id: 'email',
    icon: 'mail',
    title: 'Email Support',
    detail: 'support@tradelink.com',
    subtext: 'Response in under 24 hours',
  },
  {
    id: 'phone',
    icon: 'call',
    title: 'Call Us',
    detail: '+254 700 123 456',
    subtext: 'Mon-Fri: 9am - 6pm EAT',
  },
  {
    id: 'chat',
    icon: 'chat_bubble',
    title: 'Live Chat',
    detail: 'Chat with an expert',
    subtext: 'Usually replies in under 5 minutes',
  },
];

export const feedbackSubjects = [
  { value: '', label: 'Select a category' },
  { value: 'shipping', label: 'Shipping Issue' },
  { value: 'product', label: 'Product Inquiry' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'returns', label: 'Returns & Exchanges' },
  { value: 'other', label: 'Other' },
];
