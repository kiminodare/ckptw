-- AlterTable
ALTER TABLE "public"."VipProof" ADD COLUMN     "proof_url_summit" TEXT,
ADD COLUMN     "proof_url_vip" TEXT,
ALTER COLUMN "proof_file_summit" DROP NOT NULL;
