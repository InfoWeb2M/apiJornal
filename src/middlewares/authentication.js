export async function auth(req, reply) {
  const token = req.cookies.token;

  if (!token) {
    return reply.status(401).send({ Forbidden: "Token ausente" });
  }

  try {
    const decoded = await req.jwtVerify(token);
    req.user = decoded;
  } catch (err) {
    return reply.status(401).send({ Forbidden: "Token inválido" });
  }
}
