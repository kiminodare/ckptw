"use client";

import { useState } from "react";
import { ProofStatus } from "@/app/generated/prisma";
import { z } from "zod/v3";
import { updateVipProof } from "@/services/updateVipProof";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface VipProof {
  id: string;
  username: string;
  discordId: string;
  isVip: boolean;
  summitTotal: number;
  status: ProofStatus;
}

const editSchema = z.object({
  vipProofId: z.string().min(1, "VIP Proof ID is required"),
  discordId: z.string().min(5, "Discord ID must be valid"),
  summitTotal: z.number().int().min(0, "Summit total must be >= 0"),
  status: z.nativeEnum(ProofStatus),
});

export function EditForm({
  proof,
  onSubmitted,
}: {
  proof: VipProof;
  onSubmitted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [discordId, setDiscordId] = useState(proof.discordId);
  const [summitTotal, setSummitTotal] = useState(proof.summitTotal);
  const [status, setStatus] = useState<ProofStatus>(proof.status);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = editSchema.safeParse({
      vipProofId: proof.id,
      discordId,
      summitTotal,
      status,
    });

    if (!validationResult.success) {
      setMessage(validationResult.error.issues[0].message);
      return;
    }

    try {
      setMessage(null);
      setLoading(true);
      await updateVipProof({
        vipProofId: proof.id,
        discordId,
        summitTotal,
        status,
      });
      onSubmitted();
      setMessage("Proof updated successfully!");
      router.refresh();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;
  if (!session.user.roles.some((r) => r === "ADMIN" || r === "OWNER")) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-600 mb-1">
          You are not authorized to edit this proof.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="hidden" name="vipProofId" value={proof.id} />

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Discord ID
        </label>
        <input
          type="text"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          className="border border-emerald-200 p-2 rounded-lg w-full shadow-sm text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Summit Total
        </label>
        <input
          type="number"
          value={summitTotal}
          onChange={(e) => setSummitTotal(Number(e.target.value))}
          className="border border-emerald-200 p-2 rounded-lg w-full shadow-sm text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProofStatus)}
          className="border border-emerald-200 p-2 rounded-lg w-full shadow-sm text-sm"
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {message && <p className="text-red-500 text-sm font-medium">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-3 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
}
