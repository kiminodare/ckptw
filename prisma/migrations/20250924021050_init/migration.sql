-- CreateTable
CREATE TABLE "public"."VipProof" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "isVip" BOOLEAN NOT NULL,
    "proof_file_vip" BYTEA NOT NULL,
    "proof_file_summit" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VipProof_pkey" PRIMARY KEY ("id")
);
