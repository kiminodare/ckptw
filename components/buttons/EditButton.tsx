"use client";
import { VipProof } from "@/app/generated/prisma";
import { useModalStore } from "@/stores/modalStore";
import { EditProof } from "../modals/EditProof";
import { useSession } from "@/lib/auth-client";

interface EditButtonProps {
  proof: VipProof;
}

export function EditButton({ proof }: EditButtonProps) {
  const { openModal } = useModalStore();
  const { data: session } = useSession();
  const canEdit =
    session?.user.roles.includes("ADMIN") ||
    session?.user.roles.includes("OWNER");

  if (!canEdit) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  return (
    <button
      type="button"
      onClick={() => openModal(EditProof, { proof })}
      className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all"
    >
      Edit
    </button>
  );
}
