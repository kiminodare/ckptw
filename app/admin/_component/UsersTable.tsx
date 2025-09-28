'use client'

import { UserRoleEnum } from "@/app/generated/prisma"
import { updateUserRoleAction } from "@/services/updateUserRoleAction"

type UserItem = {
    id: string
    name: string | null
    email: string | null
    username: string | null
    roles: { role: { name: UserRoleEnum } | null }[]
}

export default function UsersTable({
                                       users,
                                       page,
                                       totalPages,
                                       search,
                                       role
                                   }: {
    users: UserItem[]
    page: number
    totalPages: number
    search: string
    role: UserRoleEnum | undefined
}) {
    return (
        <div className="space-y-6">
            <div className="overflow-x-auto rounded-2xl border border-white/40 bg-white/60 backdrop-blur">
                <table className="w-full min-w-[640px]">
                    <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <th className="p-3 sm:p-4 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="p-3 sm:p-4 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="p-3 sm:p-4 text-left text-sm font-semibold text-gray-700">Username Discord</th>
                        <th className="p-3 sm:p-4 text-left text-sm font-semibold text-gray-700">Role</th>
                        <th className="p-3 sm:p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => {
                        const currentRole = user.roles[0]?.role?.name ?? UserRoleEnum.USER
                        return (
                            <tr
                                key={user.id}
                                className="border-t border-gray-100/70 hover:bg-white/70 transition"
                            >
                                <td className="p-3 sm:p-4 text-gray-800">{user.name ?? '-'}</td>
                                <td className="p-3 sm:p-4 text-gray-800">{user.email ?? '-'}</td>
                                <td className="p-3 sm:p-4 text-gray-800">{user.username ?? '-'}</td>
                                <td className="p-3 sm:p-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1">
                      {currentRole}
                    </span>
                                </td>
                                <td className="p-3 sm:p-4">
                                    <RoleForm userId={user.id} defaultRole={currentRole} />
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <a
                    href={`?page=${page - 1}&search=${encodeURIComponent(search)}&role=${role ?? ''}`}
                    className={`px-5 py-2 rounded-lg border border-white/60 bg-white/70 backdrop-blur font-medium hover:scale-[1.02] active:scale-95 transition ${
                        page === 1 ? 'pointer-events-none opacity-50' : ''
                    }`}
                >
                    Previous
                </a>
                <div className="text-sm font-semibold text-gray-700">
                    Page {page} of {totalPages}
                </div>
                <a
                    href={`?page=${page + 1}&search=${encodeURIComponent(search)}&role=${role ?? ''}`}
                    className={`px-5 py-2 rounded-lg border border-white/60 bg-white/70 backdrop-blur font-medium hover:scale-[1.02] active:scale-95 transition ${
                        page === totalPages ? 'pointer-events-none opacity-50' : ''
                    }`}
                >
                    Next
                </a>
            </div>
        </div>
    )
}

function RoleForm({ userId, defaultRole }: { userId: string; defaultRole: UserRoleEnum }) {
    return (
        <form action={updateUserRoleAction} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <input type="hidden" name="userId" value={userId} />
            <select
                name="role"
                defaultValue={defaultRole}
                className="border border-gray-200 bg-white/70 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition w-full sm:w-auto"
            >
                <option value={UserRoleEnum.OWNER}>Owner</option>
                <option value={UserRoleEnum.ADMIN}>Admin</option>
                <option value={UserRoleEnum.USER}>User</option>
            </select>
            <button
                type="submit"
                className="px-4 py-2 rounded-lg font-semibold text-white shadow-md bg-gradient-to-r from-green-400 to-blue-500 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition w-full sm:w-auto"
            >
                Update
            </button>
        </form>
    )
}
