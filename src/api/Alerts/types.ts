/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {IDataSourceParams, PersistedItem, Tree} from '../commonTypes';
import {GraphQueryDialect} from '../GraphQuery';
import {LkEdge, LkNode} from '../graphItemTypes';

export enum ColumnType {
  STRING = 'string',
  NUMBER = 'number'
}

// Public Alert
export interface Alert extends PersistedItem {
  sourceKey: string;
  title: string;
  query: string;
  dialect: GraphQueryDialect;
  enabled: boolean;
  columns: Array<{
    type: ColumnType;
    columnName: string;
    columnTitle: string;
  }>;
  cron: string;
  matchTTL: number;
  maxMatches: number;
  lastRun: string;
  lastRunProblem: {
    error: Record<string, unknown>;
    partial: boolean;
  };
  nextRun?: string;
  userId: number;
  folder: number;
}

export interface ICreateAlertParams
  extends IDataSourceParams,
    Pick<Alert, 'title' | 'query' | 'dialect' | 'enabled' | 'columns' | 'cron'>,
    Partial<Pick<Alert, 'sourceKey' | 'matchTTL' | 'maxMatches' | 'folder'>> {}

export interface IUpdateAlertParams
  extends IDataSourceParams,
    Partial<
      Pick<
        Alert,
        'title' | 'query' | 'dialect' | 'enabled' | 'cron' | 'matchTTL' | 'maxMatches' | 'folder'
      >
    > {}

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
  title?: string;
}

export interface IDeleteAlertFolderParams extends IDataSourceParams {
  id: number;
}

export type AlertTree = Tree<AlertTreeNode, 'alert'>;

export interface AlertTreeNode
  extends PersistedItem,
    Pick<
      Alert,
      | 'folder'
      | 'title'
      | 'sourceKey'
      | 'query'
      | 'dialect'
      | 'enabled'
      | 'columns'
      | 'cron'
      | 'nextRun'
    >,
    Partial<Pick<Alert, 'lastRun' | 'lastRunProblem'>> {}

export interface IGetAlertParams extends IDataSourceParams {
  id: number;
}

export interface IGetMatchParams extends IDataSourceParams {
  alertId: number;
  matchId: number;
}

export type MatchStatus = 'unconfirmed' | 'confirmed' | 'dismissed';

export interface Match extends PersistedItem {
  sourceKey: string;
  alertId: number;
  hash: string;
  status: MatchStatus;
  user: {
    id: number;
    username: string;
    email: string;
  };
  viewers: Array<{
    id: number;
    username: string;
    email: string;
    date: string;
  }>;
  nodes: string[];
  edges: string[];
  columns: string[];
  expirationDate: string;
}

export interface IGetMatchesParams extends IDataSourceParams {
  alertId: number;
  offset?: number;
  limit?: number;
  sortDirection?: 'asc' | 'desc';
  sortBy?: 'date' | '0' | '1' | '2' | '3' | '4';
  status?: MatchStatus;
}

export interface IGetMatchActionsParams extends IDataSourceParams {
  alertId: number;
  matchId: number;
}

export type MatchActionType = 'confirm' | 'dismiss' | 'unconfirm' | 'open';

export interface MatchAction extends PersistedItem {
  matchId: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
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
  columns?: Array<{columnName: string; columnTitle?: string; type: ColumnType}>;
  limit?: number;
  timeout?: number;
}

export type AlertPreview = Array<{
  nodes: LkNode[];
  edges: LkEdge[];
  columns: Array<string | number>;
}>;
