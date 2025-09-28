import Link from "next/link"

export default function ForbiddenPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-50 px-4">
            <div className="bg-white/80 backdrop-blur-xl border border-red-200 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <h1 className="text-6xl font-extrabold text-red-500 mb-4">403</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-6">
                    You don&#39;t have permission to access this page.<br />
                    Please contact an administrator if you believe this is an error.
                </p>

                <Link
                    href="/"
                    className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 inline-block"
                >
                    ⬅ Go Back Home
                </Link>
            </div>
        </main>
    )
}
