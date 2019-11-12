/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {IGetConfigParams, Configuration, IUpdateConfigParams} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN} = LkErrorKey;

export class ConfigAPI extends Request {
  /**
   * Get the configuration of Linkurious.
   */
  public getConfiguration(params?: IGetConfigParams) {
    return this.request<Configuration>({
      url: '/config',
      method: 'GET',
      params: params
    });
  }

  /**
   * Update Linkurious configuration.
   */
  public updateConfiguration(params: IUpdateConfigParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/config',
      method: 'POST',
      params: params
    });
  }
}