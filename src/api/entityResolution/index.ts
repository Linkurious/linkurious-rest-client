/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-07-29.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {IDataSourceParams} from '../commonTypes';

import {EntityResolutionStatus} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, ILLEGAL_SOURCE_STATE} = LkErrorKey;

export class EntityResolutionAPI extends Request {
  /**
   * Start entity resolution on a given data-source.
   */
  startEntityResolution(params: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, ILLEGAL_SOURCE_STATE],
      url: '/:sourceKey/entityResolution',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get the status of entity resolution, for a given data-source.
   */
  getEntityResolutionStatus(this: Request<EntityResolutionStatus>, params: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/entityResolution',
      method: 'GET',
      params: params
    });
  }
}
