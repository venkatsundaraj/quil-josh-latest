/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_subscription_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `stripe_current_period_end` DATETIME(3) NULL,
    ADD COLUMN `stripe_customer_id` VARCHAR(191) NULL,
    ADD COLUMN `stripe_price_id` VARCHAR(191) NULL,
    ADD COLUMN `stripe_subscription_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `accounts_stripe_customer_id_key` ON `accounts`(`stripe_customer_id`);

-- CreateIndex
CREATE UNIQUE INDEX `accounts_stripe_subscription_id_key` ON `accounts`(`stripe_subscription_id`);
