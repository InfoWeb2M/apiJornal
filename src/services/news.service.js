import { supabase } from "../config/supabase.js";
import path from "path";
import { NewsModel } from "../models/news.model.js";

const model = new NewsModel();

export class NewsService {
  async createNews(parts) {
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
      newsType: "",
    };

    let indexImage = 1;
    for await (const part of parts) {
      if (part.file) {
        const ext = path.extname(part.filename || ".jpg");
        const filename = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}${ext}`;

        const chunks = [];
        for await (const chunk of part.file) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        const { error: uploadError } = await supabase.storage
          .from("imagens-noticias")
          .upload(filename, buffer, {
            contentType: part.mimetype,
            upsert: true,
          });

        if (uploadError) throw new Error("Erro ao salvar imagem");

        const { data: publicData } = supabase.storage
          .from("imagens-noticias")
          .getPublicUrl(filename);

        newsData[`image${indexImage}`] = publicData.publicUrl;
        indexImage++;
      } else if (part.fieldname && part.value) {
        newsData[part.fieldname] = part.value;
      }
    }

    await model.create(newsData);
    return newsData;
  }

  async listNews(title) {
    return await model.list(title);
  }

  async updateNews(id, data) {
    await model.update(id, data);
  }

  static async deleteNews(id) {
    try {
      // Tenta buscar a notícia antes
      const news = await model.getById(id);
      if (!news) {
        throw new Error("Notícia não encontrada");
      }

      // Deleta a notícia
      await model.delete(id);

      return news; // retorna o objeto deletado pro controller
    } catch (err) {
      console.error("🔥 ERRO NO SERVICE DELETE:", err);
      throw new Error(err.message || "Erro ao deletar notícia");
    }
  }
}
