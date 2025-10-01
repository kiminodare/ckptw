import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit");
  const username = searchParams.get("username");

  if (username) {
    const user = await prisma.vipProof.findFirst({
      where: { username },
      select: { username: true, summitTotal: true },
    });
    if (user) {
      return NextResponse.json([
        { username: user.username, summit: user.summitTotal },
      ]);
    }
    return NextResponse.json([]);
  }

  const take = limit ? parseInt(limit, 10) : undefined;
  const users = await prisma.vipProof.findMany({
    take,
    select: { username: true, summitTotal: true },
  });

  return NextResponse.json(
    users.map((u) => ({ username: u.username, summit: u.summitTotal })),
  );
}
