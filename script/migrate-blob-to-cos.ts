import { cos, BUCKET, REGION } from '@/lib/cos';
import prisma from "@/lib/prisma";

async function uploadToCOS(file: Uint8Array | Buffer, key: string): Promise<string> {
    const body = Buffer.isBuffer(file) ? file : Buffer.from(file);

    await cos.putObject({
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        Body: body,
    });

    return `https://${BUCKET}.cos.${REGION}.myqcloud.com/${key}`;
}

async function migrateOnce(batchSize = 100): Promise<number> {
    // Ambil data yang URL-nya masih kosong
    const oldData = await prisma.vipProof.findMany({
        where: {
            OR: [
                { proofURLSummit: null },
                { proofURLVip: null },
            ],
        },
        take: batchSize,
    });

    if (oldData.length === 0) {
        console.log('No more records to migrate.');
        return 0;
    }

    console.log(`Migrating ${oldData.length} records...`);

    for (const item of oldData) {
        // Kalau summit kosong → log aja, skip record ini
        if (!item.proofFileSummit) {
            console.log(`⚠️ Skipping ID ${item.id}: proofFileSummit is NULL`);
            continue;
        }

        // Upload summit proof
        const summitKey = `proofs/summit/${item.id}-${Date.now()}.png`;
        const summitUrl = await uploadToCOS(item.proofFileSummit, summitKey);

        // Upload VIP proof kalau ada
        let vipUrl: string | null = null;
        if (item.proofFileVip) {
            const vipKey = `proofs/vip/${item.id}-${Date.now()}.png`;
            vipUrl = await uploadToCOS(item.proofFileVip, vipKey);
        }

        // Update record:
        // 1. Simpan URL baru
        // 2. Kosongkan kolom BLOB supaya database jadi ringan
        await prisma.vipProof.update({
            where: { id: item.id },
            data: {
                proofURLSummit: summitUrl,
                proofURLVip: vipUrl,
                proofFileSummit: null,
                proofFileVip: null,
            },
        });

        console.log(`✅ Migrated ID: ${item.id}`);
    }

    return oldData.length;
}

async function migrateLoop() {
    let migrated = 0;
    let batch = 0;

    while (true) {
        console.log(`\n--- Batch #${++batch} ---`);
        const count = await migrateOnce(100); // proses per 100 data
        if (count === 0) break;
        migrated += count;
    }

    console.log(`\n🎉 Migration complete! Total migrated: ${migrated}`);
}

migrateLoop()
    .catch((err) => console.error('❌ Error during migration:', err))
    .finally(() => prisma.$disconnect());
