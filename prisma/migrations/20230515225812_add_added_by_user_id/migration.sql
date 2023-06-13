/*
  Warnings:

  - Added the required column `added_by_user_id` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `added_by_user_id` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "added_by_user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "added_by_user_id" TEXT NOT NULL;
