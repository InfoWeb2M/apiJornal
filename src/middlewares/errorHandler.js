import { AppError } from "./AppError.js";

/**
 * Middleware global de tratamento e logging de erros.
 * 
 * - Faz logging estruturado com tempo de resposta, método, status e mensagem.
 * - Diferencia erros de aplicação, de banco, de upload e genéricos.
 * - Oculta detalhes sensíveis em produção.
 */
export function errorHandler(error, request, reply) {
  const isDev = process.env.NODE_ENV !== "production";

  // 🕒 Cálculo de tempo de resposta (se registrado no request)
  const diff = request.startTime
    ? process.hrtime(request.startTime)
    : [0, 0];
  const durationMs = (diff[0] * 1e9 + diff[1]) / 1e6;

  // 🧾 Montagem do log básico
  const logData = {
    method: request.method,
    url: request.url,
    status: reply.statusCode || 500,
    durationMs: durationMs.toFixed(2),
    message: error.message,
    stack: isDev ? error.stack : undefined,
  };

  // 🔹 Logging formatado no console (dev) ou via Fastify logger (prod)
  if (isDev) {
    const colors = {
      red: "\x1b[31m",
      yellow: "\x1b[33m",
      green: "\x1b[32m",
      cyan: "\x1b[36m",
      reset: "\x1b[0m",
    };

    const color =
      logData.status >= 500
        ? colors.red
        : logData.status >= 400
        ? colors.yellow
        : colors.green;

    console.error(
      `${color}[${logData.status}]${colors.reset} ${request.method} ${request.url} (${logData.durationMs}ms) → ${error.message}`
    );

    if (isDev && error.stack) {
      console.error(`${colors.cyan}${error.stack}${colors.reset}`);
    }
  } else {
    request.log.error(logData);
  }

  // 🔹 Erros conhecidos (controlados)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        message: error.message,
        details: error.details || null,
      },
    });
  }

  // 🔹 Erros de upload ou multipart
  if (error.code === "FST_ERR_MULTIPART_INVALID_FIELD") {
    return reply.status(400).send({
      success: false,
      error: { message: "Campos de upload inválidos" },
    });
  }

  // 🔹 Erros de banco ou conexão externa
  if (error.message?.match(/(connection|timeout|supabase|database)/i)) {
    return reply.status(503).send({
      success: false,
      error: { message: "Serviço temporariamente indisponível. Tente novamente mais tarde." },
    });
  }

  // 🔹 Fallback genérico
  return reply.status(500).send({
    success: false,
    error: {
      message: "Erro interno no servidor",
      ...(isDev && { devMessage: error.message }),
    },
  });
}
