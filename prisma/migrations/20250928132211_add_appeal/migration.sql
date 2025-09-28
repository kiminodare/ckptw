/*
  Warnings:

  - You are about to drop the column `proof_file_summit` on the `VipProof` table. All the data in the column will be lost.
  - You are about to drop the column `proof_file_vip` on the `VipProof` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."VipProof" DROP COLUMN "proof_file_summit",
DROP COLUMN "proof_file_vip";

-- CreateTable
CREATE TABLE "public"."vip_proof_appeals" (
    "id" TEXT NOT NULL,
    "vipProofId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "new_proof_vip_url" TEXT,
    "new_proof_summit_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vip_proof_appeals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."vip_proof_appeals" ADD CONSTRAINT "vip_proof_appeals_vipProofId_fkey" FOREIGN KEY ("vipProofId") REFERENCES "public"."VipProof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vip_proof_appeals" ADD CONSTRAINT "vip_proof_appeals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
