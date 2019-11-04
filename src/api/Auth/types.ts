/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */
import {UserPreferences, User} from '../User';

export interface ILoginParams {
  usernameOrEmail: string;
  password: string;
}

export type LoginResponse = User;

export type GetCurrentUserResponse = User;

export interface IUpdateCurrentUserParams {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  preferences?: Partial<UserPreferences>;
}

export type UpdateCurrentUserResponse = User;
