import fastify from "fastify";
import cors from "@fastify/cors";
import { DataBasePostgres } from "./database-Postgres.js";

const server = fastify({ logger: true });
const dataBase = new DataBasePostgres();

server.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

server.post("/news", async (request, reply) => {
  const { title, body, summary ,author } = request.body;

  await dataBase.Create({ title, body, summary, author });

  return reply.status(201).send({ message: "Notícia criada" });
});

server.get("/show-news", async (request) => {
  const { title } = request.query;

  return await dataBase.List(title);
});

server.put("/update-news/:id", async (request, reply) => {
  const { id } = request.params;
  const { title, body, summary,author } = request.body;

  await dataBase.Update(id, { title, body, summary ,author });

  return reply.status(200).send({ message: "Notícia atualizada" });
});

server.delete("/delete-news/:id", async(request, reply) => {
  const id = request.params.id;

  await dataBase.Delete(id);

  return reply.status(204).send();
});

server.listen({ port: 1992 });
