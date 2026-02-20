import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

interface JwtPayload {
  sub: string;
}

interface userpayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: userpayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as userpayload;

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const decoded = req.user;

  if (decoded?.role !== "ADMIN") {
    return res.status(401).json({ message: "Usuário não autorizado" });
  }

  next();
}
