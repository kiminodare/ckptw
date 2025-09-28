'use server'

import prisma from '@/lib/prisma'

export async function findVipProofByUsername(username: string) {
    return prisma.vipProof.findFirst({
        where: {
            username: {
                equals: username,
                mode: 'insensitive', // biar nggak case sensitive
            },
        },
        select: {
            id: true,
            username: true,
            discordId: true,
            summitTotal: true,
            isVip: true,
            status: true,
            createdAt: true,
        },
    })
}
