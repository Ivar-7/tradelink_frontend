STK PUSH PAYMENT SPECIFICATION

1. Objective
- Trigger one STK push request.
- Confirm payment outcome.
- Fulfill order only after confirmed success.

2. Initiation
- Method: POST
- Endpoint: https://hammerhead-app-wfzus.ondigitalocean.app/api/v1/payhero/payments/initiate
- Headers:
  - Content-Type: application/json
- Request body:
```json
{
  "phone_number": "07XXXXXXXX",
  "amount": 1200,
  "provider": "m-pesa",
  "external_reference": "order-123"
}
```

3. Initiation Response Requirements
- HTTP 2xx required.
- Response must include one provider reference field:
  - reference
  - providerPaymentId
  - checkoutRequestId
  - checkout_request_id
  - merchantRequestId
  - merchant_request_id
- If none is present, initiation fails.

4. Single-POST Rule
- Exactly one STK initiation POST per payment attempt.
- No automatic second initiate POST.
- Any additional call must be an explicit retry with idempotency protection.

5. Confirmation
- Confirm using at least one:
  - Status polling endpoint
  - Provider webhook callback
- Confirmation calls are not initiation calls.

6. Status Polling Contract
- Method: GET
- Endpoint: /payments/status?reference=<providerReference>
- Poll interval: 5 seconds
- Max attempts: 12

7. Status Mapping
- Success:
  - SUCCESS
  - COMPLETED
  - PAID
- Failure:
  - FAILED
  - CANCELLED
  - DECLINED
  - REJECTED
  - EXPIRED
  - ERROR
- Pending:
  - PENDING
  - PROCESSING
  - IN_PROGRESS
  - QUEUED
  - INITIATED

8. Success Evidence
- Any of the following confirms payment:
  - paid flag true
  - valid receipt/transaction code present
  - terminal success status

9. Failure and Timeout
- Failure status: mark payment failed immediately.
- Timeout without confirmation: keep pending or mark timed_out and reconcile later.
- Do not fulfill on timeout without confirmed success.

10. Fulfillment
- On confirmed success only:
  - Mark payment completed
  - Mark order paid
  - Issue product/ticket/access
- Execute in one atomic, idempotent operation.

11. Idempotency
- Use idempotency key or stable external reference per payment attempt.
- Enforce uniqueness on provider reference.
- Prevent duplicate charge handling and duplicate fulfillment.

12. Minimum Payment Record
```json
{
  "paymentId": "pay_123",
  "orderId": "order-123",
  "userId": "user-123",
  "amount": 1200,
  "currency": "KES",
  "phoneNumber": "07XXXXXXXX",
  "provider": "mpesa",
  "externalReference": "order-123",
  "providerReference": "stk_ref_abc",
  "status": "pending",
  "failureReason": null,
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601",
  "confirmedAt": null
}
```

13. State Lifecycle
- initiated -> pending -> completed
- initiated -> pending -> failed
- initiated -> pending -> cancelled
- initiated -> pending -> expired

14. Non-Negotiable Constraint
- One STK initiation POST per attempt. Only one.