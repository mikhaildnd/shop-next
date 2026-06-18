-- 1. Разрешаем отсутствие скидки

ALTER TABLE "products"
    ALTER COLUMN "sale_price" DROP NOT NULL;

-- 2. Нормализуем данные

UPDATE "products"
SET "sale_price" = NULL
WHERE "sale_price" = "regular_price";

-- 3. Проверка корректности цен

ALTER TABLE "products"
    ADD CONSTRAINT "products_sale_price_check"
        CHECK (
            "sale_price" IS NULL
                OR "sale_price" <= "regular_price"
            );

-- 4. Эффективная цена

ALTER TABLE "products"
    ADD COLUMN "effective_price" DECIMAL(10,2)
        GENERATED ALWAYS AS (
            COALESCE("sale_price", "regular_price")
            ) STORED;

-- 5. Процент скидки

ALTER TABLE "products"
    ADD COLUMN "discount_percent" INTEGER
        GENERATED ALWAYS AS (
            CASE
                WHEN "sale_price" IS NULL THEN 0
                WHEN "regular_price" <= 0 THEN 0
                ELSE ROUND(
                    (
                        ("regular_price" - "sale_price")
                            / "regular_price"
                        ) * 100
                     )
                END
            ) STORED;

-- 6. Индексы для каталога

CREATE INDEX "products_effective_price_idx"
    ON "products" ("effective_price");

CREATE INDEX "products_discount_percent_idx"
    ON "products" ("discount_percent");