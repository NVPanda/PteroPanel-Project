import { db } from "./src/db";
import { users, tokenSales, services } from "./src/db/schema";

async function seed() {
  // Usuário de teste
  await db.insert(users).values({
    email: "admin@exemplo.com",
    password: "123456", // Em produção: hash!
    name: "Administrador",
    role: "admin",
  });

  // Vendas de teste
  await db.insert(tokenSales).values([
    { userId: 1, amount: 100, price: 5.5, status: "completed" },
    { userId: 1, amount: 50, price: 5.5, status: "completed" },
    { userId: 1, amount: 200, price: 5.0, status: "pending" },
  ]);

  // Serviços de teste
  await db.insert(services).values([
    { userId: 1, name: "Servidor Minecraft #1", type: "minecraft", status: "running", memory: 2048 },
    { userId: 1, name: "Servidor Web", type: "nginx", status: "running", memory: 512 },
    { userId: 1, name: "Bot Discord", type: "nodejs", status: "stopped", memory: 256 },
  ]);

  console.log("Dados de teste inseridos!");
  process.exit(0);
}

seed();