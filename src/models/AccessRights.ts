/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-12.
 */

// TS2019-DONE

import {IDataSourceParams} from './DataSource';

type AccessRightType = 'read' | 'write' | 'edit' | 'do' | 'none';

export enum TargetType {
  NODE_CATEGORY = 'nodeCategory',
  EDGE_TYPE = 'edgeType',
  NODE_PROPERTY_KEY = 'nodePropertyKey',
  EDGE_PROPERTY_KEY = 'edgePropertyKey',
  ACTION = 'action',
  ALERT = 'alert'
}

export interface ISetAccessRightsParams extends IDataSourceParams {
  groupId: number;
  type: AccessRightType;
  targetType: TargetType;
  targetItemType?: string;
  targetName: string;
}

// Examples:
//
// NODE_PROPERTY_KEY access right type:
// {
//   groupId: 10,
//   type: 'read',
//   targetType: TargetType.NODE_PROPERTY_KEY,
//   targetItemType: 'Person',
//   targetName: 'name'
// }
//
// NODE_CATEGORY access right type:
// {
//   groupId: 10,
//   type: 'read',
//   targetType: TargetType.NODE_CATEGORY,
//   targetName: 'Person'
// }

export interface IUpdateAccessRightsSettingsParams extends IDataSourceParams {
  propertyKeyAccessRights: boolean;
}
