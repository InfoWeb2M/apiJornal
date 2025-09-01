import { randomUUID } from "node:crypto";
import { sql } from "./db.js";

export class DataBasePostgres {
  async List(search) {
    if (search) {
      return await sql`
        SELECT id, title, body, summary, author, image1, image2, image3, image4, image5
        FROM noticias
        WHERE title ILIKE ${'%' + search + '%'}
      `;
    } else {
      return await sql`
        SELECT id, title, body, summary, author, image1, image2, image3, image4, image5
        FROM noticias
      `;
    }
  }

  async Create(news) {
    const newUUID = randomUUID();
    await sql`
      INSERT INTO noticias
      (id, title, body, summary, author, image1, image2, image3, image4, image5)
      VALUES
      (${newUUID}, ${news.title}, ${news.body}, ${news.summary}, ${news.author},
       ${news.image1}, ${news.image2}, ${news.image3}, ${news.image4}, ${news.image5})
    `;
  }

  async Update(id, news) {
    return await sql`
      UPDATE noticias
      SET title = ${news.title},
          body = ${news.body},
          summary = ${news.summary},
          author = ${news.author}
      WHERE id = ${id}
    `;
  }

  async Delete(id) {
    return await sql`
      DELETE FROM noticias WHERE id = ${id}
    `;
  }
}
