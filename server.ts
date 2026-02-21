import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import newsRouter from "./src/noticias/routes/NewsRouter.js";
import { ExceptionHandler } from "./src/middlewares/errors/ExceptionHandler.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./src/users/routes/UserRouter.js";
import { meRouter } from "./src/users/routes/me.js";
import { swaggerSpec } from "./src/docs/swagger.js";
import swaggerUi from "swagger-ui-express";
import webhook from "./src/mensager/routes/webhook.js";

const server = express();

dotenv.config();

server.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://jornalteresa.vercel.app"],
    credentials: true,
    methods: ["GET", "DELETE", "POST", "OPTIONS", "PUT", "PATCH"],
  })
);

server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(newsRouter);
server.use(userRouter);
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use(meRouter);
server.use(webhook)

server.use(ExceptionHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
