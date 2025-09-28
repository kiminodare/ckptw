import prisma from "@/lib/prisma";

async function main(): Promise<void> {
  console.log("Starting auto-assignment for existing VipProof records...");

  const admins = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: { in: ["ADMIN", "OWNER"] }
          }
        }
      }
    },
    include: {
      assignedProofs: true
    }
  });

  if (admins.length === 0) {
    throw new Error("No admins found. Please seed at least one admin user.");
  }

  console.log(`Found ${admins.length} admins.`);

  const unassignedProofs = await prisma.vipProof.findMany({
    where: {
      status: "PENDING",
      assignedAdmins: { none: {} }
    }
  });

  if (unassignedProofs.length === 0) {
    console.log("No unassigned proofs found.");
    process.exit(0);
  }

  console.log(`Found ${unassignedProofs.length} unassigned VipProof records.`);

  let index = 0;
  const assignments: { vipProofId: string; adminId: string }[] = [];

  for (const proof of unassignedProofs) {
    const selectedAdmin = admins[index % admins.length];
    assignments.push({
      vipProofId: proof.id,
      adminId: selectedAdmin.id
    });
    index++;
  }

  await prisma.vipProofAssignment.createMany({
    data: assignments,
    skipDuplicates: true
  });

  console.log(`Successfully assigned ${assignments.length} proofs to admins.`);
}

main()
    .then(() => {
      console.log("Auto-assignment completed!");
      process.exit(0);
    })
    .catch((error: unknown) => {
      console.error("Error during auto-assignment:", error);
      process.exit(1);
    });
