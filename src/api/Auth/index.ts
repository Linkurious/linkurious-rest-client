/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';
import {User} from '../User';

import {ILoginOAuth2Params, ILoginParams, IUpdateCurrentUserParams} from './types';

export * from './types';

const {UNAUTHORIZED, GUEST_DISABLED, FORBIDDEN, ALREADY_EXISTS} = LkErrorKey;

export class AuthAPI extends Request {
  /**
   * Log a user in by e-mail or username and password and return it.
   */
  public async login(params: ILoginParams) {
    delete this.props.clientState.user;
    const response = await this.handle(UNAUTHORIZED).request<User>({
      url: '/auth/login',
      method: 'POST',
      params: params
    });
    if (response.isSuccess()) {
      this.props.clientState.user = response.body;
    }
    return response;
  }

  /**
   * Log a user in via OAuth2.
   */
  public loginOAuth2(params: ILoginOAuth2Params) {
    return this.request<never>({
      url: '/auth/sso/return',
      method: 'GET',
      params: params
    });
  }

  /**
   * Log the current user out.
   */
  public async logout() {
    const response = await this.handle(UNAUTHORIZED).request({
      url: '/auth/logout',
      method: 'GET'
    });
    delete this.props.clientState.user;
    return response;
  }

  /**
   * Get the profile of the current user.
   */
  public async getCurrentUser() {
    const response = await this.handle(UNAUTHORIZED, GUEST_DISABLED).request<User>({
      url: '/auth/me',
      method: 'GET'
    });
    if (response.isSuccess()) {
      this.props.clientState.user = response.body;
    }

    return response;
  }

  /**
   * Update the current user.
   */
  public async updateCurrentUser(params: IUpdateCurrentUserParams) {
    const response = await this.handle(UNAUTHORIZED, FORBIDDEN, ALREADY_EXISTS).request<User>({
      url: '/auth/me',
      method: 'PATCH',
      params: params
    });
    if (response.isSuccess()) {
      this.props.clientState.user = response.body;
    }

    return response;
  }
}
