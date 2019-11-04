/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {PersistedItem, IDataSourceParams} from '../commonTypes';

// USER
export interface SimpleUser extends PersistedItem {
  username: string;
  email: string;
}

export interface User extends SimpleUser {
  groups: SimpleGroup[];
  source: string;
}

export interface FullUser extends User {
  preferences: {
    pinOnDrag: boolean;
    incrementalLayout: boolean;
    locale: string;
  };
  actions: any;
  accessRights: any;
}

export interface IGetUserParams extends IDataSourceParams {
  id: number;
}

// GROUP
export interface BaseGroup {
  id: number;
  name: string;
}

export interface SimpleGroup extends BaseGroup {
  builtin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Group extends SimpleGroup {
  userCount?: number;
  accessRights?: AccessRight[];
  sourceKey: string;
}

export type RightType = 'read' | 'write' | 'none' | 'do';

export interface AccessRight {
  type: RightType;
  targetType: string;
  targetName: string;
}

export interface ICreateUserParams {
  username: string;
  email: string;
  password: string;
  groups?: Array<string | number>;
}

export interface UserGroup {
  name: string;
  builtin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemGroup extends UserGroup {
  userCount?: number;
  accessRights?: AccessRight[];
  sourceKey: string;
}

export interface CreateUserResponse {
  id: number;
  username: string;
  email: string;
  groups: UserGroup[];
  source: 'string';
  admin?: boolean;
  preferences: {
    pinOnDrag: boolean;
    incrementalLayout: boolean;
    locale: string;
  };
  actions: any;
  locale: string;
}

export interface IDeleteUserParams {
  id: number;
}

export interface ICreateGroupParams extends IDataSourceParams {
  name: string;
}

export interface IDeleteGroupParams extends IDataSourceParams {
  id: number;
}

export interface IUpdateGroupParams extends IDataSourceParams {
  id: number;
  name: string;
}

export interface IGetGroupParams extends IDataSourceParams {
  id: number;
}

export interface IGetGroupsParams extends IDataSourceParams {
  withAccessRights: boolean;
}

export interface IGetGroupNamesParams extends IDataSourceParams {
  action: string;
}

export interface GroupName {
  id: number;
  name: string;
}

export interface GroupRights {
  types: string[];
  targetTypes: string[];
  actions: string[];
}

export interface ISetGroupAccessRightsParams extends IDataSourceParams {
  id: number;
  // TODO PKAR add targetItemType
  accessRights: Array<{type: string; targetType: string; targetName: string}>;
}

export interface IDeleteAccessRightsParams extends IDataSourceParams {
  groupId: number;
  targetType: 'nodeCategory' | 'edgeType' | 'alert' | 'action';
  targetName: string;
}

export interface IUpdateUserParams {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  preferences?: any;
  addedGroups?: number[];
  removedGroups?: number[];
}

export interface UpdateUserResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  groups: SimpleGroup[];
  source: string;
  preferences: {
    pinOnDrag: boolean;
    incrementalLayout: boolean;
    locale: string;
  };
  actions: any;
  accessRights: any;
}

export interface ISearchUsersParams {
  startsWith?: string;
  contains?: string;
  groupId?: number;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface IMergeVisualizationsParams {
  from: number;
  to: number;
}
