import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE = "https://roblox.aldera.space/api/migration";
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN!;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const chatId = body.message?.chat?.id;
  const text = body.message?.text || "";

  if (!chatId || !text) {
    return NextResponse.json({ ok: true });
  }

  // /migrate 10
  if (/^\/migrate\s+\d+$/.test(text)) {
    const num = parseInt(text.split(" ")[1], 10);
    await axios.post(`${API_BASE}/command`, { type: "limit", value: num });
    await sendTelegram(
      chatId,
      `🚀 Request migrasi ${num} user dikirim ke server`,
    );
  }

  // /migrate all
  else if (text.startsWith("/migrate all")) {
    await axios.post(`${API_BASE}/command`, { type: "all" });
    await sendTelegram(chatId, `🚀 Request migrasi semua user dikirim`);
  }

  // /migrate PlayerOne
  else if (text.startsWith("/migrate ")) {
    const username = text.replace("/migrate ", "").trim();
    await axios.post(`${API_BASE}/command`, { type: "user", username });
    await sendTelegram(chatId, `🚀 Request migrasi user ${username} dikirim`);
  }

  // /status
  else if (text.startsWith("/status")) {
    const res = await axios.get(`${API_BASE}/status`);
    const { migrated, skipped, failed } = res.data;
    await sendTelegram(
      chatId,
      `📊 Status Migrasi\n✅ Migrated: ${migrated}\n⚠️ Skipped: ${skipped}\n❌ Failed: ${failed}`,
    );
  }

  return NextResponse.json({ ok: true });
}

async function sendTelegram(chatId: number, text: string) {
  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: chatId,
      text,
    },
  );
}
