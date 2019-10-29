/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */
import {IDataSourceParams} from '../commonTypes';
import { IAccessRight, IAlertRunProblem } from '../../../../index';
import { ISimpleGroup } from '../User/types';
export interface ICreateUserParams {
  username: string;
  email: string;
  password: string;
  groups?: Array<string | number>;
}

export interface IUserGroup {
  name: string;
  builtin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISystemGroup extends IUserGroup {
  userCount?: number;
  accessRights?: IAccessRight[];
  sourceKey: string;
}

export interface ICreateGroupResponse extends  ISystemGroup {}

export interface ICreateUserResponse {
  id: number;
  username: string;
  email: string;
  groups: IUserGroup[];
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
  name: string;
}

export interface IUpdateGroupParams extends IDataSourceParams {
  id: number;
  name: string;
}

export interface IGetGroupParams extends IDataSourceParams {
  id: number;
}

export interface IGetGroupsParams extends  IDataSourceParams {
  withAccessRights: boolean;
}

export interface IGetGroupsResponse extends ISystemGroup {}

export interface IGetGroupRightsResponse {
  types: string[];
  targetTypes: string[];
  actions: string[];
}

export interface ISetGroupAccessRightsParams extends IDataSourceParams{
  id: number;
  // TODO PKAR add targetItemType
  accessRights: Array<{type: string; targetType: string; targetName: string}>;
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

export interface IUpdateUserResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  groups: ISimpleGroup[];
  source: string;
  preferences: {
    pinOnDrag: boolean;
    incrementalLayout: boolean;
    locale: string;
  };
  actions: any;
  accessRights: any;
}

export interface IStartIndexationParams extends IDataSourceParams {}

export interface IGetIndexationStatusParams extends IDataSourceParams {}

export enum IndexationStatus {
  ONGOING = 'ongoing',
  DONE = 'done',
  NEEDED = 'needed'
}

export interface IGetIndexationStatusResponse {
  indexing: IndexationStatus;
  indexing_progress?: string;
  indexing_status: string;
  node_count?: number;
  edge_count?: number;
  index_size?: number;
  indexed_source: string;
}

export interface ICreateAlertResponse extends IDataSourceParams{
  title: string;
  createdAt: string;
  updatedAt: string;
  query: string;
  dialect: string;
  enabled: boolean;
  cron: string;
  nextRun: string;
  matchTTL: number;
  scoreColumn: string;
  sortDirection: string;
  maxMatches: number;
  maxRuntime: number;
  userId: number;
  lastRun: string;
  lastRunProblem: IAlertRunProblem;
}

export interface ICreateAlertParams extends IDataSourceParams {
  title?: string;
  query?: string;
  dialect?: string;
  enabled?: boolean;
  cron?: string;
  matchTTL?: number;
  scoreColumn?: string;
  scoreDirection?: string;
  maxMatches?: number;
  maxRuntime?: number;
  folder?: number;
}

export interface IUpdateAlertParams extends Partial<ICreateAlertParams> {
  id: number;
}

export interface IUpdateAlertResponse extends ICreateAlertResponse {}

export interface IDeleteAlertParams extends IDataSourceParams {
  id: number;
}

