import { prisma } from "../../config/prisma.js";
import ApiError from "../../middlewares/errors/ApiError.js";
import type Files from "../services/entities/Files.js";

export default class NewsModel {
  public static async getAllNews() {
    return prisma.noticias.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        arquivos: true, // ou files — depende do nome no schema.prisma
      },
    });
  }

  public static async getById(id: string) {
    try {
      const news = await prisma.noticias.findUnique({
        where: { id },
        include: { arquivos: true },
      });
      return news;
    } catch (error) {
      throw ApiError.notFound("Notícia com id " + id + " não encontrada");
    }
  }

  public static async createNews(
    title: string,
    summary: string,
    body: string,
    author: string,
    newstype: string,
    files: Files,
  ) {
    return prisma.noticias.create({
      data: {
        title,
        summary,
        body,
        author,
        newstype,
        arquivos: {
          create: {
            image1: files.image1 || null,
            image2: files.image2 || null,
            image3: files.image3 || null,
            image4: files.image4 || null,
            image5: files.image5 || null,
          },
        },
      },
      include: { arquivos: true },
    });
  }

  public static async updateNews(
    id: string,
    title: string,
    summary: string,
    body: string,
    author: string,
    newstype: string,
  ) {
    try {
      return prisma.noticias.update({
        where: { id },
        data: {
          title,
          summary,
          body,
          author,
          newstype,
        },
      });
    } catch (error) {
      throw ApiError.notFound("Notícia com id " + id + " não encontrada");
    }
  }

  public static async likenews(id: string, action: "like" | "unlike") {
    try {
      const news = await prisma.noticias.update({
        where: { id },
        data: {
          curtidas: {
            [action === "like" ? "increment" : "decrement"]: 1,
          },
        },
      });
      return news;
    } catch (error) {
      throw ApiError.notFound("Notícia com id " + id + " não encontrada");
    }
  }

  public static async deleteNews(id: string) {
    return prisma.noticias.delete({
      where: { id },
    });
  }
}
