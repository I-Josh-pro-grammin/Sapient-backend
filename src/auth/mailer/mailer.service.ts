import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    } as SMTPTransport.Options);
  }

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"Sapient" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;
    const html = `
      <p>Hello,</p>
      <p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>
      <p>If you didn't sign up for this account, please ignore this email.</p>
    `;
    await this.sendMail(to, 'Email Verification', html);
  }
}
