import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { db } from "@/db";
import { users, tokenSales, services } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Elysia({ prefix: "/api" })
  .use(cors())
  .use(jwt({ secret: "sua-chave-secreta-aqui", exp: "7d" }))
  
  // Auth - Login
  .post("/auth/login", async ({ body, jwt }) => {
    const { email, password } = body as { email: string; password: string };
    
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    
    if (!user || user.password !== password) {
      return { success: false, error: "Credenciais inválidas" };
    }
    
    const token = await jwt.sign({ userId: user.id, email: user.email, role: user.role });
    
    return { success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  })
  
  // Auth - Registrar
  .post("/auth/register", async ({ body }) => {
    const { email, password, name } = body as { email: string; password: string; name: string };
    
    try {
      const newUser = await db.insert(users).values({ email, password, name }).returning();
      return { success: true, user: newUser[0] };
    } catch (e) {
      return { success: false, error: "Email já existe" };
    }
  })
  
  // Dashboard stats
  .get("/dashboard/stats", async () => {
    const totalUsers = await db.select().from(users);
    const totalSales = await db.select().from(tokenSales);
    const totalServices = await db.select().from(services);
    
    return {
      users: totalUsers.length,
      sales: totalSales.length,
      revenue: totalSales.reduce((acc, s) => acc + (s.status === "completed" ? s.amount * s.price : 0), 0),
      services: totalServices.filter(s => s.status === "running").length,
    };
  })
  
  // Listar serviços
  .get("/services", async () => {
    return await db.select().from(services);
  })
  
  // Criar serviço
  .post("/services", async ({ body }) => {
    const { name, type, userId } = body as { name: string; type: string; userId: number };
    const newService = await db.insert(services).values({ name, type, userId }).returning();
    return { success: true, service: newService[0] };
  });

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;