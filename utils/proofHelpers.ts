export function resolveCurrentProofUrl(
    proof: {
        proofURLVip?: string | null
        proofURLSummit?: string | null
        appeals: {
            newProofVipURL?: string | null
            newProofSummitURL?: string | null
        }[]
    },
    type: 'VIP' | 'SUMMIT'
): string | null {
    const latestAppeal = proof.appeals.length > 0 ? proof.appeals[0] : null

    if (latestAppeal) {
        if (type === 'VIP') {
            return latestAppeal.newProofVipURL ?? null
        }
        if (type === 'SUMMIT') {
            return latestAppeal.newProofSummitURL ?? null
        }
        return null
    }

    if (type === 'VIP') {
        return proof.proofURLVip ?? null
    }
    if (type === 'SUMMIT') {
        return proof.proofURLSummit ?? null
    }

    return null
}
