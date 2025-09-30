import { PrismaClient, ProofStatus } from "@/app/generated/prisma";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

async function main() {
  // cari user admin (kamu)
  const me = await prisma.user.findFirst({
    where: { username: "kiminodare" },
  });

  if (!me) {
    throw new Error("User 'kiminodare' tidak ditemukan di table User");
  }

  const workbook = XLSX.readFile("data/Summit_dengan_ID_FULL.xlsx");
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: {
    Username: string;
    "jumlah summit": number | string;
    VIP: string;
    "id roblox": string | number;
  }[] = XLSX.utils.sheet_to_json(sheet);

  // tracking biar ga duplicate dari XLSX
  const seenUsernames = new Set<string>();

  for (const row of rows) {
    const username = (row["Username"] ?? "").toString().trim();

    // skip kalau duplicate di Excel
    if (seenUsernames.has(username)) continue;
    seenUsernames.add(username);

    // skip kalau sudah ada di database
    const exists = await prisma.vipProof.findFirst({
      where: { username },
    });
    if (exists) continue;

    const summitTotal = Number(row["jumlah summit"] ?? 0) || 0;
    const isVip = (row["VIP"] ?? "").toString().toLowerCase() === "yes";
    const robloxId = String(row["id roblox"] ?? "");
    const ipAddress = `roblox-${robloxId}`;

    // insert baru
    const proof = await prisma.vipProof.create({
      data: {
        username,
        discordId: robloxId,
        isVip,
        summitTotal,
        ipAddress,
        status: ProofStatus.APPROVED, // langsung approved
      },
    });

    // assign ke kamu
    await prisma.vipProofAssignment.create({
      data: {
        vipProofId: proof.id,
        adminId: me.id,
      },
    });
  }
}

main()
  .then(() => console.log("Migrasi selesai (insert-only, no duplicate) 🚀"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
