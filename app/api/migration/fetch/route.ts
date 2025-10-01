import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Resolver ke Roblox API (username → userId)
async function resolveUserId(username: string): Promise<string | null> {
  try {
    const res = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] }),
    });
    const data = await res.json();
    if (data && data.data && data.data.length > 0) {
      return data.data[0].id.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const limit = searchParams.get("limit");

  if (username) {
    const user = await prisma.vipProof.findFirst({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = await resolveUserId(user.username);

    return NextResponse.json({
      userId,
      username: user.username,
      summit: user.summitTotal,
      checkpoint: 0,
    });
  }

  if (limit) {
    const users = await prisma.vipProof.findMany({
      take: parseInt(limit, 10),
      orderBy: { createdAt: "asc" },
    });

    const result = [];
    for (const u of users) {
      const userId = await resolveUserId(u.username);
      result.push({
        userId,
        username: u.username,
        summit: u.summitTotal,
        checkpoint: 0,
      });
    }

    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
