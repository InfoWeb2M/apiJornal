import { prisma } from "../../config/prisma.js";
import ApiError from "../../middlewares/errors/ApiError.js";
import type User from "../services/entities/User.js";

export default class UserModel {
  public static async createUser(data: User) {
    try {
      return await prisma.usuarios.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password_Hash,
          birthDate: data.birthDate,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error.message; // mantém status e mensagem
      }

      if (error instanceof Error) {
        throw ApiError.internal(error.message);
      }
      console.log(error);
      throw ApiError.internal("Unknown error");
    }
  }

  public static async getAllUsers(){
    return await prisma.usuarios.findMany({
      select:{
        firstName: true,
        email: true,
      }
    })
  }

  public static async findUserByEmail(email: string) {
    try {
      return await prisma.usuarios.findUnique({
        where: {
          email: email,
        },
      });
    } catch (error) {

      if (error instanceof ApiError) {
        throw ApiError.internal(error.message);
      }
      console.log(error);
      throw ApiError.internal("Unknown error");
    }
  }
}
