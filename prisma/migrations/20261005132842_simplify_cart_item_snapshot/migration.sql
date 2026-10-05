/*
  Warnings:

  - You are about to drop the column `snapshot_image_url` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `snapshot_title` on the `cart_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "snapshot_image_url",
DROP COLUMN "snapshot_title";
