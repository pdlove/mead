/*
  Warnings:

  - You are about to drop the column `notifyFailedPolls` on the `device_categories` table. All the data in the column will be lost.
  - Added the required column `notifyDownPolls` to the `device_categories` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_device_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notifyDownPolls" INTEGER NOT NULL,
    "notifyUpPolls" INTEGER NOT NULL,
    "pollInterval" INTEGER NOT NULL
);
INSERT INTO "new_device_categories" ("id", "name", "notifyUpPolls", "pollInterval") SELECT "id", "name", "notifyUpPolls", "pollInterval" FROM "device_categories";
DROP TABLE "device_categories";
ALTER TABLE "new_device_categories" RENAME TO "device_categories";
CREATE UNIQUE INDEX "device_categories_name_key" ON "device_categories"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
