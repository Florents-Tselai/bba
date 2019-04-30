import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponService } from '../coupon/coupon.service';
import { Payment } from './payment.entity';
import * as logger from '../shared/logger';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly couponService: CouponService,
  ) {}

  /**
   * Speichert ein Payment (per coupon) und invalidiert auch den Coupon
   * @param documentId Die ID des Dokuments zu dem die Zahlung gehört
   * @param couponCode Der Code des Coupons, der benutzt wird
   */
  async storeCouponPayment(
    documentId: number,
    couponCode: string,
  ): Promise<Payment> {
    logger.log(
      `PaymentService.storeCouponPayment(${documentId}, ${couponCode})`,
    );

    if (!documentId) {
      throw new HttpException(
        'documentId missing in PaymentService.storeCouponPayment',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    if (!couponCode) {
      throw new HttpException(
        'couponCode missing in PaymentService.storeCouponPayment',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const couponPayment = new Payment();
    couponPayment.documentId = documentId;
    couponPayment.couponCode = couponCode;
    couponPayment.type = 'COUPON';
    couponPayment.createdAt = new Date();

    logger.log(
      'PaymentService.storeCouponPayment - couponPayment',
      couponPayment,
    );

    const result = await this.paymentRepository.save(couponPayment);
    logger.log('PaymentService.storeCouponPayment - savedPayment', result);

    await this.couponService.use(couponCode);
    logger.log(
      'PaymentService.storeCouponPayment - coupon was invalidated',
      couponCode,
    );

    return result;
  }

  /**
   * Speichert ein Payment (documents)
   * @param userId Der Benutzer, der das Dokument angelegt werden soll
   * @param documentDto Die Daten des anzulegenden Dokuments
   */
  async storePayPalPayment(
    documentId: number,
    paypalReceipt: string,
  ): Promise<Payment> {
    logger.log('PaymentService.storePayPalPayment', documentId, paypalReceipt);

    if (!documentId) {
      throw new HttpException(
        'documentId missing in PaymentService.storePayPalPayment',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    if (!paypalReceipt) {
      throw new HttpException(
        'paypalReceipt missing in PaymentService.storePayPalPayment',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const paypalPayment = new Payment();
    paypalPayment.documentId = documentId;
    paypalPayment.paypalReceipt = paypalReceipt;
    paypalPayment.type = 'PAYPAL';
    paypalPayment.createdAt = new Date();

    logger.log(
      'PaymentService.storePayPalPayment - paypalPayment',
      paypalPayment,
    );

    const result = await this.paymentRepository.save(paypalPayment);
    logger.log('PaymentService.storePayPalPayment - savedPayment', result);

    return result;
  }
}
