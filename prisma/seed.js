import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.service.createMany({
    data: [
      { id: "1", name: "Corte de pelo", duration: 30 },
      { id: "2", name: "Masaje relajante", duration: 60 },
      { id: "3", name: "Manicura", duration: 45 },
      { id: "4", name: "Tinte de pelo", duration: 90 },
    ],
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
