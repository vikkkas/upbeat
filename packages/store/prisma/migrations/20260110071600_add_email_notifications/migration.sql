-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "lastNotificationSent" TIMESTAMP(3),
ADD COLUMN     "lastStatus" "WebsiteStatus" NOT NULL DEFAULT 'Unknown';
