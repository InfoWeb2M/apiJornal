import type { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError.js";

export function ExceptionHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
    if (err instanceof ApiError){
        return res.status(err.statusCode).json({ Status: err.statusCode , message: err.message });
    }

    console.error(err);

    return res.status(500).json({ Status: 500 , message: err.message || "Internal Server Error" });
}
