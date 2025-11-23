import "dotenv/config"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { QueryAdmin } from "../models/login.model.js";

const admin = new QueryAdmin();

export async function validateUser(name, passw) {
  const users = await admin.list();

  const user = users.find((u) => u.username === name);

  if (!user) return null;

  const isValid = await bcrypt.compare(passw, user.password_hash);

  if (!isValid) return null;

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
}
