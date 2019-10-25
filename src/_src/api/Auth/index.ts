/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */
import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {ILoginParams, ILoginResponse} from './types';

const {INVALID_PARAMETER, UNAUTHORIZED} = LkErrorKey;

export class AuthAPI extends Request {
  async login(params: ILoginParams) {
    if (this.props.clientState.user) {
      const response = await this.logout();
      if (response.isAnyError) {
        throw new Error(
          'It was not possible to log out previous user: ' + JSON.stringify(response)
        );
      }
    }
    const response = await this.handle(INVALID_PARAMETER).request<ILoginResponse>({
      url: '/auth/login',
      method: 'POST',
      params: params
    });
    if (response.isSuccess()) {
      this.props.clientState.user = response.body;
    }
    return response;
  }

  // I think if you logout without being logged in, it throws an error,
  // if so, we should add that error to be handled here
  async logout() {
    const response = await this.handle(UNAUTHORIZED).request({
      url: '/auth/logout',
      method: 'GET'
    });
    if (response.isSuccess()) {
      this.props.clientState.user = undefined;
    }
    return response;
  }
}
