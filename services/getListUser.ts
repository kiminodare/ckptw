import {$Enums, Prisma, PrismaClient} from "@/app/generated/prisma";
import UserRoleEnum = $Enums.UserRoleEnum;


const prisma = new PrismaClient();

export type GetUsersParams = {
    page: number;
    limit: number;
    search?: string;
    role?: UserRoleEnum;
};

export const getUsers = async ({ page, limit, search, role }: GetUsersParams) => {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
        AND: [
            search
                ? {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive
                            }
                        },
                        {
                            username: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive
                            }
                        },
                        {
                            email: {
                                contains: search,
                                mode: Prisma.QueryMode.insensitive
                            }
                        }
                    ]
                }
                : undefined,
            role
                ? {
                    roles: {
                        some: {
                            role: {
                                name: role
                            }
                        }
                    }
                }
                : undefined
        ].filter(Boolean) as Prisma.UserWhereInput[]
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        }),
        prisma.user.count({ where })
    ]);

    return {
        data: users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
