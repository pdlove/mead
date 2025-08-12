/*
  Warnings:

  - You are about to drop the column `parentID` on the `devices` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_devices" (
    "DeviceID" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "type" TEXT,
    "deviceCategoryId" TEXT NOT NULL,
    "parentId" TEXT,
    "mac" TEXT,
    "ip" TEXT,
    "isDHCP" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Unknown',
    "lastPoll" DATETIME,
    "lastResponse" DATETIME,
    "description" TEXT,
    "notifyEnabled" BOOLEAN NOT NULL DEFAULT true,
    "connectionNotes" TEXT,
    "downNotificationSent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "devices_deviceCategoryId_fkey" FOREIGN KEY ("deviceCategoryId") REFERENCES "device_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "devices_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "devices" ("DeviceID") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_devices" ("DeviceID", "connectionNotes", "description", "deviceCategoryId", "downNotificationSent", "ip", "isDHCP", "lastPoll", "lastResponse", "mac", "model", "name", "notifyEnabled", "status", "type") SELECT "DeviceID", "connectionNotes", "description", "deviceCategoryId", "downNotificationSent", "ip", "isDHCP", "lastPoll", "lastResponse", "mac", "model", "name", "notifyEnabled", "status", "type" FROM "devices";
DROP TABLE "devices";
ALTER TABLE "new_devices" RENAME TO "devices";
CREATE UNIQUE INDEX "devices_mac_key" ON "devices"("mac");
CREATE UNIQUE INDEX "devices_ip_key" ON "devices"("ip");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
