import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.rol.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      description: 'Admin',
      status: true,
    },
  });

  await prisma.rol.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      description: 'Usuario',
      status: true,
    },
  });

  console.log('🌱 Roles sembrados exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
