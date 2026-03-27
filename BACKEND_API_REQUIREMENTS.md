# Tradelink Frontend -> Backend API Requirements (Exhaustive)

This document defines the API contract required for the current frontend to run full end-to-end.

Status legend:
- Required now: directly used by current UI and logic.
- Required soon: present in shared endpoint constants or flows, but not fully wired in all screens yet.

## 1) Global API Requirements

### Base URL
- Use env-driven base URL compatible with frontend setting: `VITE_API_BASE_URL`.
- Local fallback currently points to: `http://localhost:8000/api`.

### Content Type
- Request and response content type: `application/json`.

### Authentication
- Use Bearer token auth for protected routes.
- Header format:
  - `Authorization: Bearer <access_token>`

### Token Refresh Behavior
- On `401`, frontend attempts refresh using:
  - `POST /auth/refresh`
  - Body: `{ "refresh_token": "<token>" }`
- Refresh response must return:
  - `access_token` (required)
- If refresh fails, frontend clears tokens and redirects to login.

### Date/Time Format
- All datetime fields should be ISO-8601 strings parseable by JS `Date` and Zod `.datetime()`.

### Error Format
- Frontend reads `response.data.message` first, then `response.data.detail`.
- Standardize error body as:
  - `{ "message": "Human readable message" }`
  - Optional: `{ "detail": "..." }`

## 2) Canonical Enum Values

### User roles
- `buyer`
- `vendor`
- `admin`

### User gender
- `male`
- `female`
- `other`

