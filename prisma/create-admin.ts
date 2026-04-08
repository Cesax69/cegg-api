import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      rol_id: 1, // Admin Rol
      password: adminPassword,
    },
    create: {
      email: 'admin@nexus.com',
      username: 'admin',
      password: adminPassword,
      name: 'Super',
      lastname: 'Administrador',
      rol_id: 1,
    },
  });

  console.log('👑 Usuario Admin creado exitosamente.');
  console.log('Credenciales:');
  console.log('Usuario: admin');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
