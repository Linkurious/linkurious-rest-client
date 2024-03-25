/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-27.
 */

import {IDataSourceParams} from '../commonTypes';

/**
 * Available to custom groups.
 */
export enum Action {
  ADMIN_CONNECT = 'admin.connect', // Connect the data-source and read the configuration
  ADMIN_INDEX = 'admin.index', // Index the data-source and read the configuration
  ADMIN_USERS = 'admin.users', // Manage the users in the data-source
  ADMIN_SCHEMA = 'admin.schema', // Edit the schema of the data-source
  ADMIN_SCHEMA_READ = 'admin.schema.read', // Read the graph schema of the data-source
  ADMIN_ALERTS = 'admin.alerts', // Manage the alerts in the data-source
  ADMIN_REPORT = 'admin.report', // Generate analytics report
  ADMIN_STYLES = 'admin.styles', // Edit styles and captions of all sandboxes of the data-source
  ADMIN_SPACES = 'admin.spaces', // Edit, update and delete a space
  RUN_QUERY = 'runQuery', // Execute a saved query
  RAW_READ_QUERY = 'rawReadQuery', // Create a read query
  RAW_WRITE_QUERY = 'rawWriteQuery', // Create a read/write query
  RUN_CUSTOM_ACTION = 'runCustomAction', // Execute a custom action
  WRITE_CUSTOM_ACTION = 'writeCustomAction', // Create a custom action, update/delete owned custom actions
  MANAGE_CUSTOM_ACTION = 'manageCustomAction' // WRITE_CUSTOM_ACTION, update/delete all non-private custom actions
}
/**
 * Only for the built-in admin group.
 */
export enum AdminAction {
  ADMIN_APP = 'admin.app', // Create API Keys
  ADMIN_USERS_DELETE = 'admin.users.delete', // Delete users
  ADMIN_CONFIG = 'admin.config', // Edit the configuration of Linkurious
  ADMIN_WEBHOOKS = 'admin.webhooks' // Manage webhooks
}

export type AnyAction = AdminAction | Action;

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
  id: number;
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
  targetName: Action;
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

export interface IBuiltinOnlyActionAccessRight extends IGenericAccessRight<TargetType.ACTION> {
  type: ActionAccessRightType;
  targetName: AdminAction;
}

export type AccessRight =
  | INodeCategoryAccessRight
  | IEdgeTypeAccessRight
  | IActionAccessRight
  | IBuiltinOnlyActionAccessRight
  | IAlertAccessRight
  | INodePropertyAccessRight
  | IEdgePropertyAccessRight;

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
