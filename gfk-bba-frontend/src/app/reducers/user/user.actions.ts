import { ApiPostRequest, generateAsyncActionNames } from '@gfk/ngx-tools';
import { UserRequest } from './types';

export const userCreateActionNames = generateAsyncActionNames('[User] Create');

export class UserCreate extends ApiPostRequest {
  constructor(user: UserRequest) {
    super('users', userCreateActionNames.base, user);
  }
}
