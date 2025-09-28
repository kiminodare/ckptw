import { use } from "react"
import Link from "next/link"
import { UserRoleEnum } from "@/app/generated/prisma"
import { getUsers } from "@/services/getListUser"
import UsersTable from "@/app/admin/_component/UsersTable"
import FilterBar from "@/app/admin/_component/FilterBar"

type SearchParams = {
    search?: string
    page?: string
    role?: string
}

export default function AdminUsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = use(searchParams)

    const pageParsed = Number(params.page) || 1
    const page = pageParsed > 0 ? pageParsed : 1
    const search = params.search ?? ""
    const roleParam = params.role ?? ""

    let role: UserRoleEnum | undefined
    if (roleParam === UserRoleEnum.OWNER) role = UserRoleEnum.OWNER
    else if (roleParam === UserRoleEnum.ADMIN) role = UserRoleEnum.ADMIN
    else if (roleParam === UserRoleEnum.USER) role = UserRoleEnum.USER

    const limit = 10
    const result = use(getUsers({ page, limit, search, role })) // ✅ tidak pakai async/await

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-10">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 w-full max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h1 className="text-2xl font-extrabold text-purple-600 tracking-tight">User Management</h1>

                    {/* ✅ Button redirect ke review-page */}
                    <Link
                        href="http://localhost:3000/admin/review-page"
                        className="px-5 py-2 rounded-lg font-semibold text-white shadow-md bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition text-center"
                    >
                        Go to Review Page
                    </Link>
                </div>

                {/* Filter bar */}
                <FilterBar search={search} role={role} />

                {result.data.length === 0 ? (
                    <div className="flex items-center justify-center py-24 text-2xl font-bold text-green-500">
                        No users found 🎉
                    </div>
                ) : (
                    <UsersTable
                        users={result.data}
                        page={result.pagination.page}
                        totalPages={result.pagination.totalPages}
                        search={search}
                        role={role}
                    />
                )}
            </div>
        </main>
    )
}
