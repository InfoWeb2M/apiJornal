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

server.get("/show-news", async (request, reply) => {
  try {
    const title = request.query.title || null; // fallback caso não passe query
    const newsList = await dataBase.List(title);

    if (!Array.isArray(newsList)) {
      return reply.status(500).send({ error: "Formato de dados inválido" });
    }

    return newsList;
  } catch (err) {
    reply.status(500).send({ error: "Erro ao listar notícias" });
  }
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

const port = process.env.PORT || 1992;
server.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server rodando em: ${address}`);
});
