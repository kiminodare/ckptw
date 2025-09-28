"use client"

import { signIn, signOut, useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const { data: session, isPending, error } = useSession()
    const router = useRouter()

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
                <p className="text-lg font-medium text-indigo-700 animate-pulse">
                    Loading vibes...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100">
                <p className="text-red-600 font-semibold">
                    Uh-oh, something broke: {error.message}
                </p>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 tracking-tight">
                    Welcome Back 👋
                </h1>
                <p className="text-gray-600 mb-8 text-center max-w-sm">
                    Sign in to join the squad and unlock exclusive features.
                </p>
                <button
                    onClick={() => signIn.social({ provider: "discord" })}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white text-lg font-semibold shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    <span>Login with Discord</span>
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.444.864-.608 1.249a18.27 18.27 0 00-5.487 0 12.5 12.5 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.68 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057c2.052 1.5 4.03 2.422 5.978 3.032a.077.077 0 00.084-.027c.461-.63.873-1.295 1.226-1.993a.076.076 0 00-.041-.105c-.652-.247-1.273-.547-1.872-.892a.076.076 0 01-.008-.127c.125-.093.25-.19.37-.287a.074.074 0 01.077-.01c3.928 1.805 8.18 1.805 12.062 0a.073.073 0 01.078.01c.12.097.245.194.37.287a.076.076 0 01-.007.127c-.6.345-1.22.645-1.873.892a.076.076 0 00-.04.106c.36.697.772 1.362 1.225 1.992a.077.077 0 00.084.028c1.949-.61 3.927-1.532 5.978-3.032a.077.077 0 00.031-.056c.5-5.177-.838-9.676-3.548-13.662a.061.061 0 00-.031-.03z" />
                    </svg>
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
            <h1 className="text-3xl font-bold text-green-700 mb-4">
                Hey {session.user.username} 👑
            </h1>
            <p className="text-gray-600 mb-8">
                You&#39;re logged in and ready to roll.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => router.push("/admin")}
                    className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    Go to Admin
                </button>
                <button
                    onClick={() => router.push("/public/dashboard")}
                    className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                >
                    Go to Dashboard
                </button>
                <button
                    onClick={() => signOut()}
                    className="px-6 py-3 rounded-full bg-gray-800 text-white font-medium shadow-md hover:bg-gray-900 active:scale-95 transition-all"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
