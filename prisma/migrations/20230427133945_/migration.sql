/*
  Warnings:

  - Added the required column `countryId` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `countryId` INTEGER NOT NULL;
