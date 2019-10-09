/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-27.
 */

// TS2019-DONE

import {IDataSourceParams} from './DataSource';

/**
 * Available to custom groups.
 */
export enum UserAction {
  CONNECT = 'admin.connect', // Connect the data-source and read the configuration
  INDEX = 'admin.index', // Index the data-source and read the configuration
  MANAGE_USERS = 'admin.users', // Manage the users in the data-source
  MANAGE_SCHEMA = 'admin.schema', // Edit the schema of the data-source
  CREATE_ALERTS = 'admin.alerts', // Manage the alerts in the data-source
  DOWNLOAD_REPORT = 'admin.report', // Generate analytics report
  EDIT_STYLES = 'admin.styles', // Edit styles and captions of all sandboxes of the data-source
  RUN_QUERY = 'runQuery', // Execute a saved query
  CREATE_READ_QUERY = 'rawReadQuery', // Create a read query
  CREATE_WRITE_QUERY = 'rawWriteQuery', // Create a read/write query
  RUN_CUSTOM_ACTION = 'runCustomAction', // Execute a custom action
  CREATE_CUSTOM_ACTION = 'writeCustomAction' // Edit, update and delete a custom action
}

/**
 * Only for the built-in admin group.
 */
export enum AdminAction {
  MANAGE_APPLICATIONS = 'admin.app', // Create API Keys
  DELETE_USERS = 'admin.users.delete', // Delete users
  EDIT_CONFIGURATION = 'admin.config' // Edit the configuration of Linkurious
}

export type Action = AdminAction | UserAction;

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

export interface IGenericAccessRight<TT extends TargetType> {
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
  targetName: UserAction;
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
