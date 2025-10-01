import { NextRequest, NextResponse } from "next/server";

type MigrationCommand =
  | { type: "limit"; value: number }
  | { type: "user"; username: string }
  | { type: "all" };

let pendingCommand: MigrationCommand | null = null;

export async function POST(req: NextRequest) {
  const body = await req.json();
  pendingCommand = body;
  return NextResponse.json({ ok: true, command: body });
}

export async function GET() {
  const cmd = pendingCommand;
  pendingCommand = null; // sekali pakai
  return NextResponse.json(cmd || {});
}
