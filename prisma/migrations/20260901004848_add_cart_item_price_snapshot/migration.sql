/*
  Warnings:

  - Added the required column `snapshot_effective_price` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "snapshot_effective_price" DECIMAL(10,2) NOT NULL;
