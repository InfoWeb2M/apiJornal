export async function auth(req, reply) {
  try {
    await req.jwtVerify(); // AGORA ele vai ler do cookie!
  } catch (err) {
    reply.status(401).send({ message: "Unauthorized" });
  }
}
