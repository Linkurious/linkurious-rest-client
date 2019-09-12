/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-12.
 */

// TS2019-DONE

import {IDataSourceParams} from './DataSource';

export interface ISetAccessRightsParams extends IDataSourceParams {
  groupId: number;
  type: string;
  targetType: string;
  targetItemType?: string;
  targetName: string;
}

export interface IUpdateAccessRightsSettingsParams extends IDataSourceParams {
  propertyKeyAccessRights: boolean;
}
