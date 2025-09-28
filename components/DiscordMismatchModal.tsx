import Link from "next/link"
import { findVipProofByUsername } from "@/services/findVipProofByUsername"
import { updateDiscordId } from "@/services/updateDiscordId"

interface DiscordMismatchModalProps {
    closeHref: string
    searchParams?: {
        username?: string
    }
}

export async function DiscordMismatchModal({
                                               closeHref,
                                               searchParams = {},
                                           }: DiscordMismatchModalProps) {
    const searchUsername = searchParams.username || ""
    const proof = searchUsername ? await findVipProofByUsername(searchUsername) : null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-indigo-700">
                    Fix Discord ID Mismatch
                </h2>

                {/* Step 1: Cari username */}
                {!proof && (
                    <form method="GET" action="" className="flex flex-col gap-4">
                        <input type="hidden" name="mismatch" value="1" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter Roblox username"
                            required
                            className="border p-2 rounded-lg text-sm"
                        />
                        <div className="flex justify-end gap-2 mt-3">
                            <Link
                                href={closeHref}
                                className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                            >
                                Find
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: Kalau ketemu, tampilkan detail + form update */}
                {proof && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 border rounded-lg p-3 text-sm">
                            <p><strong>Username:</strong> {proof.username}</p>
                            <p><strong>Current Discord ID:</strong> {proof.discordId}</p>
                            <p><strong>Status:</strong> {proof.status}</p>
                            <p><strong>Summit Total:</strong> {proof.summitTotal}</p>
                            <p><strong>VIP:</strong> {proof.isVip ? "Yes" : "No"}</p>
                            <p>
                                <strong>Created At:</strong>{" "}
                                {proof.createdAt ? new Date(proof.createdAt).toLocaleString() : "-"}
                            </p>
                        </div>

                        <form action={updateDiscordId} className="flex flex-col gap-4">
                            <input type="hidden" name="vipProofId" value={proof.id}/>
                            <input
                                type="hidden"
                                name="robloxUsername"
                                value={proof.username}
                            />

                            <input
                                type="text"
                                name="newDiscordId"
                                placeholder="Enter new Discord ID"
                                required
                                className="border p-2 rounded-lg text-sm"
                            />

                            <div className="flex justify-end gap-2 mt-3">
                                <Link
                                    href={closeHref}
                                    className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
