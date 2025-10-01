-- CreateTable
CREATE TABLE "public"."MigrationLog" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "userId" TEXT,
    "summit" INTEGER NOT NULL,
    "checkpoint" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MigrationLog_pkey" PRIMARY KEY ("id")
);
