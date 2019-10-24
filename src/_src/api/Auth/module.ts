/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

// TS2019-DONE

import {
  InvalidParameter,
  Forbidden,
  Unauthorized
} from '../../response/errors';
import {Success} from '../../response/success';
import {Module} from '../Module';

import {
  ILoginParams,
  ILoginResponse
} from './types';

export class AuthModule extends Module {
  async login(
    params: ILoginParams
  ): Promise<Success<ILoginResponse> | InvalidParameter> {
    const config: {url: string; method: 'POST'; body: any} = {
      url: '/auth/login',
      method: 'POST',
      body: data
    };

    if (this._clientState.user) {
      return this.logout()
        .then(() => {
          return this._fetcher.fetch(config);
        })
        .then((res: any) => {
          this._clientState.user = res;
          return this._clientState.user;
        });
    } else {
      return this._fetcher.fetch(config).then((res: any) => {
        this._clientState.user = res;
        return this._clientState.user;
      });
    }
    return this.request({
      url: '/auth/login',
      method: 'POST',
      params: params
    });
  }

  async (
    params:
  ): Promise<Success<> | InvalidParameter> { // Remove InvalidParameter
    return this.request({
      url: '',
      method: '',
      params: params
    });
  }
  async (
    params:
  ): Promise<Success<> | InvalidParameter> { // Remove InvalidParameter
    return this.request({
      url: '',
      method: '',
      params: params
    });
  }
  async (
    params:
  ): Promise<Success<> | InvalidParameter> { // Remove InvalidParameter
    return this.request({
      url: '',
      method: '',
      params: params
    });
  }
  async (
    params:
  ): Promise<Success<> | InvalidParameter> { // Remove InvalidParameter
    return this.request({
      url: '',
      method: '',
      params: params
    });
  }
  async (
    params:
  ): Promise<Success<> | InvalidParameter> { // Remove InvalidParameter
    return this.request({
      url: '',
      method: '',
      params: params
    });
  }
  async (
    params:
  ): Promise<Success<> | InvalidParameter> { // Remove InvalidParameter
    return this.request({
      url: '',
      method: '',
      params: params
    });
  }
  async (
    params:
  ): Promise<Success<> | InvalidParameter> { // Remove InvalidParameter
    return this.request({
      url: '',
      method: '',
      params: params
    });
  }
}
