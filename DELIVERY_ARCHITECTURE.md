# Delivery Architecture

## Core Entities
- `driver_profiles`: driver availability and profile metadata.
- `delivery_assignments`: order-delivery lifecycle, failure reason, proof image, delivery notes.

## Driver State Model
Assignment states:
- `assigned`
- `accepted`
- `picked_up`
- `out_for_delivery`
- `delivered`
- `failed`
- `rejected`
- `cancelled`

Valid transitions are enforced in `src/utils/delivery-state-machine.js`.

## Order Status Coupling
Assignment status maps back to order status:
- accepted/picked_up/out_for_delivery -> `out_for_delivery`
- delivered -> `delivered`
- failed/cancelled -> `cancelled`

## Driver APIs
- `GET /v1/driver/available-deliveries`
- `POST /v1/driver/assignments/:orderId/accept`
- `POST /v1/driver/assignments/:orderId/reject`
- `POST /v1/driver/assignments/:orderId/status`
- `GET /v1/driver/assignments`
- `GET /v1/driver/availability`
- `POST /v1/driver/availability`

## Proof of Delivery
Delivered events can include:
- `proofImageUrl`
- `deliveryNote`

Failed delivery captures:
- `failureReason`
- `failedAt`
