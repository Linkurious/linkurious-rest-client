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
  STRICT_SCHEMA_REQUIRED
} = LkErrorKey;

export class AccessRightAPI extends Request {
  /**
   * Set access rights on a group. The access rights will be checked to be of node categories or edge types in the schema.
   */
  public setAccessRights(params: ISetAccessRightsParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        PROPERTY_KEY_ACCESS_RIGHTS_REQUIRED,
        INVALID_PROPERTY_KEY_ACCESS_LEVEL
      ],
      url: '/admin/:sourceKey/groups/:id/access_rights',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Update the access rights settings of the data-source.
   */
  public async updateAccessRightsSettings(params: IUpdateAccessRightsSettingsParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, STRICT_SCHEMA_REQUIRED],
      url: '/admin/:sourceKey/accessRights/settings',
      method: 'PATCH',
      params: params
    });
  }
}
