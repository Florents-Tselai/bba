import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';
import * as logger from '../shared/logger';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async validate(couponCode: string): Promise<boolean> {
    const coupon = await this.findUnusedCoupon(couponCode);

    logger.log(
      `CouponService.validate - coupon with code ${couponCode}`,
      coupon,
    );

    return !!coupon;
  }

  /**
   * Markiert einen Coupon als benutzt (falls dieser exisitiert und unbenutzt ist)
   * @param couponCode Der Code des Coupon, der invalidiert werden soll (siehe coupons.code in der DB)
   * @returns true, falls der Coupon als benutzt markiert werden konnte, ansonsten false
   */
  async use(couponCode: string): Promise<boolean> {
    let result = false;
    const coupon = await this.findUnusedCoupon(couponCode);

    if (coupon) {
      await this.couponRepository.update(coupon.id, { usedAt: new Date() });
      result = true;
    } else {
      logger.log(
        `CouponService.use - ERROR - no unused coupon with code ${couponCode} was found`,
      );
    }

    return result;
  }

  // --------------------------------------------------------------------------------------

  private async findUnusedCoupon(couponCode: string) {
    const coupon = await this.couponRepository.findOne({
      code: couponCode,
      usedAt: null,
    });

    logger.log(
      `CouponService.findUnusedCoupon - unused coupon with code ${couponCode} found?`,
      !!coupon,
    );

    return coupon;
  }
}
