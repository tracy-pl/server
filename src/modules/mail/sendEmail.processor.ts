import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';

@Processor('email')
export class sendEmailConsumer {
  constructor(private mailService: MailService) {}
  @Process()
  async transcode(job: Job<unknown>): Promise<void> {
    await this.mailService.nodemailerTransport.sendMail(job.data);
    return;
  }
}
