'use server'

import { ProofStatus } from '@/app/generated/prisma'
import prisma from "@/lib/prisma";

export async function updateVipProof(input: {
    vipProofId: string
    discordId: string
    summitTotal: number
    status: ProofStatus
}) {
    return prisma.vipProof.update({
        where: { id: input.vipProofId },
        data: {
            discordId: input.discordId,
            summitTotal: input.summitTotal,
            status: input.status,
        },
    })
}
