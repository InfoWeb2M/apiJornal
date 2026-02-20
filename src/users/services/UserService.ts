import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../middlewares/errors/ApiError.js";
import type RequestUserRegisterDTO from "../controllers/dtos/RequestUserRegisterDTO.js";
import UserModel from "../models/UserModel.js";

export default class UserService {
  public static async registerUser(data: RequestUserRegisterDTO) {
    try {
      const user = await UserModel.findUserByEmail(data.email);

      if (user){
        throw ApiError.badRequest("Já existe um usuário com este email")
      }

      const password_Hash = bcrypt.hashSync(data.password, 10);
      const birthDate = new Date(data.birthDate);

      if (isNaN(birthDate.getTime())) {
        throw ApiError.badRequest("birthDate inválido");
      }
      const newUser = await UserModel.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password_Hash: password_Hash,
        birthDate: birthDate,
      });

      return {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error; // mantém status e mensagem
      }

      if (error instanceof Error) {
        throw ApiError.internal(error.message);
      }

      console.log(error);
      throw ApiError.internal("Unknown error");
    }
  }
  public static async loginUser(email: string, password: string) {
    try {
      const user = await UserModel.findUserByEmail(email);
      if (!user) {
        throw ApiError.unauthorized("Invalid email or password");
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw ApiError.unauthorized("Invalid email or password");
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1h" }
      );

      return { token };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error; // mantém status e mensagem
      }

      if (error instanceof Error) {
        throw ApiError.internal(error.message);
      }
      console.log(error);
      throw ApiError.internal("Unknown error");
    }
  }
}
