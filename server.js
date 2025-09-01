import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { DataBasePostgres } from "./database-Postgres.js";

// Configurar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Fastify
const server = fastify({ logger: true });
const dataBase = new DataBasePostgres();

// Plugins
await server.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

await server.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB por arquivo
    files: 5,
    fieldNameSize: 200,
    fields: 10,
  },
});

// POST /news com upload para Supabase
server.post("/news", async (request, reply) => {
  try {
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
        // Gera nome único para cada arquivo
        const ext = path.extname(part.filename || ".jpg");
        const filename = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}${ext}`;

        // Converte para Buffer
        const chunks = [];
        for await (const chunk of part.file) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Faz upload no Supabase
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("news-images")
          .upload(filename, buffer, {
            contentType: part.mimetype,
            upsert: true,
          });

        if (uploadError) {
          console.error("Erro ao salvar imagem:", uploadError);
          return reply.status(500).send({ error: "Erro ao salvar imagem" });
        }

        // Gera URL pública
        const { data: publicData, error: publicError } = supabase.storage
          .from("news-images")
          .getPublicUrl(filename);

        if (publicError) {
          console.error("Erro ao gerar URL pública:", publicError);
          return reply.status(500).send({ error: "Erro ao gerar URL pública" });
        }

        newsData[`image${indexImage}`] = publicData.publicUrl;
        indexImage++;
      } else if (part.fieldname && part.value) {
        newsData[part.fieldname] = part.value;
      }
    }

    // Salva no banco
    await dataBase.Create(newsData);

    return reply.status(201).send({ message: "Notícia criada", data: newsData });
  } catch (err) {
    console.error("Erro no endpoint /news:", err);
    return reply.status(500).send({ error: "Erro interno no servidor" });
  }
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
