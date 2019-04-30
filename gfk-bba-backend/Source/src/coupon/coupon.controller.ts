import {
  Controller,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';

import { CouponService } from './coupon.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDataService } from '../shared/auth/user-data.service';
import * as logger from '../shared/logger';

@Controller('coupons')
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly userDataService: UserDataService,
  ) {}

  /*
  curl -X GET \
    http://SERVER:PORT/coupons/Coupon-2 \
    -H 'Authorization: Bearer XXXXXXXXXXXX' \
    -H 'Cache-Control: no-cache' \
    -H 'Postman-Token: 39b60b46-f596-4780-ab7b-6bf48a6eb7e7'
  */

  /**
   * Validiert einen Coupon und gibt endweder 200 oder 422 zurück
   * Funktioniert nur wenn ein gültiges (JWT-)Bearer-Token in Header "Authorization"  übertragen wurde, ansonsten 401
   * @param idCoupon der Coupon-Code - siehe Spalte code in der Tabelle coupons
   * @param requestData Die Request-Daten - für den Zugriff auf das JWT-Token
   * @returns http-Status 201 und "OK" im Erfolgsfall
   */
  @Get(':idCoupon')
  @UseGuards(AuthGuard())
  async validateCoupon(@Param('idCoupon') idCoupon, @Req() requestData) {
    logger.log(`CouponController.useCoupon(${idCoupon})`);

    const userId = this.userDataService.getUserData(requestData);
    if (!userId) {
      logger.log(
        `CouponController.validateCoupon(${idCoupon}) - FEHLER: Keine userId`,
      );
      throw new HttpException(
        'userId missing in CouponController.validateCoupon',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const isValid = await this.couponService.validate(idCoupon);
    if (!isValid) {
      logger.log(
        `CouponController.useCoupon(${idCoupon}) - FEHLER: Coupon unbekannt oder verbraucht`,
      );
      throw new HttpException(
        `Unknown coupon code ${idCoupon}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return 'OK';
  }
}
