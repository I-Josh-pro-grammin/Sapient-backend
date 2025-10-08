import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { from } from 'rxjs';
import * as ejs from 'ejs'
import * as path from 'path'
const Mailjet = require('node-mailjet');


@Injectable()
/*export class MailerService {
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
}*/
export class MailerService{
    private client: any

    constructor(){
        this.client = Mailjet.apiConnect(
            process.env.API_KEY!,
            process.env.SECRET_KEY!
        )
    }
    async sendVerificationEmail(to:string,token:string){
        const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;
        const templatePath = path.join(__dirname,"templates","verification.ejs")
        const htmlContent = await ejs.renderFile(templatePath,{verificationUrl})
        try{
            await this.client
            .post("send",{version:'v3.1'})
            .request({
                Messages:[{
                    From:{
                         Email: "blinktechnologies125@gmail.com",
                         Name: "BlinkTechnologiz",
                    },
                    To:[{ Email:to }],
                    Subject: "Email Verification",
                     HTMLPart:htmlContent
                }]
            })
            console.log(`Verification email sent to ${to}`)
        }catch(err){
            console.error('Failed to send verification email', err)
            throw err
        }
    }
}
