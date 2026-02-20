import type { Request, Response, NextFunction } from "express";
import type RequestUserRegisterDTO from "./dtos/RequestUserRegisterDTO.js";
import UserService from "../services/UserService.js";

export default class UserController {
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body: RequestUserRegisterDTO = req.body;
      const result = await UserService.registerUser(body);
      return res
        .status(201)
        .json({ ok: "Usuário registrado com sucesso", body: result });
    } catch (error) {
      return next(error); // 🔥 ESSENCIAL
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await UserService.loginUser(email, password);

      res.cookie("auth_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.status(200).json({ ok: "Login realizado com sucesso" });
    } catch (error) {
      return next(error);
    }
  }
}
