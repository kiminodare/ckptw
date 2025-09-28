'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { z } from 'zod/v3'
import { cos, BUCKET, REGION } from '@/lib/cos'
import { ProofStatus } from '@/app/generated/prisma'

const schema = z.object({
    vipProofId: z.string().min(1),
    reason: z.string().min(10),
    newProofVip: z.instanceof(Uint8Array).optional(),
    newProofSummit: z.instanceof(Uint8Array).optional(),
})

async function uploadToCOS(fileBuffer: Uint8Array, key: string): Promise<string> {
    await cos.putObject({
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        Body: Buffer.from(fileBuffer),
    })
    return `https://${BUCKET}.cos.${REGION}.myqcloud.com/${key}`
}

export async function submitAppeal(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || !session.user) {
        throw new Error('Unauthorized')
    }

    const vipProofId = formData.get('vipProofId')
    const reason = formData.get('reason')
    const fileVip = formData.get('newProofVip')
    const fileSummit = formData.get('newProofSummit')

    const bufferVip =
        fileVip instanceof File && fileVip.size > 0
            ? new Uint8Array(await fileVip.arrayBuffer())
            : undefined;

    const bufferSummit =
        fileSummit instanceof File && fileSummit.size > 0
            ? new Uint8Array(await fileSummit.arrayBuffer())
            : undefined;

    const parsed = schema.safeParse({
        vipProofId,
        reason,
        newProofVip: bufferVip,
        newProofSummit: bufferSummit,
    })

    if (!parsed.success) {
        throw new Error('Invalid data: ' + JSON.stringify(parsed.error.issues))
    }

    const proof = await prisma.vipProof.findUnique({
        where: { id: parsed.data.vipProofId },
    })

    if (!proof) {
        throw new Error('Proof not found')
    }

    if (proof.discordId !== session.user.username) {
        throw new Error('You cannot appeal someone else\'s proof')
    }

    if (proof.status !== ProofStatus.REJECTED) {
        throw new Error('Only rejected proofs can be appealed')
    }

    let newVipUrl: string | undefined
    let newSummitUrl: string | undefined

    if (parsed.data.newProofVip && parsed.data.newProofVip.length > 0) {
        const vipKey = `appeals/vip/${Date.now()}-${proof.username}.png`;
        newVipUrl = await uploadToCOS(parsed.data.newProofVip, vipKey);
    }

    if (parsed.data.newProofSummit && parsed.data.newProofSummit.length > 0) {
        const summitKey = `appeals/summit/${Date.now()}-${proof.username}.png`;
        newSummitUrl = await uploadToCOS(parsed.data.newProofSummit, summitKey);
    }

    return prisma.$transaction([
        // Update VipProof status + update URL hanya kalau ada file baru
        prisma.vipProof.update({
            where: { id: proof.id },
            data: {
                status: ProofStatus.PENDING,
                proofURLVip: newVipUrl ?? proof.proofURLVip,
                proofURLSummit: newSummitUrl ?? proof.proofURLSummit,
            },
        }),

        // Tetap buat record appeal tapi URL bisa null kalau file kosong
        prisma.vipProofAppeal.create({
            data: {
                vipProofId: proof.id,
                userId: session.user.id,
                reason: parsed.data.reason,
                newProofVipURL: newVipUrl || null,
                newProofSummitURL: newSummitUrl || null,
            },
        }),
    ])
}
