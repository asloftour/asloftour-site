import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function createTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      : undefined
  });
}

export async function sendEmail({ to, subject, html }: { to: string | string[]; subject: string; html: string }) {
  const from = process.env.EMAIL_FROM || 'AS LOF TOUR <asloftour@gmail.com>';

  if (resend) {
    await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html
    });
    return;
  }

  const transport = createTransport();
  if (!transport) {
    console.warn('Email provider is not configured. Skipping email dispatch.');
    return;
  }

  await transport.sendMail({ from, to, subject, html });
}
