import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { AuthModule } from '../shared/auth/auth.module';
import { CouponModule } from '../coupon/coupon.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), AuthModule, CouponModule],
  providers: [PaymentService],
  controllers: [],
  exports: [PaymentService],
})
export class PaymentModule {}
