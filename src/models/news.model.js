import { randomUUID } from "node:crypto";
import { sql } from "../config/db.js";

export class NewsModel {
  async list(search) {
    const query = search
      ? sql`SELECT * FROM noticias WHERE title ILIKE ${'%' + search + '%'}`
      : sql`SELECT * FROM noticias`;

    const result = await query;
    return Array.isArray(result) ? result : [...result];
  }

  async create(news) {
    const id = randomUUID();
    await sql`
      INSERT INTO noticias
      (id, title, body, summary, author, image1, image2, image3, image4, image5, newstype)
      VALUES
      (${id}, ${news.title}, ${news.body}, ${news.summary}, ${news.author},
       ${news.image1}, ${news.image2}, ${news.image3}, ${news.image4}, ${news.image5}, ${news.newsType})
    `;
  }

  async update(id, news) {
    await sql`
      UPDATE noticias
      SET body = ${news.body},
          summary = ${news.summary},
          author = ${news.author},
          newstype = ${news.newstype}
      WHERE id = ${id}
    `;
  }

  async delete(id) {
    await sql`DELETE FROM noticias WHERE id = ${id}`;
  }
}
