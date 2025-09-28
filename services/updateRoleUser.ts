import {PrismaClient, UserRoleEnum} from "@/app/generated/prisma";

const prisma = new PrismaClient();

export type UpdateUserRoleInput = {
    userId: string;
    role: UserRoleEnum;
};

export const updateUserRole = async ({userId, role}: UpdateUserRoleInput) => {
    return prisma.$transaction(async (tx) => {
        // 1. Hapus role lama user
        await tx.userRoles.deleteMany({
            where: {userId}
        });

        // 2. Cari roleId berdasarkan enum name
        const roleRecord = await tx.role.findUnique({
            where: {
                name: role
            }
        });

        if (!roleRecord) {
            throw new Error(`Role ${role} tidak ditemukan`);
        }

        // 3. Assign role baru
        await tx.userRoles.create({
            data: {
                userId,
                roleId: roleRecord.id
            }
        });

        // 4. Return user dengan role barunya
        return tx.user.findUnique({
            where: {id: userId},
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });
    });
};