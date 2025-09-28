'use client'

import { UserRoleEnum } from "@/app/generated/prisma"

export default function FilterBar({ search, role }: { search: string; role: UserRoleEnum | undefined }) {
    return (
        <form className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
            <input
                type="text"
                name="search"
                placeholder="Search user..."
                defaultValue={search}
                className="border border-gray-200 bg-white/70 rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
            <select
                name="role"
                defaultValue={role ?? ''}
                className="border border-gray-200 bg-white/70 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            >
                <option value="">All Roles</option>
                <option value={UserRoleEnum.OWNER}>Owner</option>
                <option value={UserRoleEnum.ADMIN}>Admin</option>
                <option value={UserRoleEnum.USER}>User</option>
            </select>
            <button
                type="submit"
                className="px-5 py-2 rounded-lg font-semibold text-white shadow-md bg-gradient-to-r from-pink-400 to-purple-500 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition"
            >
                Filter
            </button>
        </form>
    )
}
