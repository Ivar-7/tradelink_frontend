import { productCatalog } from '../../products/data/productCatalog';

const productById = (id) => productCatalog.find((item) => item.id === id);

const buildItem = (id, quantity = 1) => {
  const product = productById(id);
  const unit_price = product?.price ?? 0;
  return {
    product_id: id,
    product_name: product?.name ?? 'Unknown Product',
    product_image: product?.image ?? '',
    quantity,
    unit_price,
    subtotal: Number((unit_price * quantity).toFixed(2)),
  };
};

const now = new Date();
const dayMs = 24 * 60 * 60 * 1000;

const isoDaysAgo = (days) => new Date(now.getTime() - days * dayMs).toISOString();

export const orderTabs = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'returns', label: 'Returns' },
];

export const orderIssueTypes = [
  'Damaged item',
  'Missing item',
  'Wrong item received',
  'Delayed shipping',
  'Other',
];

export const initialOrders = [
  {
    id: 'TRL-99205',
    user_id: 'guest-user',
    order_date: isoDaysAgo(1),
    order_amount: 334,
    products: [buildItem('prod-015', 1), buildItem('prod-002', 1)],
    status: 'pending',
    shipping_method: 'delivery',
    tracking_number: null,
    delivery_address: {
      county: 'Nairobi',
      city: 'Westlands',
      postal_address: 'P.O. Box 1001',
      user_contact: '+254700000001',
    },
  },
  {
    id: 'TRL-99180',
    user_id: 'guest-user',
    order_date: isoDaysAgo(3),
    order_amount: 315,
    products: [buildItem('prod-001', 1), buildItem('prod-014', 1), buildItem('prod-017', 1)],
    status: 'confirmed',
    shipping_method: 'delivery',
    tracking_number: null,
    delivery_address: {
      county: 'Kiambu',
      city: 'Ruiru',
      postal_address: 'Ruiru 45',
      user_contact: '+254700000002',
    },
  },
  {
    id: 'TRL-99102',
    user_id: 'guest-user',
    order_date: isoDaysAgo(5),
    order_amount: 1249,
    products: [buildItem('prod-010', 1), buildItem('prod-003', 2)],
    status: 'shipped',
    shipping_method: 'delivery',
    tracking_number: 'FEDEX-123456789',
    delivery_address: {
      county: 'Mombasa',
      city: 'Nyali',
      postal_address: 'Nyali Block 8',
      user_contact: '+254700000003',
    },
  },
  {
    id: 'TRL-88392',
    user_id: 'guest-user',
    order_date: isoDaysAgo(12),
    order_amount: 450.5,
    products: [buildItem('prod-016', 1), buildItem('prod-006', 2)],
    status: 'delivered',
    shipping_method: 'delivery',
    tracking_number: 'DHL-88299121',
    delivered_at: isoDaysAgo(9),
    shipping_progress: {
      placed_at: isoDaysAgo(12),
      shipped_at: isoDaysAgo(11),
      out_for_delivery_at: isoDaysAgo(10),
      delivered_at: isoDaysAgo(9),
    },
    delivery_address: {
      county: 'Nakuru',
      city: 'Nakuru Town',
      postal_address: 'Nakuru 23',
      user_contact: '+254700000004',
    },
  },
  {
    id: 'TRL-88111',
    user_id: 'guest-user',
    order_date: isoDaysAgo(15),
    order_amount: 315,
    products: [buildItem('prod-001', 1)],
    status: 'cancelled',
    shipping_method: 'delivery',
    cancelled_at: isoDaysAgo(13),
    cancellation_reason: 'Changed my mind before dispatch.',
    delivery_address: {
      county: 'Nairobi',
      city: 'Kilimani',
      postal_address: 'Kilimani 11',
      user_contact: '+254700000005',
    },
  },
  {
    id: 'TRL-99201',
    user_id: 'guest-user',
    order_date: isoDaysAgo(20),
    order_amount: 1240,
    products: [buildItem('prod-002', 1), buildItem('prod-010', 1)],
    status: 'delivered',
    shipping_method: 'delivery',
    delivered_at: isoDaysAgo(16),
    return_request: {
      id: 'RET-5521',
      created_at: isoDaysAgo(14),
      status: 'approved',
      reason: 'Damaged item',
      notes: 'Outer packaging was damaged and one item has scratches.',
      timeline: {
        requested_at: isoDaysAgo(14),
        approved_at: isoDaysAgo(13),
        shipped_back_at: null,
        refunded_at: null,
      },
    },
    delivery_address: {
      county: 'Nairobi',
      city: 'Upper Hill',
      postal_address: 'Upper Hill 19',
      user_contact: '+254700000006',
    },
  },
];
