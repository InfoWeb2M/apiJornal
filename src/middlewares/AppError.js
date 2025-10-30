/**
 * Classe para erros controlados da aplicação.
 * Use para lançar erros de negócio (validação, regras, etc.)
 * Exemplo: throw new AppError("Notícia não encontrada", 404);
 */
export class AppError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}
