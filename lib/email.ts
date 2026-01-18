import nodemailer from "nodemailer";

const transporter = nodemailer.createTransporter({
  host: process.env.ETHEREAL_HOST,
  port: parseInt(process.env.ETHEREAL_PORT!),
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, body: string) {
  await transporter.sendMail({
    from: process.env.ETHEREAL_USER,
    to,
    subject,
    html: body,
  });
}