### Order status
- `pending`
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`

### Shipping method
- `pickup`
- `delivery`

### Payment provider
- `mpesa`
- `card`
- `bank_transfer`

### Payment status
- `pending`
- `completed`
- `failed`
- `refunded`

### Transaction type
- `purchase`
- `refund`

### Return status
- `requested`
- `approved`
- `shipped_back`
- `refunded`

### Feedback type
- `bug_report`
- `feature_request`
- `general`
- `complaint`

### Kenya counties (for profile address county)
- Nairobi
- Mombasa
- Kisumu
- Nakuru
- Eldoret
- Kiambu
- Machakos
- Kajiado
- Murang'a
- Nyeri
- Meru
- Embu
- Garissa
- Kwale
- Kilifi
- Taita Taveta
- Kakamega
- Bungoma
- Vihiga
- Trans Nzoia
- Uasin Gishu
- Nandi
- Kericho
- Bomet
- Narok
- Kisii
- Nyamira
- Homa Bay
- Migori
- Siaya
- Busia
- Other

## 3) Core Data Contracts (Required Variables)

All fields below are required unless marked optional.

### 3.1 User (public)
- `user_id`: string
- `username`: string (min 3)
- `user_fname`: string
- `user_lname`: string
- `user_email`: valid email
- `user_role`: one of user roles
- `user_gender`: optional enum
- `user_dob`: optional datetime string
- `user_cart`: optional string

### 3.2 Auth response
- `access_token`: string
- `refresh_token`: string
- `user`: User object

### 3.3 Category
- `id`: string
- `name`: string
- `description`: optional string
- `image_url`: optional string

### 3.4 Product
- `id`: string
- `name`: string
- `price`: number > 0
- `description`: string
- `stock_quantity`: integer >= 0
- `image_url`: string
- `category_id`: optional string
- `category`: optional Category
- `vendor_id`: optional string
- `vendor_name`: optional string
- `average_rating`: optional number [0..5]
- `review_count`: optional integer >= 0
- `created_at`: optional datetime

### 3.5 Product list response
- `products`: Product[]
- `total`: integer
- `page`: integer
- `limit`: integer

### 3.6 Cart item
- `product_id`: string
- `product_name`: string
- `product_image`: string
- `quantity`: integer > 0
- `unit_price`: number > 0
- `subtotal`: number > 0

### 3.7 Cart
- `id`: string
- `user_id`: string
- `date_created`: datetime
- `total_price`: number >= 0
- `products`: Cart item[]

### 3.8 Delivery address (order)
- `county`: string
- `city`: string
- `postal_address`: string
- `user_contact`: string

### 3.9 Order issue report
- `type`: string
- `details`: string
- `reported_at`: datetime

### 3.10 Return request
- `id`: string
- `created_at`: datetime
- `status`: return status enum
- `reason`: string
- `notes`: string
- `timeline`:
  - `requested_at`: datetime or null
  - `approved_at`: datetime or null
  - `shipped_back_at`: datetime or null
  - `refunded_at`: datetime or null

### 3.11 Order
- `id`: string
- `user_id`: string
- `order_date`: datetime
- `order_amount`: number > 0
- `products`: Order item[] (same shape as cart item)
- `status`: order status enum
- `shipping_method`: shipping method enum
- `tracking_number`: optional string or null
- `delivered_at`: optional datetime
- `cancelled_at`: optional datetime
- `cancellation_reason`: optional string
- `issue_report`: optional object (see issue report)
- `return_request`: optional object (see return request)
- `delivery_address`: optional object (see delivery address)

### 3.12 Order list response
- `orders`: Order[]
- `total`: integer

### 3.13 Payment method
- `id`: string
- `brand`: string
- `last4`: string length 4
- `expiry_month`: string
- `expiry_year`: string
- `holder_name`: string
- `is_default`: boolean

### 3.14 Payment
- `id`: string
- `user_id`: string
- `order_id`: string
- `amount`: number > 0
- `payment_provider`: enum
- `status`: enum
- `transaction_type`: enum
- `created_at`: optional datetime
- `phone_number`: optional string
- `payment_method_id`: optional string

### 3.15 Review
- `id`: string
- `user_id`: string
- `username`: optional string
- `product_id`: string
- `rating_value`: integer [1..5]
- `comment`: optional string (max 500)
- `verified_purchase`: optional boolean
- `helpful_count`: optional integer >= 0
- `date`: datetime

### 3.16 Review list response
- `reviews`: Review[]
- `total`: integer
- `average_rating`: number [0..5]

### 3.17 Feedback
- `id`: string
- `user_id`: string
- `type`: feedback type enum
- `message`: string (10..1000 chars)
- `created_at`: optional datetime

### 3.18 Profile address
- `id`: optional string (present on stored addresses)
- `label`: optional string
- `country`: string (default Kenya)
- `county`: one of Kenya counties
- `city`: string
- `line1`: optional string
- `postal_address`: string
- `user_email`: valid email
- `user_contact`: string (min length 10)
- `is_default`: optional boolean

### 3.19 Notification preferences
- `order_updates`: boolean
- `marketing_emails`: boolean
- `price_drop_alerts`: boolean

### 3.20 Privacy preferences
- `analytics`: boolean
- `marketing`: boolean

### 3.21 Profile
- `user_id`: string
- `username`: string
- `user_fname`: string
- `user_lname`: string
- `user_email`: email
- `user_phone`: optional string
- `user_role`: enum
- `addresses`: Profile address[]
- `notification_preferences`: object
- `privacy_preferences`: object

### 3.22 Vendor dashboard
- `total_revenue`: number >= 0
- `total_orders`: integer >= 0
- `pending_orders`: integer >= 0
- `active_products`: integer >= 0
- `recent_orders`: array of
  - `id`: string
  - `order_date`: datetime
  - `order_amount`: number > 0
  - `status`: string

### 3.23 Admin dashboard stats
- `total_users`: integer >= 0
- `total_vendors`: integer >= 0
- `total_buyers`: integer >= 0
- `total_products`: integer >= 0
- `total_orders`: integer >= 0
- `total_revenue`: number >= 0
- `pending_orders`: integer >= 0
- `new_users_today`: integer >= 0

### 3.24 Admin user summary
- `user_id`: uuid string (strict)
- `username`: string
- `user_email`: email
- `user_role`: enum
- `created_at`: optional datetime
- `is_active`: boolean

### 3.25 Admin users response
- `users`: Admin user summary[]
- `total`: integer

## 4) Endpoint Catalog

## 4.1 Auth APIs

### POST /auth/login (Required now)
Request:
- `email` (required, email)
- `password` (required, min 8)

Response:
- Auth response object

### POST /auth/register (Required now)
Request:
- `username` (required)
- `user_fname` (required)
- `user_lname` (required)
- `user_email` (required, email)
- `user_password` (required, min 8)
- `confirm_password` (required, must equal `user_password`)
- `user_role` (optional, default `buyer`)
- `user_gender` (optional)
- `user_dob` (optional)

Response:
- Auth response object

### POST /auth/logout (Required now)
Request:
- Auth header required
- Body optional

Response:
- 200 with success message/object

### POST /auth/refresh (Required now)
Request:
- `refresh_token` (required)

Response:
- `access_token` (required)
- `refresh_token` (optional but recommended to rotate)

### POST /auth/forgot-password (Required now, currently mapped by auth flow)
Request:
- `email` (required)

Response:
- `{ "message": "Reset link sent." }`

## 4.2 User/Profile APIs

Shared constants already include `/users/me` for read/update.

### GET /users/me (Required now)
Response:
- Profile object

### PATCH /users/me (Required now)
Request body (all optional, partial update):
- `user_fname`
- `user_lname`
- `username`
- `user_email`
- `user_phone`
- `user_gender`
- `user_dob`
- `notification_preferences`
- `privacy_preferences`
- `delivery_address` (optional address object if server supports inline)

Response:
- Profile object

### POST /users/me/addresses (Required now)
Request body:
- `label` (required)
- `country` (required)
- `county` (required enum)
- `city` (required)
- `line1` (frontend sends this as required in address form)
- `postal_address` (required)
- `user_email` (required)
- `user_contact` (required)

Response:
- Profile object (or updated `addresses`; frontend currently expects full profile)

### DELETE /users/me/addresses/{addressId} (Required now)
Response:
- Profile object

### PATCH /users/me/addresses/{addressId}/default (Required now)
Response:
- Profile object

### PATCH /users/me/notifications (Required now)
Request body:
- `order_updates` (required)
- `marketing_emails` (required)
- `price_drop_alerts` (required)

Response:
- Profile object

### PATCH /users/me/privacy (Required now)
Request body:
- `analytics` (required)
- `marketing` (required)

Response:
- Profile object

### POST /users/me/export (Required now)
Response:
- `{ "message": "Your export request has been received. ..." }`

## 4.3 Product APIs

### GET /products (Required now)
Query params supported by frontend schema:
- `search` (optional)
- `category_id` (optional)
- `min_price` (optional number)
- `max_price` (optional number)
- `in_stock` (optional boolean)
- `page` (optional, default 1)
- `limit` (optional, default 20, max 100)

Response:
- Product list response

### GET /products/{id} (Required now)
Response:
- Product object

### GET /products/search (Required soon)
Response:
- Product list response (same shape)

### POST /products (Required soon)
Request:
- product create payload compatible with Product schema

Response:
- Product object

### PATCH /products/{id} (Required soon)
Request:
- partial product fields

Response:
- Product object

### DELETE /products/{id} (Required soon)
Response:
- success object

## 4.4 Cart APIs

### GET /cart (Required now)
Response:
- Cart object

### POST /cart/items (Required now)
Request body:
- `product_id` (required)
- `quantity` (required, integer >= 1)

Response:
- Cart object

### PATCH /cart/items/{itemId} (Required now)
Request body:
- `quantity` (required, integer >= 1)

Response:
- Cart object

### DELETE /cart/items/{itemId} (Required now)
Response:
- Cart object

### POST /cart/clear (Required now)
Response:
- success object

## 4.5 Order APIs

### GET /orders (Required now)
Query:
- `status` optional values used by UI:
  - `all`
  - `pending`
  - `processing` (UI alias for `confirmed`)
  - `shipped`
  - `delivered`
  - `cancelled`
  - `returns`

Response:
- Order list response

### GET /orders/{id} (Required now)
Response:
- Order object

### POST /orders (Required now)
Request body:
- `shipping_method` (required enum)
- `products` (required in actual checkout flow; array of cart/order items)
- `delivery_address` (optional by schema, but provided by checkout for delivery)

Response:
- Order object

### POST /orders/{id}/confirm (Required now)
Response:
- Updated Order object (status should become `delivered` in current UI flow)

### POST /orders/{id}/cancel (Required now)
Request body:
- `reason` (required string in practical flow)

Response:
- Updated Order object with:
  - `status = cancelled`
  - `cancelled_at`
  - `cancellation_reason`

### POST /orders/{id}/issue (Required now)
Request body:
- `type` (required string, UI values currently from these labels):
  - Damaged item
  - Missing item
  - Wrong item received
  - Delayed shipping
  - Other
- `details` (required)

Response:
- Updated Order object with `issue_report`

### POST /orders/{id}/return (Required now)
Request body:
- `reason` (required string)
- `notes` (required string in practical UI flow)

Response:
- Updated Order object with `return_request`

### PATCH /orders/{id}/status (Required soon)
Request body:
- `status` (required enum)

Response:
- Updated Order object

## 4.6 Payment APIs

### GET /payments/methods (Required now)
Response:
- `{ "methods": PaymentMethod[] }`

### POST /payments/methods (Required now)
Request body:
- `brand` (required)
- `card_number` (required; frontend derives `last4` from this)
- `expiry_month` (required)
- `expiry_year` (required)
- `holder_name` (required)

Response:
- PaymentMethod object

### PATCH /payments/methods/{id}/default (Required now)
Response:
- PaymentMethod object (or full method list)

### DELETE /payments/methods/{id} (Required now)
Response:
- `{ "methods": PaymentMethod[] }` or success object

### POST /payments (Required now)
Request body:
- `order_id` (required)
- `payment_provider` (required enum)
- `amount` (required > 0)
- `payment_method_id` (required when `payment_provider = card`)
- `phone_number` (required when `payment_provider = mpesa`)

Response:
- Payment object

### GET /payments/{id}/verify (Required soon)
Response:
- Payment object

## 4.7 Review APIs

### GET /products/{productId}/reviews (Required now)
Response:
- Review list response

### POST /products/{productId}/reviews (Required now)
Request body:
- `rating_value` (required integer 1..5)
- `comment` (optional, max 500)

Response:
- Review object

### DELETE /reviews/{id} (Required soon)
Response:
- success object

## 4.8 Feedback APIs

### POST /feedback (Required now)
Request body:
- `type` (required enum)
- `message` (required, 10..1000 chars)

Response:
- Preferred shape currently consumed:
  - `{ "success": true, "item": <FeedbackObject> }`

## 4.9 Vendor APIs

### GET /vendor/dashboard (Required now)
Response:
- Vendor dashboard object

### GET /vendor/products (Required now)
Response:
- `{ "products": Product[] }`

### POST /vendor/products (Required now)
Request body:
- `name` (required)
- `price` (required > 0)
- `description` (required, min 10)
- `category_id` (required)
- `stock_quantity` (required int >= 0)
- `image_url` (required valid URL)

Response:
- Created Product object

### PATCH /vendor/products/{id} (Required now)
Request body:
- any updatable vendor product fields

Response:
- Updated Product object

### DELETE /vendor/products/{id} (Required now)
Response:
- success object

## 4.10 Admin APIs

### GET /admin/dashboard (Required now)
Response:
- Admin dashboard stats object

### GET /admin/users (Required now)
Query params (recommended):
- `page`
- `limit`
- `search`
- `role`
- `is_active`

Response:
- Admin users response

### GET /admin/users/{id} (Required soon)
Response:
- detailed admin user object (at least compatible with summary fields)

### GET /admin/orders (Required soon)
Response:
- order list for admin dashboard tooling

## 5) Frontend Behavioral Expectations

### Response shape style
- Frontend currently expects direct typed objects, not deeply nested envelopes.
- Example: for product list, return `{ products, total, page, limit }` directly.

### Validation strictness
- Frontend validates many responses with Zod schemas.
- Missing required fields or wrong enum values will fail rendering flows.

### ID handling
- Most IDs are treated as opaque strings.
- Exception: admin user summary currently expects `user_id` as UUID.

## 6) Recommended Delivery Order (Backend)

1. Auth + refresh + forgot-password
2. Products + cart
3. Orders + payments (including payment methods)
4. Reviews + feedback
5. Profile endpoints under `/users/me`
6. Vendor endpoints
7. Admin endpoints

## 7) Minimal Smoke Test Checklist

1. Login returns tokens and user profile.
2. GET /products returns list with pagination keys.
3. Cart add/update/remove/clear roundtrip returns valid cart object.
4. Checkout can create order then payment, then read order detail.
5. Order actions (cancel, report issue, return, confirm delivery) mutate expected fields.
6. Review creation updates product review list.
7. Feedback submission returns success payload.
8. Profile read/update/address/privacy/notification/export all return valid profile or message shapes.
9. Vendor dashboard/products endpoints return contract shapes.
10. Admin dashboard/users endpoints return contract shapes.
