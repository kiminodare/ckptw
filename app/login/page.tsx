"use client";

import { signIn, useSession,signOut } from "@/lib/auth-client";

export default function LoginPage() {
    const { data: session, isPending, error } = useSession();

    if (isPending) {
        return <p>Loading session...</p>;
    }

    if (error) {
        return <p>Something went wrong: {error.message}</p>;
    }

    if (!session) {
        return (
            <button onClick={() => signIn.social({ provider: "discord" })}>
                Login with Discord
            </button>
        );
    }

    return (
        <div>
            <p>Welcome {session.user.username}</p>
            <button onClick={() => signOut()}>Logout</button>
        </div>
    );
}
