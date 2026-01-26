/*
  Warnings:

  - You are about to drop the `customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "customer" DROP CONSTRAINT "customer_userId_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_customerId_fkey";

-- DropTable
DROP TABLE "customer";

-- DropTable
DROP TABLE "subscription";
