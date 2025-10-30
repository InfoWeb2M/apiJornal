import { NewsService } from "../services/news.service.js";

const service = new NewsService();

export class NewsController {
  async create(req, reply) {
    try {
      const parts = req.parts();
      const data = await service.createNews(parts);
      reply.status(201).send({ message: "Notícia criada", data });
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  }

  async list(req, reply) {
    try {
      const title = req.query.title || null;
      const list = await service.listNews(title);
      reply.send(list);
    } catch {
      reply.status(500).send({ error: "Erro ao listar notícias" });
    }
  }

  async update(req, reply) {
    try {
      const { id } = req.params;
      await service.updateNews(id, req.body);
      reply.status(200).send({ message: "Notícia atualizada" });
    } catch {
      reply.status(500).send({ error: "Erro ao atualizar notícia" });
    }
  }

  async delete(req, reply) {
    try {
      const { id } = req.params;
      await service.deleteNews(id);
      reply.status(204).send();
    } catch {
      reply.status(500).send({ error: "Erro ao deletar notícia" });
    }
  }
}
