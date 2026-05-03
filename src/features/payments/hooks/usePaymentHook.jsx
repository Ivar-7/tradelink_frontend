import { useState, useCallback, useRef } from 'react';
import * as paymentApi from '../api/paymentApi';
import { PAYMENT_STATUS, PAYMENT_PROVIDERS } from '../../../shared/constants/app';
import { useToastHook } from '../../../shared/hooks/useToastHook';

/**
 * Payment hook for handling STK push payment flow
 * Per payment.md: Exactly one STK initiation, status polling, then fulfillment
 */
export const usePaymentHook = () => {
  const toast = useToastHook();
  
  // Payment state
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  
  // Polling control
  const pollIntervalRef = useRef(null);
  const pollAttemptsRef = useRef(0);

  /**
   * Initiate STK push payment
   * Per payment.md: Single POST rule - exactly one initiation
   */
  const initiatePayment = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate input
      if (!paymentData.phone_number || !paymentData.amount || !paymentData.external_reference) {
        throw new Error('Missing required payment fields');
      }

      // Clear any previous polling
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      pollAttemptsRef.current = 0;

      // Single STK initiation POST
      const response = await paymentApi.initiateSTKPush({
        phone_number: paymentData.phone_number,
        amount: paymentData.amount,
        provider: paymentData.provider || PAYMENT_PROVIDERS.MPESA,
        external_reference: paymentData.external_reference,
      });

      const providerRef = 
        response.reference ||
        response.providerPaymentId ||
        response.checkoutRequestId ||
        response.checkout_request_id ||
        response.merchantRequestId ||
        response.merchant_request_id;

      // Set payment state
      setPayment({
        ...paymentData,
        providerReference: providerRef,
        status: 'pending',
        initiatedAt: new Date().toISOString(),
      });

      setPaymentStatus('pending');
      toast?.success?.('Payment request sent. Please check your phone.');

      return { success: true, providerReference: providerRef };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Payment initiation failed';
      setError(errorMsg);
      toast?.error?.(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Poll payment status
   * Per payment.md: 5-second interval, max 12 attempts (60 seconds)
   */
  const pollPaymentStatus = useCallback(async (providerReference, onStatusChange) => {
    if (!providerReference) {
      setError('No provider reference available');
      return { success: false };
    }

    return new Promise((resolve) => {
      const maxAttempts = 12;
      const pollInterval = 5000; // 5 seconds

      const poll = async () => {
        try {
          pollAttemptsRef.current += 1;
          const statusResponse = await paymentApi.checkPaymentStatus(providerReference);
          const status = statusResponse.status?.toUpperCase() || statusResponse.result?.status?.toUpperCase();

          // Success statuses per payment.md
          const successStatuses = ['SUCCESS', 'COMPLETED', 'PAID'];
          // Failure statuses
          const failureStatuses = ['FAILED', 'CANCELLED', 'DECLINED', 'REJECTED', 'EXPIRED', 'ERROR'];
          // Pending statuses
          const pendingStatuses = ['PENDING', 'PROCESSING', 'IN_PROGRESS', 'QUEUED', 'INITIATED'];

          if (successStatuses.includes(status)) {
            clearInterval(pollIntervalRef.current);
            setPaymentStatus(PAYMENT_STATUS.COMPLETED);
            setPayment((prev) => ({
              ...prev,
              status: PAYMENT_STATUS.COMPLETED,
              confirmedAt: new Date().toISOString(),
            }));
            onStatusChange?.(PAYMENT_STATUS.COMPLETED);
            resolve({ success: true, status: PAYMENT_STATUS.COMPLETED });
          } else if (failureStatuses.includes(status)) {
            clearInterval(pollIntervalRef.current);
            const failureReason = statusResponse.reason || 'Payment was declined';
            setPaymentStatus(PAYMENT_STATUS.FAILED);
            setPayment((prev) => ({
              ...prev,
              status: PAYMENT_STATUS.FAILED,
              failureReason,
            }));
            setError(failureReason);
            onStatusChange?.(PAYMENT_STATUS.FAILED);
            resolve({ success: false, status: PAYMENT_STATUS.FAILED, reason: failureReason });
          } else if (pendingStatuses.includes(status) && pollAttemptsRef.current < maxAttempts) {
            // Continue polling
            setPaymentStatus('polling');
          } else if (pollAttemptsRef.current >= maxAttempts) {
            // Timeout - keep pending, reconcile later per payment.md
            clearInterval(pollIntervalRef.current);
            setPaymentStatus(PAYMENT_STATUS.PENDING);
            resolve({ success: false, status: 'timeout' });
          }
        } catch (err) {
          console.error('Polling error:', err);
          if (pollAttemptsRef.current >= maxAttempts) {
            clearInterval(pollIntervalRef.current);
            resolve({ success: false, status: 'polling_error' });
          }
        }
      };

      // Initial poll
      poll();

      // Set up interval for subsequent polls
      pollIntervalRef.current = setInterval(poll, pollInterval);
    });
  }, []);

  /**
   * Handle successful payment - create order and record payment
   * Per payment.md: Execute in one atomic, idempotent operation
   */
  const fulfillPayment = useCallback(async (orderData) => {
    if (!payment) {
      setError('No payment initiated');
      return { success: false };
    }

    setLoading(true);
    
    try {
      // Create order
      const createdOrder = await paymentApi.createOrder({
        user_id: orderData.user_id,
        order_amount: orderData.amount,
        items: orderData.items,
        shipping_method: orderData.shipping_method,
        delivery_address: orderData.delivery_address,
        notes: orderData.notes || '',
      });

      // Record payment with order
      const paymentRecord = await paymentApi.recordPayment({
        order_id: createdOrder.id,
        user_id: orderData.user_id,
        amount: payment.amount,
        provider: payment.provider || PAYMENT_PROVIDERS.MPESA,
        phone_number: payment.phone_number,
        external_reference: payment.external_reference,
        provider_reference: payment.providerReference,
        status: PAYMENT_STATUS.COMPLETED,
      });

      setPayment((prev) => ({
        ...prev,
        orderId: createdOrder.id,
        paymentId: paymentRecord.id,
        fulfillmentComplete: true,
      }));

      toast?.success?.('Order created successfully!');
      return { success: true, order: createdOrder, payment: paymentRecord };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Order creation failed';
      setError(errorMsg);
      toast?.error?.(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [payment, toast]);

  /**
   * Reset payment state for retry
   */
  const resetPayment = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    setPayment(null);
    setPaymentStatus(null);
    setError(null);
    pollAttemptsRef.current = 0;
  }, []);

  /**
   * Cleanup on unmount
   */
  const cleanup = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  }, []);

  return {
    payment,
    paymentStatus,
    loading,
    error,
    initiatePayment,
    pollPaymentStatus,
    fulfillPayment,
    resetPayment,
    cleanup,
  };
};

export default usePaymentHook;
