/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */
import {IUserPreferences} from '../User';

export interface ILoginParams {
  usernameOrEmail: string;
  password: string;
}

export interface ILoginOAuth2Params {
  code: string;
  state: string;
}

export interface ISetupAuthenticationParams {
  username: string;
  email: string;
  password: string;
  license: string;
}

export interface IUpdateCurrentUserParams {
  username?: string;
  email?: string;
  password?: string;
  preferences?: Partial<IUserPreferences>;
}
