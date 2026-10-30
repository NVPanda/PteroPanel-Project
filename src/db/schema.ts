import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Tabela de usuários
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(), // Em produção: hash com bcrypt
  role: text("role").notNull().default("user"), // admin, user
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Tabela de tokens/vendas
export const tokenSales = sqliteTable("token_sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  amount: real("amount").notNull(),
  price: real("price").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, cancelled
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Tabela de serviços/containers
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("stopped"), // running, stopped, error
  type: text("type").notNull(), // minecraft, web, etc
  memory: integer("memory").notNull().default(512), // MB
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Schemas Zod para validação
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);