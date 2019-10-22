/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-27.
 */

// TS2019-DONE

import {DataSourceUnavailable, Forbidden, Success, Unauthorized} from '../../index';
import {ISetAccessRightsParams, IUpdateAccessRightsSettingsParams} from '../models/AccessRights';
import {
  PropertyKeyAccessRightsRequiresStrictSchema,
  InvalidPropertyKeyAccessLevel,
  PropertyKeyAccessRightsRequired
} from '../response/errors';

import {Module} from './Module';

export class AccessRightsModule extends Module {
  public async setAccessRights(
    options: ISetAccessRightsParams
  ): Promise<
    | Success<void>
    | Unauthorized
    | Forbidden
    | DataSourceUnavailable
    | InvalidPropertyKeyAccessLevel
    | PropertyKeyAccessRightsRequired
  > {
    return this.request({
      url: '/admin/{sourceKey}/groups/{groupId}/access_rights',
      method: 'PUT',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        groupId: options.groupId
      }
    });
  }

  public async updateAccessRightsSettings(
    options: IUpdateAccessRightsSettingsParams
  ): Promise<
    | Success<void>
    | Unauthorized
    | Forbidden
    | DataSourceUnavailable
    | PropertyKeyAccessRightsRequiresStrictSchema
  > {
    return this.request({
      url: '/admin/{sourceKey}/accessRights/settings',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey
      }
    });
  }
}
