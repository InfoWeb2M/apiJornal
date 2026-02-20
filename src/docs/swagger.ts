// src/docs/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Teresa News",
      version: "3.1.2",
      description: "API REST para gerenciamento de usuários e notícias",
    },
    servers: [
      { url: "http://localhost:1992" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["src/docs/schemas/**/*.ts",
    "src/**/routes/*.ts",],
});
