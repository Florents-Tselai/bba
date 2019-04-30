import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Res,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import * as logger from '../logger';
import { UserDataService } from './user-data.service';
import { UserService } from '../../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly userDataService: UserDataService,
  ) {}

  @Post('token')
  async createToken(@Body() userDto: UserDto) {
    logger.log('createToken - userDto', userDto);

    // wir bekommen sowas:
    // { email: 'bla@fasel.de', password: 'meinKennwort' }

    const validUser = await this.userService.validateUserLogin(userDto);

    if (!validUser) {
      throw new HttpException('Unknown user', HttpStatus.FORBIDDEN);
    }

    const tokenData = await this.authService.createToken(userDto.email);

    await this.userService.setToken(userDto.email, tokenData.accessToken);
    return tokenData;
  }

  /* Zugriff z.B so ...

  curl -X GET \
    http://SERVER:PORT/auth/data \
    -H 'Authorization: Bearer xxx' \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'Postman-Token: a7345489-1d17-4f4f-a41a-9d1f93500842'
  */

  // This route is restricted by AuthGuard
  // JWT strategy
  @Get('data')
  @UseGuards(AuthGuard())
  getUserData(@Req() requestData) {
    const userId = this.userDataService.getUserData(requestData);

    logger.log(
      '-----------------------------------------------------------------------------',
    );
    logger.log('user id', userId);
    logger.log(
      '-----------------------------------------------------------------------------',
    );

    return `Welcome user ${userId}`;
  }
}
