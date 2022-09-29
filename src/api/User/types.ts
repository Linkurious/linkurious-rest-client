/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {GenericObject, IDataSourceParams, PersistedItem} from '../commonTypes';
import {AccessRight, Action, AnyAction} from '../AccessRight';
import {IGuestPreferencesConfig} from '../Config';

export interface IUserPreferences {
  pinOnDrag: boolean;
  locale: string;
  incrementalLayout: boolean;
}

export interface SourceAccessRights {
  alerts: {
    read: string[];
  };
  nodes: {
    edit: string[];
    write: string[];
  };
  edges: {
    edit: string[];
    write: string[];
  };
}

export interface User extends PersistedItem {
  username: string;
  email: string;
  lastActiveDate?: string; // undefined if the user has never logged in
  source: string;
  preferences: IUserPreferences | IGuestPreferencesConfig;
  groups: GroupName[];
  actions: GenericObject<AnyAction[]>;
  accessRights: GenericObject<SourceAccessRights>;
}

export interface IGetUserParams {
  id: number;
}

export enum SearchUsersSortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum SearchUsersSortBy {
  ID = 'id',
  USERNAME = 'username',
  EMAIL = 'email'
}

export interface ISearchUsersFullParams extends IDataSourceParams {
  startsWith?: string;
  contains?: string;
  groupId?: number;
  offset?: number;
  limit?: number;
  sortBy?: SearchUsersSortBy;
  sortDirection?: SearchUsersSortDirection;
}

export interface ISearchUsersSimpleParams extends IDataSourceParams {
  contains?: string;
  offset?: number;
  limit?: number;
}

export interface SearchUsersSimpleResponse {
  found: number;
  results: Array<Pick<User, 'id' | 'username' | 'email'>>;
}

export interface SearchUsersFullResponse {
  found: number;
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
  preferences?: Partial<IUserPreferences>;
  addedGroups?: number[];
  removedGroups?: number[];
}

export interface IDeleteUserParams {
  id: number;
  migrateAssetsTo?: number;
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

export type GroupName = Pick<Group, 'id' | 'name' | 'sourceKey'>;

export interface IGetGroupNamesParams extends IDataSourceParams {
  action?: Action;
}

export interface ICreateGroupParams extends IDataSourceParams {
  name: string;
}

export interface IUpdateGroupParams extends IDataSourceParams {
  id: number;
  name: string;
}

export interface IDeleteGroupParams extends IDataSourceParams {
  id: number;
}

export interface IMergeUsersParams {
  from: number;
  to: number;
}

export interface ICountSharedUserAssetsParams {
  id: number;
}

export interface IGetAssetTransferEligibleUsersParams {
  id: number;
}

export interface ICountSharedAssets {
  count: number;
}
