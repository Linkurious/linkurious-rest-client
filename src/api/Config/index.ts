/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {IGetConfigParams, GetConfigResponse, IUpdateConfigParams} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN} = LkErrorKey;

export class ConfigAPI extends Request {
  public getConfiguration(params?: IGetConfigParams) {
    return this.request<GetConfigResponse>({
      url: '/config',
      method: 'GET',
      params: params
    });
  }

  public updateConfiguration(params: IUpdateConfigParams<any>) {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request({
      url: '/config',
      method: 'POST',
      params: params
    });
  }
}
