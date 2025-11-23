import LoginController from "../controllers/login.controller.js";

const login = new LoginController

export function loginRoutes(server){
    server.post("/login", login.post.bind(login))
}