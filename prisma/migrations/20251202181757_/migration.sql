/*
  Warnings:

  - You are about to drop the column `latitude` on the `institutions` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `institutions` table. All the data in the column will be lost.
  - Added the required column `location` to the `institutions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- AlterTable
ALTER TABLE "institutions" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "location" geometry(Point, 4326) NOT NULL;
