import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CouponModule } from './coupon/coupon.module';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './shared/auth/auth.module';
import { DocumentModule } from './document/document.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { ContractModule } from './contract/contract.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    CouponModule,
    ProjectModule,
    ContractModule,
    DocumentModule,
    UserModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
