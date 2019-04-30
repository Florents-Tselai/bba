import { Injectable } from '@nestjs/common';
import * as logger from '../shared/logger';

@Injectable()
export class EmailService {
  constructor() {}

  public sendEmail(emailOfUser: string, newPassword: string) {
    logger.log('EmailService.sendEmail', emailOfUser);

    const sgMail = require('@sendgrid/mail');

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: emailOfUser,
      from: process.env.SENDGRID_EMAIL_SENDER,
      subject: 'Password reset for GfK BBA',
      text: `Your new password is ${newPassword}`,
      html: `Your new password is ${newPassword}`,
    };
    sgMail.send(msg);
  }
}
