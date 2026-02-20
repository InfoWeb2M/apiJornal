import { Router, type Request, type Response } from "express";
import UserModel from "../../users/models/UserModel.js";
import { sendEmail } from "../services/emailService.js";

const webhook = Router();

webhook.post("/webhook/news", async (req: Request, res: Response) => {
  try {
    const { title, content, newstype } = req.body;

    const users = await UserModel.getAllUsers()

    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    // Envia email para cada usuário
    await Promise.all(users.map((user =>
      sendEmail({
        to: user.email,
        subject: `Nova ${newstype}: ${title}`,
        templateName: "news",
        context: { name: user.firstName, newstype ,title, content }
      })
    )));

    return res.status(200).json({ status: "emails enviados" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao enviar emails" });
  }
});

export default webhook;
