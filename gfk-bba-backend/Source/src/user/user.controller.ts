import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as logger from '../shared/logger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* Post-Aufruf, z.B. 
    curl -X POST \
      http://SERVER:PORT/users \
      -H 'Cache-Control: no-cache' \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      -H 'Postman-Token: a201bcd4-6f62-47b8-827e-652965432fe3' \
      -d 'email=testemail@test.com&password=password'
  */

  @Post()
  async createUser(@Body() userDto: UserDto): Promise<any> {
    logger.log('UserController.createUser - userDto', userDto);

    // wir bekommen sowas (hoffentlich)
    // {email: 'bla@fasel.de'
    // password: "212121"}

    const existingUser = await this.userService.findByEmail(userDto.email);

    if (existingUser) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const savedUser = await this.userService.createUser(
      userDto.email,
      userDto.password,
    );

    logger.log('UserController.createUser  - savedUser', savedUser);
    logger.log('UserController.createUser - done');

    return savedUser;
  }
}
