import { VendorDashboardSchema } from '../vendor.types';
import { getVendorProductsStorageKey, seedVendorProducts } from '../data/vendorStoreData';

const ORDERS_STORAGE_KEY = 'tradelink-local-orders';

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const readVendorProducts = () => {
  const key = getVendorProductsStorageKey();
  const raw = localStorage.getItem(key);

  if (!raw) {
    const seeded = seedVendorProducts();
    localStorage.setItem(key, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const seeded = seedVendorProducts();
    localStorage.setItem(key, JSON.stringify(seeded));
    return seeded;
  }
};

const saveVendorProducts = (products) => {
  localStorage.setItem(getVendorProductsStorageKey(), JSON.stringify(products));
};

const readOrders = () => {
  const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const getVendorDashboard = async () => {
  await wait();

  const products = readVendorProducts();
  const orders = readOrders();
  const productIds = new Set(products.map((item) => item.id));

  const vendorOrders = orders.filter((order) =>
    order.products?.some((product) => productIds.has(product.product_id))
  );

  const totalRevenue = vendorOrders.reduce((sum, order) => sum + (order.order_amount ?? 0), 0);
  const pendingOrders = vendorOrders.filter(
    (order) => order.status === 'pending' || order.status === 'confirmed'
  ).length;

  const dashboard = {
    total_revenue: Number(totalRevenue.toFixed(2)),
    total_orders: vendorOrders.length,
    pending_orders: pendingOrders,
    active_products: products.filter((item) => item.is_active).length,
    recent_orders: vendorOrders.slice(0, 5).map((order) => ({
      id: order.id,
      order_date: order.order_date,
      order_amount: order.order_amount,
      status: order.status,
    })),
  };

  return VendorDashboardSchema.parse(dashboard);
};

export const getVendorProducts = async () => {
  await wait();
  return { products: readVendorProducts() };
};

export const createVendorProduct = async (payload) => {
  await wait();
  const products = readVendorProducts();

  const created = {
    id: `vendor-prod-${Date.now()}`,
    ...payload,
    vendor_id: 'vendor-sony',
    is_active: true,
    rating: 4.5,
    reviews_count: 0,
  };

  products.unshift(created);
  saveVendorProducts(products);
  return created;
};

export const updateVendorProduct = async (id, payload) => {
  await wait();
  const products = readVendorProducts();
  const index = products.findIndex((item) => item.id === id);

  if (index < 0) {
    throw new Error('Vendor product not found.');
  }

  products[index] = {
    ...products[index],
    ...payload,
  };

  saveVendorProducts(products);
  return products[index];
};

export const deleteVendorProduct = async (id) => {
  await wait();
  const products = readVendorProducts();
  const remaining = products.filter((item) => item.id !== id);
  saveVendorProducts(remaining);
};
