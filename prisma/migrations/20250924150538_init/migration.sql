/*
  Warnings:

  - You are about to drop the column `discordId` on the `VipProof` table. All the data in the column will be lost.
  - You are about to drop the column `isVip` on the `VipProof` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ip_address]` on the table `VipProof` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discord_id` to the `VipProof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip_address` to the `VipProof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_vip` to the `VipProof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summit_total` to the `VipProof` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."VipProof" DROP COLUMN "discordId",
DROP COLUMN "isVip",
ADD COLUMN     "discord_id" TEXT NOT NULL,
ADD COLUMN     "ip_address" TEXT NOT NULL,
ADD COLUMN     "is_vip" BOOLEAN NOT NULL,
ADD COLUMN     "summit_total" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VipProof_ip_address_key" ON "public"."VipProof"("ip_address");
