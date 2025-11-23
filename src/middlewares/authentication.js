export async function auth(req, reply) {
  try {
    const token = req.cookies.token; // pega o cookie HttpOnly
    if (!token) return reply.status(401).send({ message: 'Não autenticado' });

    await req.jwtVerify(token); // verifica JWT
  } catch (err) {
    reply.status(401).send({ message: 'Token inválido' });
  }
}
