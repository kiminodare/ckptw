import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod/v3';

const schema = z.object({
    username: z.string().min(3),
    discordId: z.string().min(3),
    isVip: z.enum(['Ya', 'Tidak']),
    jumlahSummit: z.coerce.number().int().min(0),
    proofFileVip: z.instanceof(Uint8Array),
    proofFileSummit: z.instanceof(Uint8Array),
    ipAddress: z.string().ip({ version: 'v6' })
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const username = formData.get('username');
        const discordId = formData.get('discordId');
        const isVip = formData.get('isVip');
        const jumlahSummit = formData.get('jumlahSummit');
        const fileVip = formData.get('proofVip');
        const fileSummit = formData.get('proofSummit');

        if (!(fileVip instanceof File) || !(fileSummit instanceof File)) {
            return NextResponse.json({ error: 'File tidak valid' }, { status: 400 });
        }

        const bufferVip = new Uint8Array(await fileVip.arrayBuffer());
        const bufferSummit = new Uint8Array(await fileSummit.arrayBuffer());

        const ipAddress =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            '0.0.0.0';

        const parsed = schema.safeParse({
            username,
            discordId,
            isVip,
            jumlahSummit,
            proofFileVip: bufferVip,
            proofFileSummit: bufferSummit,
            ipAddress
        });

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Data tidak valid', issues: parsed.error.issues },
                { status: 400 }
            );
        }

        const existing = await prisma.vipProof.findFirst({
            where: {
                OR: [
                    { username: parsed.data.username },
                    { discordId: parsed.data.discordId },
                    { ipAddress: parsed.data.ipAddress }
                ]
            }
        });

        if (existing) {
            let conflictField = '';
            if (existing.username === parsed.data.username) conflictField = 'Username Roblox';
            else if (existing.discordId === parsed.data.discordId) conflictField = 'Discord ID';
            else conflictField = 'IP Address';

            return NextResponse.json(
                { error: `${conflictField} sudah digunakan, tidak bisa mendaftar dua kali.` },
                { status: 400 }
            );
        }

        const saved = await prisma.vipProof.create({
            data: {
                username: parsed.data.username,
                discordId: parsed.data.discordId,
                isVip: parsed.data.isVip === 'Ya',
                proofFileVip: parsed.data.proofFileVip,
                proofFileSummit: parsed.data.proofFileSummit,
                summitTotal: parsed.data.jumlahSummit,
                ipAddress: parsed.data.ipAddress
            }
        });

        return NextResponse.json({ success: true, id: saved.id });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                error: 'Terjadi kesalahan saat menyimpan data.',
                details: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : null
            },
            { status: 500 }
        );
    }
}
