/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-08-04.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {ICreateSpaceParams, ISpace} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN} = LkErrorKey;

export class SpacesAPI extends Request {
  /**
   * Create a new space.
   */
  public createSpace(this: Request<ISpace>, params: ICreateSpaceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/spaces',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get spaces list.
   */
  public getSpacesList(this: Request<ISpace[]>) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/spaces',
      method: 'GET'
    });
  }
}
