import { NewsController } from "../controllers/news.controller.js";
import {auth} from "../middlewares/authentication.js"

const controller = new NewsController();

export async function newsRoutes(server) {
  server.post("/news", {preHandler: auth} , controller.create);
  server.get("/show-news", controller.list);
  server.put("/update-news/:id", {preHandler: auth} , controller.update);
  server.delete("/delete-news/:id", {preHandler: auth} , controller.delete);
}
