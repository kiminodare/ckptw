'use server'

import prisma from "@/lib/prisma";
import { $Enums } from "@/app/generated/prisma";
import ProofStatus = $Enums.ProofStatus;
import exifr from "exifr";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Ambil proof berikutnya yang masih PENDING dan di-assign ke admin saat ini.
 * Jika ada appeal, include appeal terbaru untuk mengakses bukti baru dari user.
 */
export async function getNextPendingProof() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        throw new Error("Unauthorized");
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
        orderBy: { createdAt: "asc" },
        include: {
            appeals: {
                orderBy: { createdAt: "desc" },
                take: 1 // <- hanya ambil appeal terbaru
            }
        }
    });
}

/**
 * Admin melakukan review pada proof.
 * Pastikan admin yang login adalah yang di-assign ke proof ini,
 * dan proof masih PENDING (belum direview).
 */
export async function reviewProof(proofId: string, status: ProofStatus) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

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
        throw new Error("Proof not found");
    }

    if (proof.assignedAdmins.length === 0) {
        throw new Error("You are not assigned to this proof");
    }

    if (proof.status !== ProofStatus.PENDING) {
        throw new Error("Proof has already been reviewed");
    }

    return prisma.vipProof.update({
        where: { id: proofId },
        data: {
            status,
            reviewedById: session.user.id
        }
    });
}