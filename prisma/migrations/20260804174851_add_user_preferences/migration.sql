-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "orderNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'light',
ADD COLUMN     "timeZone" TEXT NOT NULL DEFAULT 'Europe/Istanbul',
ADD COLUMN     "weeklyReports" BOOLEAN NOT NULL DEFAULT false;
