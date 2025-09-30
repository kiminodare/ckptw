import { betterAuth, type OAuth2Tokens } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import {customSession, jwt} from "better-auth/plugins";
import {ADMIN_USERNAMES} from "@/constants/admin";
import {User, UserRoleEnum} from "@/app/generated/prisma";

async function ensureDefaultRole(userId: string): Promise<UserRoleEnum[]> {
    const current = await prisma.userRoles.findMany({
        where: { userId },
        include: { role: true },
    });
    if (current.length > 0) {
        return current.map((ur) => ur.role.name as UserRoleEnum);
    }
    const userRole = await prisma.role.findUnique({ where: { name: UserRoleEnum.USER } });
    if (!userRole) {
        throw new Error("Missing USER role");
    }
    await prisma.userRoles.create({ data: { userId, roleId: userRole.id } });
    return [UserRoleEnum.USER];
}

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    user: {
        modelName: "user",
        fields: {
            id: "id",
            name: "name",
            email: "email",
            emailVerified: "emailVerified",
            image: "image",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },

        // Tambahkan username sebagai custom field
        additionalFields: {
            username: {
                type: "string",
                required: false,
                input: false, // Supaya user tidak bisa set manual lewat signup form
            },
        },
    },

    session: {
        modelName: "session",
        fields: {
            id: "id",
            userId: "userId",
            token: "token",
            expiresAt: "expiresAt",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
        data: {
            username: true,
        },
    },

    account: {
        modelName: "account",
        fields: {
            id: "id",
            userId: "userId",
            providerId: "providerId",
            accountId: "accountId",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
            idToken: "idToken",
            scope: "scope",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    },

    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            scope: ["identify", "email"],
            getUserInfo: async (token: OAuth2Tokens) => {
                if (!token.accessToken) throw new Error("Discord access token missing");

                const res = await fetch("https://discord.com/api/users/@me", {
                    headers: { Authorization: `Bearer ${token.accessToken}` },
                });

                const profile: {
                    id: string;
                    username: string;
                    global_name: string;
                    avatar: string | null;
                    email: string | null;
                    verified: boolean;
                } = await res.json();

                return {
                    user: {
                        id: profile.id,
                        name: profile.global_name,
                        username: profile.username, // sekarang akan tersimpan
                        email: profile.email ?? undefined,
                        image: profile.avatar
                            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                            : undefined,
                        emailVerified: profile.verified,
                    },
                    data: profile,
                };
            },
        },
    },

    events:{
        async afterUserCreated(user: User) {
            const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } })
            const userRole = await prisma.role.findUnique({ where: { name: "USER" } })
            if (!adminRole || !userRole) throw new Error("Role data missing in DB")

            const targetRoleId = ADMIN_USERNAMES.includes(user.username ?? "") ? adminRole.id : userRole.id

            await prisma.userRoles.create({
                data: {
                    userId: user.id,
                    roleId: targetRoleId,
                },
            })
        },
    },
    trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"],
    databaseHooks: {
        user: {
            create: {
                after: async (created) => {
                    await ensureDefaultRole(created.id);
                },
            },
        },
    },
    plugins: [
        jwt({
            jwt: {
                definePayload: ({ user }) => {
                    return {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    };
                },
            },
        }),
        customSession(async ({ user, session }) => {
            const userRoles = await prisma.userRoles.findMany({
                where: { userId: user.id },
                include: { role: true },
            })
            const username = await prisma.user.findFirst({
                where: { id: user.id },
                select: { username: true },
            })

            const roles = userRoles.map((ur) => ur.role.name)

            return {
                user: {
                    ...user,
                    username: username?.username,
                    roles,
                },
                session,
            }
        })
    ],

});
