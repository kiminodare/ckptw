import Link from "next/link"
import { getVipProofs } from "@/services/vipProofActions"
import { VipProof as VipProofModel } from "@/app/generated/prisma"
import { AppealModal } from "@/components/AppealModal"
import { DiscordMismatchModal } from "@/components/DiscordMismatchModal"
import { EditButton } from "@/components/buttons/EditButton"

type VipProof = VipProofModel & {
    assignedAdmins: {
        admin: {
            id: string
            name: string
            email: string
            roles: {
                role: {
                    name: string
                }
            }[]
        }
    }[]
}

interface DashboardProps {
    searchParams: Promise<{
        page?: string
        search?: string
        mismatch?: string
        username?: string
    }>
}

export default async function VipProofDashboard({ searchParams }: DashboardProps) {
    const params = await searchParams
    const page = params.page ? parseInt(params.page, 10) : 1
    const search = params.search || ""
    const showMismatchModal = params.mismatch === "1"

    const { data, pagination } = await getVipProofs({ page, limit: 10, search })

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-indigo-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <div className="mb-4">
                    <Link
                        href="/admin"
                        className="inline-block px-5 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-all shadow-sm"
                    >
                        ⬅ Back to Admin
                    </Link>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-700 mb-6 sm:mb-8 text-center tracking-tight">
                    VIP Proof Dashboard
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <form className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                        <input
                            name="search"
                            defaultValue={search}
                            placeholder="Search by username or Discord ID"
                            className="px-4 py-2 w-full sm:w-72 rounded-full border border-indigo-200 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                        />
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-md"
                        >
                            Search
                        </button>
                    </form>

                    <Link
                        href={`?mismatch=1&page=${page}&search=${search}`}
                        className="px-5 py-2 rounded-full text-center bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-md"
                    >
                        Discord ID Mismatch
                    </Link>
                </div>

                <div className="overflow-x-auto shadow-lg rounded-xl backdrop-blur-md bg-white/60">
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr className="bg-indigo-100 text-indigo-800">
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold">Username</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold">Discord ID</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold">VIP</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold">Summit Total</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold">Assigned To</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold">Status</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold">Actions</th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold">Edit</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((proof: VipProof, idx: number) => (
                            <tr
                                key={proof.id}
                                className={`transition-all hover:bg-indigo-50 ${
                                    idx % 2 === 0 ? "bg-white/70" : "bg-indigo-50/30"
                                }`}
                            >
                                <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-800 font-medium">
                                    {proof.username}
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600">{proof.discordId}</td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                                                proof.isVip
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {proof.isVip ? "Yes" : "No"}
                                        </span>
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-800">{proof.summitTotal}</td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                    {proof.assignedAdmins.length > 0 ? (
                                        <div className="space-y-1">
                                            {proof.assignedAdmins.map(({ admin }) => (
                                                <div key={admin.id} className="text-xs sm:text-sm">
                                                    <span className="font-medium">{admin.name}</span>
                                                    <span className="ml-1 text-gray-500 text-[10px] sm:text-xs">
                                                            ({admin.roles.map(r => r.role.name).join(", ")})
                                                        </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                                                proof.status === "APPROVED"
                                                    ? "bg-green-100 text-green-700"
                                                    : proof.status === "REJECTED"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {proof.status}
                                        </span>
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                    {proof.status === "REJECTED" ? (
                                        <AppealModal proof={proof} />
                                    ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                    )}
                                </td>
                                <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                                    <EditButton proof={proof} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-8">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <a
                            key={i + 1}
                            href={`?page=${i + 1}&search=${search}`}
                            className={`px-3 sm:px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                                pagination.page === i + 1
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100"
                            }`}
                        >
                            {i + 1}
                        </a>
                    ))}
                </div>
            </div>

            {showMismatchModal && (
                <DiscordMismatchModal
                    closeHref={`?page=${page}&search=${search}`}
                    searchParams={{ username: params.username }}
                />
            )}
        </div>
    )
}
