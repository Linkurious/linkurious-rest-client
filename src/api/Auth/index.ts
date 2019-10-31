/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';
import {FullUser} from '../User';

import {ILoginParams, ISSOLoginParams, IUpdateMeParams} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN} = LkErrorKey;

export class AuthAPI extends Request {
  public async login(params: ILoginParams) {
    if (this.props.clientState.user) {
      const response = await this.logout();
      if (response.isAnyError()) {
        console.log('It was not possible to log out previous user: ' + JSON.stringify(response));
      }
    }
    const response = await this.handle().request<FullUser>({
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

  public SSOLogin(params: ISSOLoginParams) {
    return this.request<boolean>({
      url: '/auth/sso/return',
      method: 'GET',
      params: params
    });
  }

  /**
   * Check if the user is authenticated.
   */
  public isAuthenticated() {
    return this.request<boolean>({
      url: '/auth/authenticated',
      method: 'GET'
    });
  }

  /**
   * Check if the user is authenticated.
   */
  public getMe() {
    return this.request<boolean>({
      url: '/auth/authenticated',
      method: 'GET'
    });
  }

  /**
   * Update the current user connected.
   */
  public async updateMe(params: IUpdateMeParams) {
    const response = await this.handle(UNAUTHORIZED, FORBIDDEN).request<FullUser>({
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
