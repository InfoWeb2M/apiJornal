import express from "express";
import { authMiddleware } from "../../middlewares/auth.js";

const meRouter = express.Router();

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Retorna o usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 */
meRouter.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

export { meRouter };
