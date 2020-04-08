/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {IDataSourceParams, PersistedItem, Tree} from '../commonTypes';
import {GraphQueryDialect} from '../GraphQuery';
import {LkEdge, LkNode} from '../graphItemTypes';
import {User} from '../User';

export enum AlertColumnType {
  STRING = 'string',
  NUMBER = 'number'
}

export interface ICreateAlertParams extends IDataSourceParams {
  title: string;
  query: string;
  dialect: GraphQueryDialect;
  folder?: number;
  enabled: boolean;
  columns: Array<{
    type: AlertColumnType;
    columnName: string;
    columnTitle: string;
  }>;
  cron: string;
}

export interface Alert extends PersistedItem {
  title: string;
  sourceKey: string;
  query: string;
  dialect: GraphQueryDialect;
  folder: number;
  enabled: boolean;
  columns: Array<{
    type: AlertColumnType;
    columnName: string;
    columnTitle: string;
  }>;
  cron: string;
  lastRun?: string; // defined if it has run at least once
  lastRunProblem?: {
    // defined if last run had a problem
    error: string;
    partial: boolean;
  };
  nextRun?: string; // defined if enabled=true
}

export interface IUpdateAlertParams extends Partial<ICreateAlertParams> {
  id: number;
}

export interface IDeleteAlertParams extends IDataSourceParams {
  id: number;
}

export interface ICreateAlertFolderParams extends IDataSourceParams {
  title: string;
}

export interface AlertFolder extends PersistedItem {
  title: string;
  parent: number;
  sourceKey: string;
}

export interface IUpdateAlertFolderParams extends IDataSourceParams {
  id: number;
  title: string;
}

export interface IDeleteAlertFolderParams extends IDataSourceParams {
  id: number;
}

export type AlertTree = Tree<Alert, 'alert'>;

export interface IGetAlertParams extends IDataSourceParams {
  id: number;
}

export interface IGetMatchParams extends IDataSourceParams {
  alertId: number;
  matchId: number;
}

export enum MatchStatus {
  UNCONFIRMED = 'unconfirmed',
  CONFIRMED = 'confirmed',
  DISMISSED = 'dismissed'
}

export interface Match extends PersistedItem {
  sourceKey: string;
  alertId: number;
  hash: string;
  status: MatchStatus;
  statusUpdateDate?: string; // undefined if the match status was never updated
  user: Pick<User, 'id' | 'username' | 'email'>;
  viewers: Array<{
    id: number;
    username: string;
    email: string;
    date: string;
  }>;
  nodes: string[];
  edges: string[];
  columns: string[];
}

export interface GetMatchesResponse {
  counts: {
    unconfirmed: number;
    confirmed: number;
    dismissed: number;
  };
  matches: Match[];
}

export enum GetMatchesSortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum GetMatchesSortBy {
  DATE = 'date',
  ZERO = '0',
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4'
}

export interface IGetMatchesParams extends IDataSourceParams {
  alertId: number;
  offset?: number;
  limit?: number;
  sortDirection?: GetMatchesSortDirection;
  sortBy?: GetMatchesSortBy;
  status?: MatchStatus;
}

export interface IGetMatchActionsParams extends IDataSourceParams {
  alertId: number;
  matchId: number;
}

export enum MatchActionType {
  CONFIRM = 'confirm',
  DISMISS = 'dismiss',
  UNCONFIRM = 'unconfirm',
  OPEN = 'open'
}

export interface MatchAction extends PersistedItem {
  matchId: number;
  user: Pick<User, 'id' | 'username' | 'email'>;
  action: MatchActionType;
}

export interface IDoMatchActionParams extends IDataSourceParams {
  alertId: number;
  matchId: number;
  action: MatchActionType;
}

export interface IAlertPreviewParams extends IDataSourceParams {
  query: string;
  dialect?: GraphQueryDialect;
  columns?: Array<{columnName: string; columnTitle?: string; type: AlertColumnType}>;
  limit?: number;
  timeout?: number;
}

export type AlertPreview = Array<{
  nodes: LkNode[];
  edges: LkEdge[];
  columns: Array<string | number>;
}>;
