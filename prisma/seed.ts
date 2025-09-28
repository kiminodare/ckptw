// prisma/seed.ts
import { PrismaClient, UserRoleEnum } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function upsertRole(name: UserRoleEnum): Promise<void> {
    await prisma.role.upsert({
        where: { name },
        update: {},
        create: { name },
    });
}

async function main(): Promise<void> {
    await upsertRole(UserRoleEnum.OWNER);
    await upsertRole(UserRoleEnum.ADMIN);
    await upsertRole(UserRoleEnum.USER);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async () => {
        await prisma.$disconnect();
        process.exit(1);
    });
