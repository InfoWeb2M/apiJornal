import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { newsRoutes } from "./src/routes/news.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const server = fastify({ logger: true });

// Middlewares nativos
await server.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
});
await server.register(multipart);

// 🔹 Captura o início de cada request (para medir tempo de resposta)
server.addHook("onRequest", async (req) => {
  req.startTime = process.hrtime();
});

// 🔹 Define o handler global de erros (agora com logging embutido)
server.setErrorHandler(errorHandler);

// Rotas
await server.register(newsRoutes);

// Inicialização
const port = process.env.PORT || 1992;
server.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor rodando em: ${address}`);
});
