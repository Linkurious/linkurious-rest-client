/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import {} from '../commonTypes';
import {IFullUser} from '../User/types';

// Login
export interface ILoginParams {
  usernameOrEmail: string;
  password: string;
}

export type ILoginResponse = IFullUser;
