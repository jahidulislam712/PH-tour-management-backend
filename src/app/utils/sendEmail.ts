import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import path from "path"
import ejs from 'ejs';

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: false, // Start unencrypted, upgrade via STARTTLS
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

interface sendEmailOptions{
  to: string;
  subject: string;
  templateName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData?: Record<string, any>;
  attachments?:{
    filename: string,
    content: string | Buffer,
    contentType: string
  }[]
}

export const sendEmail = async ( {
  to,
  subject,
  templateName,
  templateData,
  attachments
}: sendEmailOptions) => {
  try {

    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
    const html = await ejs.renderFile(templatePath, templateData)

    await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM, // Visible From: header
      to, // Visible To: header
      subject,
      html,
      attachments: attachments?.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      }))
    });

  } catch (error) {
    console.log(error);
  }
};
