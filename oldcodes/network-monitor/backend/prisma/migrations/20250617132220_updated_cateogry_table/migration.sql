/*
  Warnings:

  - Added the required column `lastPoll` to the `device_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextPoll` to the `device_categories` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_device_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notifyDownPolls" INTEGER NOT NULL,
    "notifyUpPolls" INTEGER NOT NULL,
    "pollInterval" INTEGER NOT NULL,
    "lastPoll" DATETIME NOT NULL,
    "nextPoll" DATETIME NOT NULL,
    "claimedNode" TEXT,
    "claimHeartbeat" DATETIME
);
INSERT INTO "new_device_categories" ("id", "name", "notifyDownPolls", "notifyUpPolls", "pollInterval") SELECT "id", "name", "notifyDownPolls", "notifyUpPolls", "pollInterval" FROM "device_categories";
DROP TABLE "device_categories";
ALTER TABLE "new_device_categories" RENAME TO "device_categories";
CREATE UNIQUE INDEX "device_categories_name_key" ON "device_categories"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
