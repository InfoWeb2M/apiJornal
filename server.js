import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { DataBasePostgres } from "./database-Postgres.js";

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY_SERVICE // Usar service_role para uploads
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
        const ext = path.extname(part.filename || ".jpg");
        const filename = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}${ext}`;

        const chunks = [];
        for await (const chunk of part.file) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Upload no Supabase
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("imagens-noticias")
          .upload(filename, buffer, {
            contentType: part.mimetype,
            upsert: true,
          });

        if (uploadError) {
          console.error("Erro ao salvar imagem:", uploadError);
          return reply.status(500).send({ error: "Erro ao salvar imagem" });
        }

        // URL pública
        const { data: publicData, error: publicError } = supabase.storage
          .from("imagens-noticias")
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

    return reply
      .status(201)
      .send({ message: "Notícia criada", data: newsData });
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
  try {
    const { id } = request.params;

    // 1️⃣ Buscar a notícia no banco
    const news = await dataBase.GetById(id); // supondo que você tenha esse método
    if (!news) {
      return reply.status(404).send({ error: "Notícia não encontrada" });
    }

    // 2️⃣ Deletar imagens no Supabase
    const images = [
      news.image1,
      news.image2,
      news.image3,
      news.image4,
      news.image5,
    ].filter(Boolean); // remove null/undefined

    for (const imageUrl of images) {
      // Extrair o caminho relativo do bucket a partir da URL pública
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/");
      // /storage/v1/object/public/news-images/nome-do-arquivo
      const filePath = pathParts.slice(5).join("/"); // pega apenas "nome-do-arquivo"

      if (filePath) {
        const { error } = await supabase.storage
          .from("news-images")
          .remove([filePath]);

        if (error) {
          console.error("Erro ao deletar imagem:", error);
          // você pode optar por continuar mesmo assim ou abortar
        }
      }
    }

    // 3️⃣ Deletar notícia do banco
    await dataBase.Delete(id);

    return reply.status(204).send();
  } catch (err) {
    console.error("Erro ao deletar notícia:", err);
    return reply.status(500).send({ error: "Erro interno no servidor" });
  }
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
