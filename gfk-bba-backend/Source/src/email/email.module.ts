import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [],
})
export class EmailModule {}
