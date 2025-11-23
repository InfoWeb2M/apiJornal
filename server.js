import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { newsRoutes } from "./src/routes/news.routes.js";
import { loginRoutes } from "./src/routes/login.routes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const server = fastify({ logger: true });

// Middlewares nativos

await server.register(cors, {
  origin: [
    "https://paineljornal.vercel.app",
    "https://jornalteresa.netlify.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

await server.register(multipart);

server.register(cookie, {
  secret: process.env.JWT_SECRET, // usado para assinar cookies se necessário
});

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "token",
    signed: false,
  },
});

// 🔹 Captura o início de cada request (para medir tempo de resposta)
server.addHook("onRequest", async (req) => {
  req.startTime = process.hrtime();
});

// 🔹 Define o handler global de erros (agora com logging embutido)
server.setErrorHandler(errorHandler);

// Rotas
await server.register(newsRoutes);
await server.register(loginRoutes);

// Inicialização
const port = process.env.PORT || 1992;
server.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor rodando em: ${address}`);
});
