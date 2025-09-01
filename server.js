import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import staticPlugin from "@fastify/static";
import path from "path";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { DataBasePostgres } from "./database-Postgres.js";

const pump = promisify(pipeline);
const server = fastify({ logger: true });
const dataBase = new DataBasePostgres();

import { fileURLToPath } from "url";

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório para uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Plugins
await server.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

await server.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB por arquivo
    files: 5,                    // máximo 5 arquivos
    fieldNameSize: 200,          // tamanho máximo do nome do campo
    fields: 10                   // máximo de campos de texto
  }
});

server.register(staticPlugin, {
  root: uploadDir,
  prefix: "/uploads/",
});

// POST /news com até 5 imagens
server.post("/news", async (request, reply) => {
  const parts = request.parts();
  const newsData = {
    title: "",
    summary: "",
    author: "",
    body: "",
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  };

  let indexImage = 1;

  for await (const part of parts) {
    if (part.file) {
      // nome do arquivo seguro
      const originalName = part.filename || (part.file.hapi && part.file.hapi.filename) || `file-${Date.now()}`;
      const filename = Date.now() + "-" + originalName;
      const filepath = path.join(uploadDir, filename);

      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filepath);
        part.file.pipe(writeStream);
        part.file.on("end", resolve);
        part.file.on("error", reject);
      });

      newsData[`image${indexImage}`] = `/uploads/${filename}`;
      indexImage++;
    } else if (part.fieldname && part.value) {
      newsData[part.fieldname] = part.value;
    }
  }

  await dataBase.Create(newsData);

  return reply.status(201).send({ message: "Notícia criada", data: newsData });
});

// GET /show-news
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

// PUT /update-news/:id
server.put("/update-news/:id", async (request, reply) => {
  const { id } = request.params;
  const { title, body, summary, author } = request.body;

  await dataBase.Update(id, { title, body, summary, author });

  return reply.status(200).send({ message: "Notícia atualizada" });
});

// DELETE /delete-news/:id
server.delete("/delete-news/:id", async (request, reply) => {
  const { id } = request.params;

  await dataBase.Delete(id);

  return reply.status(204).send();
});

// Start server
const port = process.env.PORT || 1992;
server.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server rodando em: ${address}`);
});
