'use client'

import { useState } from 'react'
import { ProofStatus } from '@/app/generated/prisma'
import { submitAppeal } from '@/services/submitAppeal'
import { z } from 'zod/v3'

interface VipProof {
    id: string
    username: string
    discordId: string
    isVip: boolean
    summitTotal: number
    status: ProofStatus
}

const appealSchema = z.object({
    vipProofId: z.string().min(1, 'VIP Proof ID is required'),
    reason: z.string().min(10, 'Reason must be at least 10 characters'),
    newProofVip: z.instanceof(File).optional(),
    newProofSummit: z.instanceof(File).optional(),
})

export function AppealForm({
                               proof,
                               onSubmitted,
                           }: {
    proof: VipProof
    onSubmitted: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const vipProofId = formData.get('vipProofId')
        const reason = formData.get('reason')
        const fileVip = formData.get('newProofVip')
        const fileSummit = formData.get('newProofSummit')

        const validationResult = appealSchema.safeParse({
            vipProofId,
            reason,
            newProofVip: fileVip instanceof File && fileVip.size > 0 ? fileVip : undefined,
            newProofSummit: fileSummit instanceof File && fileSummit.size > 0 ? fileSummit : undefined,
        })

        if (!validationResult.success) {
            setError(validationResult.error.issues[0].message)
            return
        }

        try {
            setError(null)
            setLoading(true)
            await submitAppeal(formData)
            alert('Appeal submitted successfully!')
            onSubmitted()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="hidden" name="vipProofId" value={proof.id} />

            <textarea
                name="reason"
                placeholder="Explain your appeal..."
                required
                className="border border-indigo-200 p-2 rounded-lg w-full resize-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-sm"
            />

            <div className="space-y-2">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        New VIP Proof (optional)
                    </label>
                    <input
                        type="file"
                        name="newProofVip"
                        accept="image/*"
                        className="w-full border border-indigo-200 rounded-lg p-1 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        New Summit Proof (optional)
                    </label>
                    <input
                        type="file"
                        name="newProofSummit"
                        accept="image/*"
                        className="w-full border border-indigo-200 rounded-lg p-1 text-sm"
                    />
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm font-medium">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Submitting...' : 'Submit Appeal'}
            </button>
        </form>
    )
}
