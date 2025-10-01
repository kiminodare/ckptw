import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const log = await prisma.migrationLog.create({
    data: {
      username: body.username,
      userId: body.userId?.toString(),
      summit: body.summit,
      checkpoint: body.checkpoint,
      status: body.status,
      message: body.message ?? null,
    },
  });

  return NextResponse.json({ ok: true, log });
}
