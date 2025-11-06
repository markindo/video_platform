/*
  Warnings:

  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `canUpload` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
