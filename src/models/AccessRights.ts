/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-27.
 */

// TS2019-DONE

import {IDataSourceParams} from './DataSource';

export enum ItemTypeAccessRightType {
  READ = 'read',
  EDIT = 'edit',
  WRITE = 'write',
  NONE = 'none'
}

export enum PropertyAccessRightType {
  READ = 'read',
  EDIT = 'edit',
  NONE = 'none'
}

export enum ActionAccessRightType {
  DO = 'do',
  NONE = 'none'
}

export enum AlertAccessRightType {
  READ = 'read',
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
  accessRights: Array<
    | INodeCategoryAccessRight
    | IEdgeTypeAccessRight
    | INodePropertyAccessRight
    | IEdgePropertyAccessRight
    | IActionAccessRight
    | IAlertAccessRight
  >;
}

interface IGenericAccessRight<TT extends TargetType> {
  targetType: TT; // e.g.: 'nodePropertyKey' or 'nodeCategory'
  targetName: string; // e.g.: 'dateOfBirth' or 'CITY'
  // targetItemType?: string; e.g.: 'Person' (only defined if targetType is a property)
}

export interface INodeCategoryAccessRight extends IGenericAccessRight<TargetType.NODE_CATEGORY> {
  type: ItemTypeAccessRightType;
}

export interface IEdgeTypeAccessRight extends IGenericAccessRight<TargetType.EDGE_TYPE> {
  type: ItemTypeAccessRightType;
}

export interface IActionAccessRight extends IGenericAccessRight<TargetType.ACTION> {
  type: ActionAccessRightType;
}

export interface IAlertAccessRight extends IGenericAccessRight<TargetType.ALERT> {
  type: AlertAccessRightType;
}

export interface INodePropertyAccessRight
  extends IGenericAccessRight<TargetType.NODE_PROPERTY_KEY> {
  type: PropertyAccessRightType;
  targetItemType: string; // node-category of the property (e.g. 'CITY')
}

export interface IEdgePropertyAccessRight
  extends IGenericAccessRight<TargetType.EDGE_PROPERTY_KEY> {
  type: PropertyAccessRightType;
  targetItemType: string; // edge-type of the property (e.g. 'HAS_CITY')
}

// Examples:
//
// NODE_PROPERTY_KEY access right:
// {
//   type: 'read',
//   targetType: TargetType.NODE_PROPERTY_KEY,
//   targetItemType: 'Person',
//   targetName: 'name'
// }
//
// NODE_CATEGORY access right:
// {
//   type: 'read',
//   targetType: TargetType.NODE_CATEGORY,
//   targetName: 'Person'
// }

export interface IUpdateAccessRightsSettingsParams extends IDataSourceParams {
  propertyKeyAccessRights: boolean;
}
