/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-12.
 */

// TS2019-DONE

import {IDataSourceParams} from './DataSource';

export enum AccessRightType {
  READ = 'read',
  WRITE = 'write',
  EDIT = 'edit',
  DO = 'do',
  NONE = 'none'
}

export enum TargetType {
  NODE_CATEGORY = 'nodeCategory',
  EDGE_TYPE = 'edgeType',
  NODE_PROPERTY_KEY = 'nodePropertyKey',
  EDGE_PROPERTY_KEY = 'edgePropertyKey',
  ACTION = 'action',
  ALERT = 'alert'
}

export interface ISetAccessRightsParams extends IDataSourceParams {
  groupId: number; // e.g.: 123
  type: AccessRightType; // e.g.: 'read'
  accessRights: Array<{
    type: AccessRightType; // e.g.: 'read'
    target:
      | INodeCategoryTarget
      | IEdgeTypeTarget
      | INodePropertyTarget
      | IEdgePropertyTarget
      | IActionTarget
      | IAlertTarget;
  }>;
}

interface IGenericTarget<TT extends TargetType> {
  targetType: TT; // e.g.: 'nodePropertyKey' or 'nodeCategory'
  targetName: string; // e.g.: 'dateOfBirth' or 'CITY'
  targetItemType?: string; // e.g.: 'Person' (only defined if targetType is a property)
}

export interface INodeCategoryTarget extends IGenericTarget<TargetType.NODE_CATEGORY> {
  targetItemType: undefined;
}

export interface IEdgeTypeTarget extends IGenericTarget<TargetType.EDGE_TYPE> {
  targetItemType: undefined;
}

export interface IActionTarget extends IGenericTarget<TargetType.ACTION> {
  targetItemType: undefined;
}

export interface IAlertTarget extends IGenericTarget<TargetType.ALERT> {
  targetItemType: undefined;
}

export interface INodePropertyTarget extends IGenericTarget<TargetType.NODE_PROPERTY_KEY> {
  targetItemType: string; // node-category of the property (e.g. 'CITY')
}

export interface IEdgePropertyTarget extends IGenericTarget<TargetType.EDGE_PROPERTY_KEY> {
  targetItemType: string; // edge-type of the property (e.g. 'HAS_CITY')
}

// Examples:
//
// NODE_PROPERTY_KEY access right:
// {
//   groupId: 10,
//   type: 'read',
//   targetType: TargetType.NODE_PROPERTY_KEY,
//   targetItemType: 'Person',
//   targetName: 'name'
// }
//
// NODE_CATEGORY access right:
// {
//   groupId: 10,
//   type: 'read',
//   targetType: TargetType.NODE_CATEGORY,
//   targetName: 'Person'
// }

export interface IUpdateAccessRightsSettingsParams extends IDataSourceParams {
  propertyKeyAccessRights: boolean;
}
