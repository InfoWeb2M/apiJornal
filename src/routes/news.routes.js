import { NewsController } from "../controllers/news.controller.js";
import {auth} from "../middlewares/authentication.js"

const controller = new NewsController();

export async function newsRoutes(server) {
  server.post("/news", {preHandler: auth} , controller.create.bind(controller));
  server.get("/show-news", controller.list.bind(controller));
  server.put("/update-news/:id", {preHandler: auth} , controller.update.bind(controller));
  server.delete("/delete-news/:id", {preHandler: auth} , controller.delete.bind(controller));
}
