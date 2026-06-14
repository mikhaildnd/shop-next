/*
  Warnings:

  - You are about to drop the column `base_price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `discount_percent` on the `products` table. All the data in the column will be lost.
  - Added the required column `regular_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_price` to the `products` table without a default value. This is not possible if the table is not empty.

*/

ALTER TABLE "products"
ADD COLUMN "regular_price" DECIMAL(10,2),
ADD COLUMN "sale_price" DECIMAL(10,2);

UPDATE "products"
SET
    "regular_price" = "base_price",
    "sale_price" = ROUND("base_price" * (100 - "discount_percent") / 100, 2);

ALTER TABLE "products"
ALTER COLUMN "regular_price" SET NOT NULL,
ALTER COLUMN "sale_price" SET NOT NULL;

ALTER TABLE "products"
DROP COLUMN "base_price",
DROP COLUMN "discount_percent";