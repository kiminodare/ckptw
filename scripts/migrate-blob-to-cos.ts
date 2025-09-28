import { cos, BUCKET, REGION } from '@/lib/cos';
import prisma from '@/lib/prisma';

function toBuffer(file: Uint8Array | Buffer): Buffer {
    return Buffer.isBuffer(file) ? file : Buffer.from(file);
}

async function uploadToCOS(file: Uint8Array | Buffer, key: string): Promise<string> {
    await cos.putObject({
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        Body: toBuffer(file),
    });
    return `https://${BUCKET}.cos.${REGION}.myqcloud.com/${key}`;
}

async function migrateBatch(batchSize = 100): Promise<number> {
    const items = await prisma.vipProof.findMany({
        where: {
            OR: [
                { proofFileSummit: { not: null } },
                { proofFileVip: { not: null } },
            ],
        },
        take: batchSize,
        orderBy: { id: 'asc' },
    });

    if (items.length === 0) return 0;

    for (const item of items) {
        let summitUrl: string | null = item.proofURLSummit ?? null;
        let vipUrl: string | null = item.proofURLVip ?? null;

        if (item.proofFileSummit && !summitUrl) {
            const summitKey = `proofs/summit/${item.id}-${Date.now()}.png`;
            summitUrl = await uploadToCOS(item.proofFileSummit, summitKey);
        }

        if (item.proofFileVip && !vipUrl) {
            const vipKey = `proofs/vip/${item.id}-${Date.now()}.png`;
            vipUrl = await uploadToCOS(item.proofFileVip, vipKey);
        }

        await prisma.vipProof.update({
            where: { id: item.id },
            data: {
                proofURLSummit: summitUrl,
                proofURLVip: vipUrl,
                proofFileSummit: null,
                proofFileVip: null,
            },
        });
    }

    return items.length;
}

async function main(): Promise<void> {
    let processed = 0;
    while (true) {
        const n = await migrateBatch(100);
        if (n === 0) break;
        processed += n;
    }
    console.log(`Migration done. Processed ${processed} records.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
