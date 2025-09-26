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

async function migrateBatch() {
    const oldData = await prisma.vipProof.findMany({
        where: {
            OR: [
                { proofURLVip: null },
                { proofURLSummit: null },
            ],
        },
        take: 100, // migrasi batch biar aman
    });

    console.log(`Migrating ${oldData.length} records...`);

    for (const item of oldData) {
        if (!item.proofFileSummit) {
            console.log(`Skipping ID ${item.id}: proofFileSummit is null`);
            continue;
        }

        // Upload Summit ke COS
        const summitKey = `proofs/summit/${item.id}-${Date.now()}.png`;
        const summitUrl = await uploadToCOS(item.proofFileSummit, summitKey);

        // Upload VIP ke COS jika ada
        let vipUrl: string | null = null;
        if (item.proofFileVip) {
            const vipKey = `proofs/vip/${item.id}-${Date.now()}.png`;
            vipUrl = await uploadToCOS(item.proofFileVip, vipKey);
        }

        // Update record:
        // 1. Isi URL baru
        // 2. Kosongkan BLOB lama supaya database jadi ringan
        await prisma.vipProof.update({
            where: { id: item.id },
            data: {
                proofURLSummit: summitUrl,
                proofURLVip: vipUrl,
                proofFileSummit: null,
                proofFileVip: null,
            },
        });

        console.log(`Migrated ID: ${item.id}`);
    }
}

migrateBatch()
    .then(() => console.log('Batch migration complete'))
    .catch((err) => console.error('Error migrating batch:', err))
    .finally(() => prisma.$disconnect());
