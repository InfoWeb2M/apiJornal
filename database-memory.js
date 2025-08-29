import { randomUUID } from "node:crypto";

export class DataBaseMemory {
  #news = new Map();

  List() {
    return Array.from(this.#news.entries()).map(([id, data]) => {
      return {
        id,
        ...data,
      };
    });
  }

  Create(news) {
    const newUUID = randomUUID();

    this.#news.set(newUUID, news);
  }

  Update(id, news) {
    this.#news.set(id, news);
  }

  Delete(id) {
    this.#news.delete(id);
  }
}
