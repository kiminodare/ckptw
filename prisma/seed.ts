import prisma from '@/lib/prisma';

async function main(): Promise<void> {
    const roles = ['OWNER', 'ADMIN', 'USER'] as const;

    await Promise.all(
        roles.map(role =>
            prisma.role.upsert({
                where: { name: role },
                update: {},
                create: { name: role },
            })
        )
    );

    const ownerRole = await prisma.role.findUnique({
        where: { name: 'OWNER' },
    });

    if (!ownerRole) {
        throw new Error('OWNER role was not created successfully.');
    }

    const targetUsername = 'kiminodare';

    const user = await prisma.user.findFirst({
        where: { username: targetUsername },
    });

    if (!user) {
        throw new Error(`User with username "${targetUsername}" not found. Seed halted.`);
    }

    const existingUserRole = await prisma.userRoles.findUnique({
        where: {
            userId_roleId: {
                userId: user.id,
                roleId: ownerRole.id,
            },
        },
    });

    if (!existingUserRole) {
        await prisma.userRoles.create({
            data: {
                userId: user.id,
                roleId: ownerRole.id,
            },
        });
        console.log(`User "${targetUsername}" has been assigned as OWNER!`);
    } else {
        console.log(`User "${targetUsername}" is already an OWNER.`);
    }
}

main()
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
