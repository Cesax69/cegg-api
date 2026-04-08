const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const logs = await prisma.log.findMany({
    orderBy: { id: 'desc' },
    take: 5
  });
  console.log("=== ÚLTIMOS ARCHIVOS DE AUDITORIA (LOGS) ===");
  if (logs.length === 0) {
      console.log("No hay logs en la base de datos aún.");
  } else {
      logs.forEach(log => {
          console.log(`[ID: ${log.id}] [${log.timestamp.toISOString()}] [Status: ${log.statusCode}] PATH: ${log.path}`);
          console.log(`  -> Error: ${log.error.substring(0, 100)}...`);
          console.log(`  -> Code : ${log.errorCode}`);
      });
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
