import { NextResponse } from "next/server";
import { getVipProofs } from "@/services/vipProofActions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || undefined;

    const result = await getVipProofs({ page, limit, search });
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    return new NextResponse(error instanceof Error ? error.message : "Failed to fetch proofs", { status: 500 });
  }
}



