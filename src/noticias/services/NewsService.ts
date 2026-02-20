import crypto from "crypto";
import { gerarResenhaJornal } from "../../config/groq.js";
import { supabase } from "../../config/supabase.js";
import ApiError from "../../middlewares/errors/ApiError.js";
import NewsModel from "../models/NewsModel.js";
import type Files from "./entities/Files.js";

export default class NewsService {
    public static async createNews(
        title: string,
        summary: string,
        body: string,
        author: string,
        newstype: string,
        files: Express.Multer.File[] | Record<string, Express.Multer.File[]> | undefined,
    ) {
        const filesArray: Express.Multer.File[] = [];

        if (!files || (Array.isArray(files) && files.length === 0)) {
            throw ApiError.badRequest("Nenhum arquivo enviado");
        }

        if (Array.isArray(files)) {
            filesArray.push(...files);
        } else {
            for (const key in files) {
                const fieldFiles = files[key];
                if (Array.isArray(fieldFiles)) {
                    filesArray.push(...fieldFiles);
                }
            }
        }

        if (filesArray.length > 5) {
            throw ApiError.badRequest("O máximo de arquivos permitido é 5");
        }

        const urlFiles: Files = {
            id: crypto.randomUUID(),
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            image5: null,
        };

        let contador = 1;

        for (const file of filesArray) {
            try {
                const fileExt = file.originalname.split(".").pop() ?? "bin";
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
                const filePath = file.mimetype.startsWith("image/") ? `images/${fileName}` : `videos/${fileName}`;

                const { error } = await supabase.storage.from("imagens-noticias").upload(filePath, file.buffer, {
                    cacheControl: "3600",
                    upsert: true,
                });

                if (error) {
                    throw ApiError.internal(error.message);
                }

                const urlResult = supabase.storage.from("imagens-noticias").getPublicUrl(filePath);

                if (urlResult.data?.publicUrl) {
                    urlFiles[`image${contador}` as keyof Files] = urlResult.data.publicUrl;
                }

                contador++;
            } catch (error) {
                if (error instanceof ApiError) {
                    throw error; // mantém status e mensagem
                }

                if (error instanceof Error) {
                    throw ApiError.internal(error.message);
                }

                throw ApiError.internal("Unknown error");
            }
        }

        let resenha = "";
        const tiposcomResenha = ["poema", "cronica"];

        try {
            if (tiposcomResenha.includes(newstype)) {
                resenha = await gerarResenhaJornal(body);
            }
        } catch (error) {
            throw error;
        }

        try {
            return await NewsModel.createNews(
                title,
                tiposcomResenha.includes(newstype) ? resenha : summary,
                body,
                author,
                newstype,
                urlFiles,
            );
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw ApiError.internal(error.message);
            } else {
                throw ApiError.internal("Erro desconhecido");
            }
        }
    }

    public static async getAllNews() {
        try {
            return await NewsModel.getAllNews();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error; // mantém status e mensagem
            }

            if (error instanceof Error) {
                throw ApiError.internal(error.message);
            }

            throw ApiError.internal("Unknown error");
        }
    }

    public static async getNewsById(id: string) {
        try {
            const news = await NewsModel.getById(id);
            if (!news) {
                throw ApiError.notFound("Notícia com id " + id + " não encontrada");
            }
            return news;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error; // mantém status e mensagem
            }

            if (error instanceof Error) {
                throw ApiError.internal(error.message);
            }

            throw ApiError.internal("Unknown error");
        }
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
            return await NewsModel.updateNews(id, title, summary, body, author, newstype);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error; // mantém status e mensagem
            }

            if (error instanceof Error) {
                throw ApiError.internal(error.message);
            }

            throw ApiError.internal("Unknown error");
        }
    }

    public static async likenews(id: string, action: "like" | "unlike") {
        try {
            return await NewsModel.likenews(id, action);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error; // mantém status e mensagem
            }

            if (error instanceof Error) {
                throw ApiError.internal(error.message);
            }

            throw ApiError.internal("Unknown error");
        }
    }

    public static async deleteNews(id: string) {
        try {
            const news = await NewsModel.getById(id);
            if (!news) {
                throw ApiError.notFound("Notícia com id " + id + " não encontrada");
            }
            return await NewsModel.deleteNews(id);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error; // mantém status e mensagem
            }

            if (error instanceof Error) {
                throw ApiError.internal(error.message);
            }

            throw ApiError.internal("Unknown error");
        }
    }
}
