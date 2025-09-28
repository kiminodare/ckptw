'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { z } from 'zod/v3'
import { redirect } from 'next/navigation'

const schema = z.object({
    robloxUsername: z.string().min(3, 'Username is required'),
    newDiscordId: z.string().min(5, 'Discord ID is required'),
})

export async function updateDiscordId(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || !session.user) throw new Error('Unauthorized')

    const robloxUsername = formData.get('robloxUsername')
    const newDiscordId = formData.get('newDiscordId')

    const parsed = schema.safeParse({ robloxUsername, newDiscordId })
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0].message)
    }

    // Cari proof berdasarkan username
    const proof = await prisma.vipProof.findFirst({
        where: {
            username: {
                equals: parsed.data.robloxUsername,
                mode: 'insensitive',
            },
        },
    })

    if (!proof) {
        throw new Error('Roblox username not found')
    }

    // Update discordId
    await prisma.vipProof.update({
        where: { id: proof.id },
        data: {
            discordId: parsed.data.newDiscordId,
        },
    })

    // Redirect balik ke dashboard
    redirect('/public/dashboard')
}
