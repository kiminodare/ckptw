
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
        take: 100,
    });

    console.log(`Migrating ${oldData.length} records...`);

    for (const item of oldData) {
        const summitKey = `proofs/summit/${item.id}-${Date.now()}.png`;
        const summitUrl = await uploadToCOS(item.proofFileSummit as Buffer, summitKey);

        let vipUrl: string | null = null;
        if (item.proofFileVip) {
            const vipKey = `proofs/vip/${item.id}-${Date.now()}.png`;
            vipUrl = await uploadToCOS(item.proofFileVip as Buffer, vipKey);
        }

        await prisma.vipProof.update({
            where: { id: item.id },
            data: {
                proofURLSummit: summitUrl,
                proofURLVip: vipUrl,
            },
        });

        console.log(`Migrated ID: ${item.id}`);
    }
}

migrateBatch()
    .then(() => console.log('Batch migration complete'))
    .catch((err) => console.error('Error migrating batch:', err))
    .finally(() => prisma.$disconnect());
