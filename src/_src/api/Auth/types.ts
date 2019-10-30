/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import { GenericObject } from '../commonTypes';
import {IFullUser} from '../User/types';

// Login
export interface ILoginParams {
  usernameOrEmail: string;
  password: string;
}

export interface ISSOLoginParams {
  code: string;
  state: string;
}

export interface IUpdateMeParams {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  preferences?: GenericObject<unknown>;
}
