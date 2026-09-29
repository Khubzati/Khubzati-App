# Khubzati B2B Business Rules

1. Bakery is the supplier and owns the sellable Bakery product catalog.
2. Restaurant is an approved business buyer, not a consumer-food seller in the core flow.
3. Restaurant browses only approved Bakeries and available Bakery products.
4. A purchasing cart belongs to a Restaurant purchasing context and contains products from one Bakery supplier per checkout.
5. A B2B order must identify one Restaurant buyer and one Bakery supplier.
6. Customer is not the buyer in the core B2B transaction.
7. Bakery may accept or reject its own incoming Restaurant order and prepare accepted orders.
8. Another Bakery cannot read or mutate the order.
9. Another Restaurant cannot read or mutate the order.
10. Driver pickup is the Bakery; delivery destination is the Restaurant or its approved business delivery address.
11. Restaurant confirms receipt and can view purchase history/reorder.
12. Bakery views sales and fulfillment history.
13. Product, price, modifier, supplier, and buyer snapshots must remain immutable on placed orders.
14. Admin approval treats Bakery as supplier and Restaurant as buyer; it must not imply symmetric selling capability.
15. Existing finance, idempotency, revocation, and authorization guarantees remain mandatory.
