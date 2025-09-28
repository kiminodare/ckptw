import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await prisma.vipProof.update({
      where: { id: params.id },
      data: {
        username: body.username,
        discordId: body.discordId,
        summitTotal: Number(body.summitTotal),
        status: body.status,
        proofURLVip: body.proofURLVip ?? null,
        proofURLSummit: body.proofURLSummit ?? null,
        isVip: Boolean(body.isVip),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: unknown) {
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to fetch proofs",
      { status: 500 }
    );
  }
}
