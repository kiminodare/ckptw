'use client'

import { useEffect, useState } from 'react'
import { getNextPendingProof, reviewProof } from '@/services/vipProof'
import { resolveCurrentProofUrl } from '@/utils/proofHelpers'
import { $Enums } from '@/app/generated/prisma'
import ProofStatus = $Enums.ProofStatus

type VipProof = NonNullable<Awaited<ReturnType<typeof getNextPendingProof>>>

export default function ReviewPage() {
    const [proof, setProof] = useState<VipProof | null>(null)
    const [loading, setLoading] = useState(true)
    const [zoomImage, setZoomImage] = useState<string | null>(null)

    const loadProof = async () => {
        setLoading(true)
        const nextProof = await getNextPendingProof()
        setProof(nextProof)
        setLoading(false)
    }

    const handleReview = async (status: ProofStatus) => {
        if (!proof) return
        await reviewProof(proof.id, status)
        await loadProof()
    }

    useEffect(() => {
        loadProof()
    }, [])

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen text-lg font-semibold text-pink-500 animate-pulse">
                Loading your data...
            </div>
        )

    if (!proof)
        return (
            <div className="flex items-center justify-center h-screen text-2xl font-bold text-green-400">
                No more proofs to review 🎉
            </div>
        )

    const latestAppeal = proof.appeals.length > 0 ? proof.appeals[0] : null

    // Ambil image yang benar, fallback ke original kalau appeal kosong
    const vipImageUrl = resolveCurrentProofUrl(proof, 'VIP')
    const summitImageUrl = resolveCurrentProofUrl(proof, 'SUMMIT')

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4">
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-6 w-full max-w-md text-center transition-all duration-300 hover:scale-[1.02]">
                <h2 className="text-2xl font-extrabold text-purple-600 tracking-tight">
                    Roblox Username
                </h2>
                <p className="text-lg font-semibold text-gray-700 mt-1">{proof.username}</p>

                <div className="mt-4 space-y-1 text-sm">
                    <p className="text-gray-500">
                        Discord: <span className="font-medium text-gray-800">{proof.discordId}</span>
                    </p>
                    <p className="text-gray-500">
                        Summit Total: <span className="font-medium text-gray-800">{proof.summitTotal}</span>
                    </p>
                    <p className="text-gray-500">
                        IP Address: <span className="font-medium text-gray-800">{proof.ipAddress}</span>
                    </p>
                </div>

                {/* Jika ada appeal, tampilkan alasan */}
                {latestAppeal && (
                    <div className="mt-4 p-4 border rounded-lg bg-yellow-50 text-left">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-yellow-700">Appeal Reason:</span> {latestAppeal.reason}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Submitted on {new Date(latestAppeal.createdAt).toLocaleString()}
                        </p>
                    </div>
                )}

                {/* VIP Image, hanya muncul jika ada URL */}
                {vipImageUrl && (
                    <div className="mt-6">
                        <p className="font-semibold text-pink-600">
                            VIP Proof {latestAppeal?.newProofVipURL && '(Appeal)'}
                        </p>
                        <div className="mt-2 flex justify-center">
                            <img
                                src={vipImageUrl}
                                alt="VIP Proof"
                                className="rounded-xl border border-gray-200 shadow-md cursor-zoom-in transition-transform duration-300 hover:scale-105 max-w-[300px] max-h-[300px] object-contain w-full h-auto"
                                onClick={() => setZoomImage(vipImageUrl)}
                            />
                        </div>
                    </div>
                )}

                {/* Summit Image, hanya muncul jika ada URL */}
                {summitImageUrl && (
                    <div className="mt-6">
                        <p className="font-semibold text-blue-600">
                            Summit Proof {latestAppeal?.newProofSummitURL && '(Appeal)'}
                        </p>
                        <div className="mt-2 flex justify-center">
                            <img
                                src={summitImageUrl}
                                alt="Summit Proof"
                                className="rounded-xl border border-gray-200 shadow-md cursor-zoom-in transition-transform duration-300 hover:scale-105 max-w-[300px] max-h-[300px] object-contain w-full h-auto"
                                onClick={() => setZoomImage(summitImageUrl)}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-between gap-4">
                    <button
                        onClick={() => handleReview(ProofStatus.REJECTED)}
                        className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        ❌ Reject
                    </button>
                    <button
                        onClick={() => handleReview(ProofStatus.APPROVED)}
                        className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        ✅ Approve
                    </button>
                </div>
            </div>

            {/* Zoom Modal */}
            {zoomImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setZoomImage(null)}
                >
                    <img
                        src={zoomImage}
                        alt="Zoomed Proof"
                        className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl cursor-zoom-out transition-transform duration-300 hover:scale-105 object-contain"
                    />
                    <button
                        className="absolute top-5 right-5 text-white text-3xl hover:scale-110 transition-transform"
                        onClick={() => setZoomImage(null)}
                    >
                        ✕
                    </button>
                </div>
            )}
        </main>
    )
}
