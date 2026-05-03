import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';

/**
 * Initiate STK push payment for M-Pesa
 * Per payment.md: Exactly one STK initiation POST per payment attempt
 * @param {Object} payload
 * @param {string} payload.phone_number - Customer phone number (07XXXXXXXX)
 * @param {number} payload.amount - Amount in KES
 * @param {string} payload.provider - Payment provider (m-pesa)
 * @param {string} payload.external_reference - Unique order reference
 * @returns {Promise<Object>} Response with provider reference
 */
export const initiateSTKPush = async (payload) => {
  const response = await axiosInstance.post('/payhero/payments/initiate', payload);
  
  // Validate response contains a provider reference per payment.md requirement
  const providerRef = 
    response.data.reference ||
    response.data.providerPaymentId ||
    response.data.checkoutRequestId ||
    response.data.checkout_request_id ||
    response.data.merchantRequestId ||
    response.data.merchant_request_id;

  if (!providerRef) {
    throw new Error('Payment initiation failed: No provider reference in response');
  }

  return response.data;
};

/**
 * Check payment status via polling
 * Per payment.md: Poll interval 5 seconds, max 12 attempts (60 seconds total)
 * @param {string} reference - Provider reference from initiation
 * @returns {Promise<Object>} Payment status
 */
export const checkPaymentStatus = async (reference) => {
  const response = await axiosInstance.get(`/payhero/payments/status?reference=${reference}`);
  return response.data;
};

/**
 * Create order after successful payment
 * Per payment.md: Only on confirmed success
 * @param {Object} payload
 * @param {string} payload.user_id - User ID
 * @param {number} payload.amount - Order amount
 * @param {Array} payload.items - Cart items
 * @param {Object} payload.shipping - Shipping details
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (payload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, payload);
  return response.data;
};

/**
 * Create payment record
 * @param {Object} payload
 * @param {string} payload.order_id - Order ID
 * @param {string} payload.user_id - User ID
 * @param {number} payload.amount - Payment amount
 * @param {string} payload.provider - Payment provider
 * @param {string} payload.phone_number - Phone number
 * @param {string} payload.external_reference - Order reference
 * @param {string} payload.provider_reference - Provider payment reference
 * @returns {Promise<Object>} Created payment
 */
export const recordPayment = async (payload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.CREATE, payload);
  return response.data;
};

/**
 * Get order detail
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderDetail = async (orderId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(orderId));
  return response.data;
};

/**
 * Confirm payment on backend
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Verification response
 */
export const verifyPayment = async (paymentId) => {
  const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.VERIFY(paymentId), {});
  return response.data;
};
