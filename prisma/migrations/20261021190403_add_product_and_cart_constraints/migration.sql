-- Replace the existing sale price constraint
ALTER TABLE "products"
DROP CONSTRAINT "products_sale_price_check";

-- Product price constraints
ALTER TABLE "products"
    ADD CONSTRAINT "products_regular_price_positive"
        CHECK ("regular_price" > 0),
    ADD CONSTRAINT "products_sale_price_valid"
        CHECK (
            "sale_price" IS NULL
                OR (
                    "sale_price" > 0
                    AND "sale_price" <= "regular_price"
                )
        );

-- Product numeric field constraints
ALTER TABLE "products"
    ADD CONSTRAINT "products_stock_non_negative"
        CHECK ("stock" >= 0),
    ADD CONSTRAINT "products_rating_count_non_negative"
        CHECK ("rating_count" >= 0),
    ADD CONSTRAINT "products_rating_rate_range"
        CHECK ("rating_rate" >= 0 AND "rating_rate" <= 5),
    ADD CONSTRAINT "products_measure_value_positive"
        CHECK ("measure_value" > 0);

-- Cart item constraints
ALTER TABLE "cart_items"
    ADD CONSTRAINT "cart_items_quantity_positive"
        CHECK ("quantity" > 0),
    ADD CONSTRAINT "cart_items_snapshot_effective_price_positive"
        CHECK ("snapshot_effective_price" > 0);