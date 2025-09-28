"use server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";

export interface GetVipProofsParams {
    page?: number;
    limit?: number;
    search?: string;
}

export async function getVipProofs(params: GetVipProofsParams) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 10;
    const search = params.search?.trim() || "";

    const skip = (page - 1) * limit;

    const where: Prisma.VipProofWhereInput = search
        ? {
            OR: [
                {
                    username: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                    },
                },
                {
                    discordId: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                    },
                },
            ],
        }
        : {};

    const [data, total] = await Promise.all([
        prisma.vipProof.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                assignedAdmins: {
                    include: {
                        admin: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                roles: {
                                    include: { role: true },
                                },
                            },
                        },
                    },
                },
            },
        }),
        prisma.vipProof.count({ where }),
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}
