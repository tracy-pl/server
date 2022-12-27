import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  public nodemailerTransport: Mail;
  constructor(
    private configService: ConfigService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {
    const options = {
      // service: configService.get('emailConstants.emailService'),
      auth: {
        user: configService.get('email.user'),
        pass: configService.get('email.password'),
      },
      port: configService.get('email.port'),
      host: configService.get('email.host'),
      secure: configService.get('email.secure'),
    };

    this.nodemailerTransport = createTransport(options);
  }

  async sendMail(emailData: Mail.Options): Promise<void> {
    await this.emailQueue.add(emailData);
    return;
  }
}
