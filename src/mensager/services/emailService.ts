import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

interface EmailOptions {
  to: string;
  subject: string;
  templateName: string;
  context: Record<string, any>;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true se usar porta 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS 
  },
});

export async function sendEmail({
  to,
  subject,
  templateName,
  context,
}: EmailOptions) {
  try {
    // Caminho absoluto e estável (independente de build ou prisma)
    const templatePath = path.resolve(
      process.cwd(),
      "src",
      "mensager",
      "templates",
      `${templateName}.hbs`
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template não encontrado em: ${templatePath}`);
    }

    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateSource);
    const html = template(context);

    const info = await transporter.sendMail({
      from: `"Teresa" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email enviado para ${to}`);
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw new Error("Falha ao enviar email");
  }
}
