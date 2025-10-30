import { NewsController } from "../controllers/news.controller.js";

const controller = new NewsController();

export async function newsRoutes(server) {
  server.post("/news", controller.create);
  server.get("/show-news", controller.list);
  server.put("/update-news/:id", controller.update);
  server.delete("/delete-news/:id", controller.delete);
}
