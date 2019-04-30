import { Controller, Body, Post, Get } from '@nestjs/common';
import * as logger from '../shared/logger';
import { EmailService } from './email.service';
import { UserService } from '../user/user.service';

@Controller('email')
export class EmailController {
  constructor(
    private emailService: EmailService,
    private userService: UserService,
  ) {}

  /*
  curl -X POST \
  http://SERVER:PORT/email/reset \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Postman-Token: 50e8c493-6981-4387-9a32-549a336c7907' \
  -d email=<USER_EMAIL_ID>
  */

  /**
   * Versucht das Kennwort zu einer Email-Adresse zurückzusetzen
   */
  @Post('reset')
  async resetEmail(@Body() emailDto: EmailDto): Promise<any> {
    logger.log('EmailController.resetEmail - emailDto', emailDto);

    // mal sehen ob des den Benutzer überhaupt gibt ...
    const existingUser = await this.userService.findByEmail(emailDto.email);

    // es gibt einen User mit dem Kennwort ...
    if (existingUser) {
      const newPassword = await this.userService.resetPassword(existingUser);
      this.emailService.sendEmail(emailDto.email, newPassword);
    }
  }

  @Get('test')
  async testEmail() {
    logger.log('EmailController.testEmail - start');
    this.emailService.sendEmail('testemail@test.com', 'password');
    logger.log(`EmailController.testEmail - done`);
  }
}
