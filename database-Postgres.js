import { randomUUID } from "node:crypto";
import { sql } from "./db.js";

export class DataBasePostgres {
  #news = new Map();

  async List(search) {
    if (search) {
      return await sql`SELECT id ,title, body, summary ,author FROM noticias WHERE title ILIKE ${'%' + search + '%'} `;
    } else {
      return await sql`SELECT id ,title, body,  summary ,author FROM noticias`;
    }
  }

  async Create(news) {
    const newUUID = randomUUID();

    await sql`INSERT INTO noticias (id, title, body, summary ,author) VALUES (${newUUID}, ${news.title}, ${news.body}, ${news.summary},${news.author})`;
  }

  async Update(id, news) {
    return await sql`UPDATE noticias SET title = ${news.title}, body = ${news.body}, summary = ${news.summary} ,author = ${news.author} WHERE id = ${id}`
  }

  async Delete(id) {
    return await sql`DELETE FROM noticias WHERE id = ${id}`
  }
}
