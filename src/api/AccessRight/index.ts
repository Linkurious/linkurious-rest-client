/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-27.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {ISetAccessRightsParams, IUpdateAccessRightsSettingsParams} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  FORBIDDEN,
  NOT_FOUND,
  PROPERTY_KEY_ACCESS_RIGHTS_REQUIRED,
  INVALID_PROPERTY_KEY_ACCESS_LEVEL,
  PROPERTY_KEY_ACCESS_RIGHTS_REQUIRES_STRICT_SCHEMA
} = LkErrorKey;

export class AccessRightAPI extends Request {
  /**
   * Set access rights on a group. The access rights will be checked to be of node categories or edge types in the schema.
   */
  public setAccessRights(params: ISetAccessRightsParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      NOT_FOUND,
      PROPERTY_KEY_ACCESS_RIGHTS_REQUIRED,
      INVALID_PROPERTY_KEY_ACCESS_LEVEL
    ).request({
      url: '/admin/:sourceKey/groups/:id/access_rights',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Update the access rights settings of the data-source.
   */
  public async updateAccessRightsSettings(params: IUpdateAccessRightsSettingsParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      PROPERTY_KEY_ACCESS_RIGHTS_REQUIRES_STRICT_SCHEMA
    ).request({
      url: '/admin/:sourceKey/accessRights/settings',
      method: 'PATCH',
      params: params
    });
  }
}
