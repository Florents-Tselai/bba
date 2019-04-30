import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as logger from '../logger';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async createToken(email) {
    const user: JwtPayload = { email };
    const accessToken = this.jwtService.sign(user);

    logger.log(
      `AuthService.createToken - accessToken für ${email}`,
      accessToken,
    );

    return {
      expiresIn: 3600,
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    // logger.log('AuthService.validateUser - payload = ', payload);

    let result = null;

    if (payload && payload.email) {
      // gibt es den User noch?
      const user = await this.userService.findByEmail(payload.email);

      // hat der User noch ein Token in der DB? (notwendig?)
      if (user && user.token) {
        result = { id: user.id, email: user.email };
      }
    }

    return result;
  }
}
