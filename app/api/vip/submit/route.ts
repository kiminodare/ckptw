import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
    username: z.string().min(3),
    discordId: z.string().min(3),
    isVip: z.enum(['Ya', 'Tidak']),
    proofFileVip: z.instanceof(Uint8Array),
    proofFileSummit: z.instanceof(Uint8Array),
});

export async function POST(req: Request) {
    const formData = await req.formData();

    const username = formData.get('username');
    const discordId = formData.get('discordId');
    const isVip = formData.get('isVip');
    const fileVip = formData.get('proofVip');
    const fileSummit = formData.get('proofSummit');

    if (!(fileVip instanceof File) || !(fileSummit instanceof File)) {
        return NextResponse.json({ error: 'File tidak valid' }, { status: 400 });
    }

    const bufferVip = new Uint8Array(await fileVip.arrayBuffer());
    const bufferSummit = new Uint8Array(await fileSummit.arrayBuffer());

    const parsed = schema.safeParse({
        username,
        discordId,
        isVip,
        proofFileVip: bufferVip,
        proofFileSummit: bufferSummit,
    });

    if (!parsed.success) {
        return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const saved = await prisma.vipProof.create({
        data: {
            username: parsed.data.username,
            discordId: parsed.data.discordId,
            isVip: parsed.data.isVip === 'Ya',
            proofFileVip: parsed.data.proofFileVip,
            proofFileSummit: parsed.data.proofFileSummit,
        },
    });

    return NextResponse.json({ success: true, id: saved.id });
}
