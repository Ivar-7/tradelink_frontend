import { OrderSchema, OrderListResponseSchema } from '../orders.types';
import { initialOrders } from '../data/ordersData';

const ORDERS_STORAGE_KEY = 'tradelink-local-orders';

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const readOrders = () => {
  const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialOrders));
    return [...initialOrders];
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialOrders));
    return [...initialOrders];
  }
};

const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

const normalizeOrderAmount = (order) => ({
  ...order,
  order_amount: Number(
    order.products.reduce((sum, item) => sum + item.quantity * item.unit_price, 0).toFixed(2)
  ),
});

const normalizeOrders = (orders) => orders.map((order) => normalizeOrderAmount(order));

const parseOrder = (order) => OrderSchema.parse(normalizeOrderAmount(order));

const filterOrdersByStatus = (orders, status) => {
  if (!status || status === 'all') {
    return orders;
  }

  if (status === 'processing') {
    return orders.filter((order) => order.status === 'confirmed');
  }

  if (status === 'returns') {
    return orders.filter((order) => Boolean(order.return_request));
  }

  return orders.filter((order) => order.status === status);
};

export const getOrders = async (status = 'all') => {
  await wait();
  const orders = normalizeOrders(readOrders());
  const filtered = filterOrdersByStatus(orders, status);

  return OrderListResponseSchema.parse({
    orders: filtered,
    total: filtered.length,
  });
};

export const getOrderById = async (id) => {
  await wait();
  const order = readOrders().find((item) => item.id === id);
  if (!order) {
    throw new Error('Order not found.');
  }

  return parseOrder(order);
};

export const createOrder = async (payload) => {
  await wait();
  const orders = readOrders();
  const next = {
    id: `TRL-${Math.floor(10000 + Math.random() * 89999)}`,
    user_id: 'guest-user',
    order_date: new Date().toISOString(),
    order_amount: payload.products.reduce((sum, item) => sum + item.subtotal, 0),
    products: payload.products,
    status: 'pending',
    shipping_method: payload.shipping_method ?? 'delivery',
    tracking_number: null,
    delivery_address: payload.delivery_address,
  };

  orders.unshift(next);
  saveOrders(orders);
  return parseOrder(next);
};

export const confirmDelivery = async (id) => {
  await wait();
  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) {
    throw new Error('Order not found.');
  }

  orders[index] = {
    ...orders[index],
    status: 'delivered',
    delivered_at: new Date().toISOString(),
  };

  saveOrders(orders);
  return parseOrder(orders[index]);
};

export const cancelOrder = async (id, reason) => {
  await wait();
  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) {
    throw new Error('Order not found.');
  }

  if (orders[index].status === 'delivered') {
    throw new Error('Delivered orders cannot be cancelled.');
  }

  orders[index] = {
    ...orders[index],
    status: 'cancelled',
    cancelled_at: new Date().toISOString(),
    cancellation_reason: reason,
  };

  saveOrders(orders);
  return parseOrder(orders[index]);
};

export const reportOrderIssue = async (id, payload) => {
  await wait();
  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) {
    throw new Error('Order not found.');
  }

  orders[index] = {
    ...orders[index],
    issue_report: {
      type: payload.type,
      details: payload.details,
      reported_at: new Date().toISOString(),
    },
  };

  saveOrders(orders);
  return parseOrder(orders[index]);
};

export const initiateReturn = async (id, payload) => {
  await wait();
  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index < 0) {
    throw new Error('Order not found.');
  }

  orders[index] = {
    ...orders[index],
    return_request: {
      id: `RET-${Math.floor(1000 + Math.random() * 8999)}`,
      created_at: new Date().toISOString(),
      status: 'requested',
      reason: payload.reason,
      notes: payload.notes,
      timeline: {
        requested_at: new Date().toISOString(),
        approved_at: null,
        shipped_back_at: null,
        refunded_at: null,
      },
    },
  };

  saveOrders(orders);
  return parseOrder(orders[index]);
};
