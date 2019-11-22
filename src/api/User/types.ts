/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {IDataSourceParams, PersistedItem} from '../commonTypes';
import {AccessRight, AnyAction} from '../AccessRight';

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
  actions: AnyAction[];
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
  // TODO we shouldn't return the access-rights of a user on search, everyone can run this API
  results: Array<User & {visCount: number}>;
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

export interface Group extends PersistedItem {
  name: string;
  sourceKey: string;
  builtin: boolean;
  userCount: number;
  accessRights: AccessRight[];
}

export type GroupName = Pick<Group, 'id' | 'name'>;

export interface IGetGroupNamesParams extends IDataSourceParams {
  action: AnyAction;
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

export interface IMergeVisualizationsParams {
  from: number;
  to: number;
}
