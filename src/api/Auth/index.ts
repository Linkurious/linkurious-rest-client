/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';
import {User} from '../User';

import {ILoginParams, IUpdateCurrentUserParams} from './types';

export * from './types';

const {UNAUTHORIZED, GUEST_DISABLED, FORBIDDEN, USER_EXISTS} = LkErrorKey;

export class AuthAPI extends Request {
  /**
   * Log a user in by e-mail or username and password and return it.
   */
  public async login(params: ILoginParams) {
    if (this.props.clientState.user) {
      this.props.clientState.user = undefined;
    }
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
   * Redirect the user to the OAuth2 or SAML2 provider for authorization.
   */
  public async loginSSO() {
    return this.request<never>({
      url: '/auth/sso/login',
      method: 'GET'
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
    this.props.clientState.user = undefined;
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
    const response = await this.handle(UNAUTHORIZED, FORBIDDEN, USER_EXISTS).request<User>({
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
