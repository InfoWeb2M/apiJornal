import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import staticPlugin from "@fastify/static";
import path from "path";
import fs from "fs";
import { DataBasePostgres } from "./database-Postgres.js";
import { fileURLToPath } from "url";

const server = fastify({ logger: true });
const dataBase = new DataBasePostgres();

// Diretório para uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Plugins
await server.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

await server.register(multipart);

server.register(staticPlugin, {
  root: uploadDir,
  prefix: "/uploads/",
});

// POST /news com até 5 imagens
server.post("/news", async (request, reply) => {
  const imageUrls = [];

  if (request.isMultipart()) {
    let count = 0;
    for await (const part of request.files()) {
      if (count >= 5) break; // limita a 5 imagens
      const filename = Date.now() + "-" + part.filename;
      const filepath = path.join(uploadDir, filename);
      await part.toFile(filepath);
      imageUrls.push(`/uploads/${filename}`);
      count++;
    }
  }

  const { title, body, summary, author } = request.body;

  // Preenche até 5 colunas de imagem
  const newsData = {
    title,
    body,
    summary,
    author,
    image1: imageUrls[0] || null,
    image2: imageUrls[1] || null,
    image3: imageUrls[2] || null,
    image4: imageUrls[3] || null,
    image5: imageUrls[4] || null,
  };

  await dataBase.Create(newsData);

  return reply.status(201).send({ message: "Notícia criada", imageUrls });
});

// Outras rotas permanecem iguais
server.get("/show-news", async (request, reply) => {
  try {
    const title = request.query.title || null;
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
  const { title, body, summary, author } = request.body;

  await dataBase.Update(id, { title, body, summary, author });

  return reply.status(200).send({ message: "Notícia atualizada" });
});

server.delete("/delete-news/:id", async (request, reply) => {
  const { id } = request.params;

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
