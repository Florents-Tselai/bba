import { Injectable } from '@nestjs/common';
import * as logger from '../logger';

@Injectable()
export class UserDataService {
  constructor() { }

  getUserData(requestData: any) {
    const DEFAULT_USER_ID = 1; // TODO remove fallback when JWT is working in the frontend
    const hasUserData = requestData && requestData.user && requestData.user.id;

    logger.log('UserDataService.getUserData - hasUserData', hasUserData);

    return hasUserData ? requestData.user.id : DEFAULT_USER_ID;
  }

}
