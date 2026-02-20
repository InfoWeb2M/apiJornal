import express from "express";
import { upload } from "../../middlewares/upload.js";
import NewsController from "../controllers/NewsController.js";
import { authMiddleware, isAdmin } from "../../middlewares/auth.js";

const newsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Gerenciamento de notícias
 */

/**
 * @swagger
 * /news/show-news:
 *   get:
 *     summary: Listar todas as notícias
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Lista de notícias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 */
newsRouter.get("/news/show-news", NewsController.showNews);

/**
 * @swagger
 * /news/show-news/{id}:
 *   get:
 *     summary: Buscar notícia por ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da notícia
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Notícia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: Notícia não encontrada
 */
newsRouter.get("/news/search-news/:id", NewsController.showNewsById);

/**
 * @swagger
 * /news/create-news:
 *   post:
 *     summary: Criar uma nova notícia
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               body:
 *                 type: string
 *               author:
 *                 type: string
 *               newsType:
 *                 type: string
 *               image1:
 *                 type: string
 *                 format: binary
 *               image2:
 *                 type: string
 *                 format: binary
 *               image3:
 *                 type: string
 *                 format: binary
 *               image4:
 *                 type: string
 *                 format: binary
 *               image5:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Notícia criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
newsRouter.post(
  "/news/create-news",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  NewsController.createNews,
);

/**
 * @swagger
 * /news/update-news/{id}:
 *   put:
 *     summary: Atualizar uma notícia
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               body:
 *                 type: string
 *               newsType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notícia atualizada
 *       404:
 *         description: Notícia não encontrada
 */
newsRouter.put(
  "/news/update-news/:id",
  authMiddleware,
  isAdmin,
  NewsController.updateNews,
);

/**
 * @swagger
 * /news/like-news/{id}:
 *   patch:
 *     summary: Curtir uma notícia
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Like registrado
 *       404:
 *         description: Notícia não encontrada
 */
newsRouter.patch(
  "/news/like-news/:id",
  authMiddleware,
  NewsController.likenews,
);

/**
 * @swagger
 * /news/delete-news/{id}:
 *   delete:
 *     summary: Remover uma notícia
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Notícia removida
 *       404:
 *         description: Notícia não encontrada
 */
newsRouter.delete(
  "/news/delete-news/:id",
  authMiddleware,
  isAdmin,
  NewsController.deleteNews,
);

export default newsRouter;
