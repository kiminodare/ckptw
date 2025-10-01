import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const migrated = await prisma.migrationLog.count({
    where: { status: "migrated" },
  });
  const failed = await prisma.migrationLog.count({
    where: { status: "failed" },
  });
  const skipped = await prisma.migrationLog.count({
    where: { status: "skipped" },
  });

  return NextResponse.json({ migrated, failed, skipped });
}
