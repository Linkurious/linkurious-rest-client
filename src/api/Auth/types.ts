/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */
import {UserPreferences} from '../User';

export interface ILoginParams {
  usernameOrEmail: string;
  password: string;
}

export interface IUpdateCurrentUserParams {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  preferences?: Partial<UserPreferences>;
}
