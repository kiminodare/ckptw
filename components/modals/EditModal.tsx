'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ProofStatus } from '@/app/generated/prisma'
import {EditForm} from "@/components/form/EditForm";

interface VipProof {
    id: string
    username: string
    discordId: string
    isVip: boolean
    summitTotal: number
    status: ProofStatus
}

export function EditModal({ proof }: { proof: VipProof }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-emerald-700 shadow-md transition-all"
            >
                Edit
            </button>

            {open &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold text-emerald-700 text-center mb-4">
                                Edit {proof.username}
                            </h2>

                            <EditForm proof={proof} onSubmitted={() => setOpen(false)} />

                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    )
}
