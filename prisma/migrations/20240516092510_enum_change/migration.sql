/*
  Warnings:

  - The values [SUCCEED,FAILDED,PROCESSIONG] on the enum `files_uploadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `files` MODIFY `uploadStatus` ENUM('PENDING', 'SUCCESS', 'FAILED', 'PROCESSING') NOT NULL DEFAULT 'PENDING';
