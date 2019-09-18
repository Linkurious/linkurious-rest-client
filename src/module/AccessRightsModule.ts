/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-12.
 */

// TS2019-DONE

import {DataSourceUnavailable, Forbidden, Success, Unauthorized} from '../../index';
import {ISetAccessRightsParams, IUpdateAccessRightsSettingsParams} from '../models/AccessRights';
import {
  InvalidPropertyAccessLevel,
  PropertyKeyAccessRightRequired,
  StrictSchemaRequired
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
    | PropertyKeyAccessRightRequired
    | InvalidPropertyAccessLevel
  > {
    return this.request({
      url: '/api/admin/{sourceKey}/groups/{groupId}/access_rights',
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
    Success<void> | Unauthorized | Forbidden | DataSourceUnavailable | StrictSchemaRequired
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
