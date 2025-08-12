-- CreateTable
CREATE TABLE "devices" (
    "DeviceID" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "type" TEXT,
    "deviceCategoryId" TEXT NOT NULL,
    "mac" TEXT,
    "ip" TEXT,
    "isDHCP" BOOLEAN NOT NULL DEFAULT false,
    "lastPoll" DATETIME,
    "lastResponse" DATETIME,
    "parentDeviceID" TEXT,
    "connectionNotes" TEXT,
    "downNotificationSent" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "devices_deviceCategoryId_fkey" FOREIGN KEY ("deviceCategoryId") REFERENCES "device_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "devices_parentDeviceID_fkey" FOREIGN KEY ("parentDeviceID") REFERENCES "devices" ("DeviceID") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "device_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notifyFailedPolls" INTEGER NOT NULL,
    "notifyUpPolls" INTEGER NOT NULL,
    "pollInterval" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "poll_latencies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latencyMs" INTEGER NOT NULL,
    CONSTRAINT "poll_latencies_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("DeviceID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "aggregated_poll_latencies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "averageLatencyMs" REAL NOT NULL,
    "missedPollsCount" INTEGER NOT NULL,
    CONSTRAINT "aggregated_poll_latencies_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("DeviceID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "email_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "smtpHost" TEXT NOT NULL,
    "smtpPort" INTEGER NOT NULL,
    "smtpUser" TEXT,
    "smtpPass" TEXT,
    "smtpSecure" BOOLEAN NOT NULL DEFAULT false,
    "fromAddress" TEXT NOT NULL,
    "toAddresses" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_mac_key" ON "devices"("mac");

-- CreateIndex
CREATE UNIQUE INDEX "devices_ip_key" ON "devices"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "device_categories_name_key" ON "device_categories"("name");
