import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import * as ejs from 'ejs'
import * as path from 'path'
const Mailjet = require('node-mailjet');


@Injectable()

export class MailerService{
    private client: any

    constructor(){
        this.client = Mailjet.apiConnect(
            process.env.API_KEY!,
            process.env.SECRET_KEY!
        )
    }
    async sendVerificationEmail(to:string,token:string){
        const verificationUrl = `http://localhost:8000/auth/verify-email?token=${token}`;
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
