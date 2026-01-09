/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {Configuration, IDatabaseOptions, IGetConfigParams, IUpdateConfigParams} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN, INVALID_PARAMETER, ILLEGAL_SOURCE_STATE} = LkErrorKey;

export class ConfigAPI extends Request {
  /**
   * Get the configuration of Linkurious.
   */
  public getConfiguration(this: Request<Configuration>, params?: IGetConfigParams) {
    return this.request({
      url: '/config',
      method: 'GET',
      params: params
    });
  }

  /**
   * Update Linkurious configuration.
   */
  public updateConfiguration(params: IUpdateConfigParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, INVALID_PARAMETER, ILLEGAL_SOURCE_STATE],
      url: '/config',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get the database dialect configured in Linkurious, only available for admins.
   * Useful for e2e tests.
   */
  public getDbDialect(this: Request<IDatabaseOptions['dialect']>) {
    return this.request({
      errors: [UNAUTHORIZED],
      url: '/config/db-dialect',
      method: 'GET'
    });
  }
}
