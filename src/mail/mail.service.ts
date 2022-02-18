import * as nodemailer from 'nodemailer';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}
  async sendVerificationEmail(email: string, code: number): Promise<boolean> {
    const emailSender = nodemailer.createTransport({
      service: 'Gmail',
      port: 587,
      host: 'smtp.gmail.com',
      secure: true,
      requireTLS: true,
      auth: {
        user: this.options.gmailId,
        pass: this.options.gmailPW,
      },
      // 서명받지 않은 사이트의 요청도 받음
      tls: {
        rejectUnauthorized: false,
      },
    });
    const emailTemplate = `
    <html>

    <head>
    </head>
    
    <body>
        <div class="wrap">
            <p class="info_text">💡 어서와 우리집 인증코드 입니다</p>
            <div class="info_code">
                인증코드 : ${code}
            </div>
        </div>
    </body>
    
    </html>
    `;
    const mailOptions = {
      to: email,
      subject: '어서와 우리집 인증코드',
      html: emailTemplate,
    };

    try {
      emailSender.sendMail(mailOptions, (error, info) => {
        if (error) {
          return error;
        } else {
          console.log('success');
        }
        emailSender.close();
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
