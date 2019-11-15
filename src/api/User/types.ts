/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {IDataSourceParams, PersistedItem} from '../commonTypes';

export interface UserPreferences {
  pinOnDrag: boolean;
  locale: string;
  incrementalLayout: boolean;
}

export interface User extends PersistedItem {
  username: string;
  email: string;
  source: string;
  preferences: UserPreferences;
  groups: GroupName[];
  // TODO PKAR type on merge
  actions: string[];
  accessRights: AccessRight[];
}

export interface IGetUserParams {
  id: number;
}

export interface ISearchUsersParams {
  startsWith?: string;
  contains?: string;
  groupId?: number;
  offset?: number;
  limit?: number;
  sortBy?: 'id' | 'username' | 'email';
  sortDirection?: 'asc' | 'desc';
}

export interface SearchUserResponse {
  found: number;
  // TODO SERVER shouldn't return accessRights of user on search
  results: Array<Omit<User, 'accessRights'> & {visCount: number}>;
}

export interface ICreateUserParams {
  username: string;
  email: string;
  password: string;
  groups?: number[];
}

export interface IUpdateUserParams {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  preferences?: Partial<UserPreferences>;
  addedGroups?: number[];
  removedGroups?: number[];
}

export interface IDeleteUserParams {
  id: number;
}

export interface IGetGroupParams extends IDataSourceParams {
  id: number;
}

export interface AccessRight {
  type: 'read' | 'write' | 'none' | 'do';
  targetType: string;
  targetName: string;
}

export interface Group extends PersistedItem {
  name: string;
  sourceKey: string;
  builtin: boolean;
  userCount: number;
  accessRights: AccessRight[];
}

export type GroupName = Pick<Group, 'id' | 'name'>;

export interface IGetGroupNamesParams extends IDataSourceParams {
  // TODO PKAR type on merge
  action: string;
}

export interface ICreateGroupParams extends IDataSourceParams {
  name: string;
}

export interface IUpdateGroupParams extends IDataSourceParams {
  id: string;
  name: string;
}

export interface IDeleteGroupParams extends IDataSourceParams {
  id: number;
}

export interface ISetAccessRightsParams extends IDataSourceParams {
  id: number;
  accessRights: Array<AccessRight>;
}

export interface IMergeVisualizationsParams {
  from: number;
  to: number;
}
