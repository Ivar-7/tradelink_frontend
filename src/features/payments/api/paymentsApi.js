import { PaymentMethodListSchema, PaymentMethodSchema, PaymentSchema } from '../payments.types';
import { initialPaymentMethods } from '../data/paymentData';

const PAYMENT_METHODS_STORAGE_KEY = 'tradelink-payment-methods';
const PAYMENTS_STORAGE_KEY = 'tradelink-payments';

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const readMethods = () => {
  const raw = localStorage.getItem(PAYMENT_METHODS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(initialPaymentMethods));
    return [...initialPaymentMethods];
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(initialPaymentMethods));
    return [...initialPaymentMethods];
  }
};

const saveMethods = (methods) => {
  localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(methods));
};

const readPayments = () => {
  const raw = localStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const savePayments = (payments) => {
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
};

export const getPaymentMethods = async () => {
  await wait(150);
  const methods = readMethods();
  return PaymentMethodListSchema.parse({ methods });
};

export const addPaymentMethod = async (payload) => {
  await wait();
  const methods = readMethods();

  const method = {
    id: `pm-${Date.now()}`,
    brand: payload.brand,
    last4: payload.card_number.slice(-4),
    expiry_month: payload.expiry_month,
    expiry_year: payload.expiry_year,
    holder_name: payload.holder_name,
    is_default: methods.length === 0,
  };

  const next = [...methods, method];
  saveMethods(next);
  return PaymentMethodSchema.parse(method);
};

export const setDefaultPaymentMethod = async (id) => {
  await wait(120);
  const methods = readMethods();
  const next = methods.map((item) => ({ ...item, is_default: item.id === id }));
  saveMethods(next);
  const selected = next.find((item) => item.id === id);
  if (!selected) {
    throw new Error('Payment method not found.');
  }
  return PaymentMethodSchema.parse(selected);
};

export const removePaymentMethod = async (id) => {
  await wait(120);
  const methods = readMethods();
  const target = methods.find((item) => item.id === id);
  if (!target) {
    throw new Error('Payment method not found.');
  }

  const next = methods.filter((item) => item.id !== id);
  if (target.is_default && next.length > 0) {
    next[0].is_default = true;
  }
  saveMethods(next);
  return { methods: next };
};

export const createPayment = async (payload) => {
  await wait(450);

  const methods = readMethods();
  if (payload.payment_provider === 'card') {
    const hasMethod = methods.some((method) => method.id === payload.payment_method_id);
    if (!hasMethod) {
      throw new Error('Select a valid payment method.');
    }
  }

  const payment = {
    id: `pay-${Date.now()}`,
    user_id: 'guest-user',
    order_id: payload.order_id,
    amount: payload.amount,
    payment_provider: payload.payment_provider,
    status: 'completed',
    transaction_type: 'purchase',
    created_at: new Date().toISOString(),
    phone_number: payload.phone_number,
    payment_method_id: payload.payment_method_id,
  };

  const payments = readPayments();
  payments.unshift(payment);
  savePayments(payments);

  return PaymentSchema.parse(payment);
};

export const verifyPayment = async (id) => {
  await wait(150);
  const payment = readPayments().find((item) => item.id === id);
  if (!payment) {
    throw new Error('Payment not found.');
  }
  return PaymentSchema.parse(payment);
};
