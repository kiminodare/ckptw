import { createAuthClient } from "better-auth/react";
import {customSessionClient, jwtClient} from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";


export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    plugins: [
        jwtClient(),
        customSessionClient<typeof auth>()
    ],
});

export const { signIn, signOut, useSession, token } = authClient;
