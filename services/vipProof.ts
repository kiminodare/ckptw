'use server'

import prisma from "@/lib/prisma";
import { $Enums } from "@/app/generated/prisma";
import ProofStatus = $Enums.ProofStatus;
import exifr from "exifr";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getNextPendingProof() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }

    return prisma.vipProof.findFirst({
        where: {
            status: ProofStatus.PENDING,
            assignedAdmins: {
                some: {
                    adminId: session.user.id
                }
            }
        },
        orderBy: { createdAt: 'asc' }
    });
}

export async function reviewProof(proofId: string, status: ProofStatus) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }

    // Pastikan proof memang di-assign ke admin ini
    const proof = await prisma.vipProof.findUnique({
        where: { id: proofId },
        include: {
            assignedAdmins: {
                where: {
                    adminId: session.user.id
                }
            }
        }
    });

    if (!proof) {
        throw new Error('Proof not found');
    }

    if (proof.assignedAdmins.length === 0) {
        throw new Error('You are not assigned to this proof');
    }

    if (proof.status !== ProofStatus.PENDING) {
        throw new Error('Proof has already been reviewed');
    }

    return prisma.vipProof.update({
        where: { id: proofId },
        data: {
            status,
            reviewedById: session.user.id
        }
    });
}

export async function getImageMetadata(imageUrl: string) {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const metadata = await exifr.parse(buffer, true);
    console.log(metadata);
    return metadata;
}
