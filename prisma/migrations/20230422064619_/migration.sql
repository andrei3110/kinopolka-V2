/*
  Warnings:

  - The primary key for the `items__genres` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `items__genres` table. All the data in the column will be lost.
  - Made the column `genres__id` on table `items__genres` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item__id` on table `items__genres` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `items__genres` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `genres__id` INTEGER NOT NULL,
    MODIFY `item__id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`genres__id`, `item__id`);

-- AddForeignKey
ALTER TABLE `items__genres` ADD CONSTRAINT `items__genres_item__id_fkey` FOREIGN KEY (`item__id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items__genres` ADD CONSTRAINT `items__genres_genres__id_fkey` FOREIGN KEY (`genres__id`) REFERENCES `genres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
