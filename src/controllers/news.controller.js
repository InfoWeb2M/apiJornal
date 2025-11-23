import { NewsService } from "../services/news.service.js";

export class NewsController {
  constructor() {
    this.newsService = new NewsService(); // <--- inicializando
  }

  async create(req, reply) {
    try {
      const parts = req.parts();
      const data = await this.newsService.createNews(parts);
      reply.status(201).send({ message: "Notícia criada", data });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  }

  async list(req, reply) {
    try {
      const title = req.query.title || null;
      const list = await this.newsService.listNews(title);
      reply.send(list);
    } catch {
      reply.status(500).send({ error: "Erro ao listar notícias" });
    }
  }

  async update(req, reply) {
    try {
      const { id } = req.params;
      await this.newsService.updateNews(id, req.body);
      reply.status(200).send({ message: "Notícia atualizada" });
    } catch {
      reply.status(500).send({ error: "Erro ao atualizar notícia" });
    }
  }

  async delete(req, reply) {
    try {
      console.log("🚨 ID recebido:", req.params.id);
      console.log("🚨 Usuário (se houver):", req.user);

      const id = req.params.id;
      const result = await this.newsService.delete(id); // agora funciona

      return reply.send({
        success: true,
        message: "Notícia deletada com sucesso",
        result
      });

    } catch (err) {
      console.error("🔥 ERRO NO DELETE:", err);
      return reply.status(500).send({
        success: false,
        error: err.message || "Erro interno"
      });
    }
  }
}
