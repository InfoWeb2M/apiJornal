import { validateUser } from "../services/login.service.js";

class LoginController {
  async post(req, reply) {
    const { username, password } = req.body;

    if (!username || !password) {
      return reply.status(400).send({
        message: "Envie username e password",
      });
    }

    try {
      const token = await validateUser(username, password);

      if (!token) {
        return reply.status(401).send({
          message: "Credenciais incorretas",
        });
      }

      return reply.status(200).send({ token });
    } catch (err) {
      console.error("Erro no login:", err);
      return reply.status(500).send({
        error: "Erro interno no login",
      });
    }
  }
}

export default LoginController;
