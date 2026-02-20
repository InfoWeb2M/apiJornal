import express, { type Request, type Response } from "express";
import { validatePassword } from "../../middlewares/validatePassword.js";
import UserController from "../controllers/UserController.js";

export const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Autenticação e gerenciamento de usuários
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos ou usuário já existe
 */

userRouter.post("/user/register", validatePassword, UserController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
userRouter.post("/user/login", UserController.login);

userRouter.get("/user/logout", async (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 0, // expira imediatamente
  });

  // envia uma resposta ao cliente
  return res.status(200).json({ message: "Logout realizado com sucesso" });
})

userRouter.get("/user/verify_code", (req: Request, res: Response) => {
  const code = req.query.code as string;
  const email = req.query.email as string;

  if (!code || !email) {
    return res.status(400).json({ error: "code and email are required" });
  }

  // Aqui você faria a verificação do código...
  return res.status(200).json({ message: "Code verified successfully" });
});

