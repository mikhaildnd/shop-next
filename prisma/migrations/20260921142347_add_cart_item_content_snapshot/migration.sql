/*
  Warnings:

  - Added the required column `snapshot_title` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "snapshot_image_url" TEXT,
ADD COLUMN     "snapshot_title" TEXT NOT NULL;
