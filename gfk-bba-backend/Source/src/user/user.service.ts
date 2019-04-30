import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { LoginDto } from 'shared/auth/login.dto';
import * as logger from '../shared/logger';
const md5 = require('md5');
const generator = require('generate-password');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    //
  }

  async resetPassword(user: User): Promise<string> {
    logger.log('UserService.resetPassword - user', user);
    const newPassword = this.generatePasswrd();

    // TODO
    const updatedUser = await this.userRepository.update(
      { id: user.id },
      { hashedPassword: md5(newPassword) },
    );

    logger.log('UserService.resetPassword - updated user', updatedUser);

    return newPassword;
  }

  private generatePasswrd() {
    return generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      excludeSimilarCharacters: true,
      strict: true,
    });
  }

  async createUser(email: string, password: string) {
    const user: User = new User();
    user.email = this.cleanEmailAdress(email);
    user.hashedPassword = md5(password);

    logger.log('UserService.createUser - user', user);

    const savedUser = await this.userRepository.save(user);

    logger.log('UserService.createUser - savedUser', savedUser);

    return savedUser;
  }

  async validateUserLogin(userDto: UserDto): Promise<boolean> {
    let result = false;

    if (userDto.email && userDto.password) {
      const email = this.cleanEmailAdress(userDto.email);
      const hashedPassword = md5(userDto.password);

      const listOfUsers = await this.userRepository.find({
        email,
        hashedPassword,
      });
      result = listOfUsers && listOfUsers.length > 0;
    }

    return result;
  }

  async findOneByToken(token: string): Promise<User> {
    return await this.userRepository.findOne({ token });
  }

  async findByEmail(email: string): Promise<User> {
    email = this.cleanEmailAdress(email);
    return await this.userRepository.findOne({ email });
  }

  async findByEmailAndHashedPwd(loginData: LoginDto): Promise<User> {
    if (!loginData || !loginData.email || !loginData.hashedPassword) {
      return null; // missing logindata
    }

    const email = this.cleanEmailAdress(loginData.email);

    const user = this.userRepository.findOne({
      email,
      hashedPassword: loginData.hashedPassword,
    });

    return user;
  }

  async setToken(email: any, token: string) {
    logger.log('UserService.setToken(email, token) - ', email, token);
    email = this.cleanEmailAdress(email);

    await this.userRepository.update(
      { email },
      { token, lastLogin: new Date() },
    );
  }

  /**
   * normlisiert die übergebene Emailadresse (trim + lowercase)
   * @param email die Emailadresse, die normalisiert werden soll
   * @returns die normalisierte Emailadresse (oder '' falls die Adresse falsey war)
   */
  public cleanEmailAdress(email: string): string {
    return (email || '').trim().toLowerCase();
  }
}
