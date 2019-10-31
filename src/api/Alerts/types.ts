/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {
  FolderChildren,
  IDataSourceParams,
  IIdentified,
  IPersistedItem,
  QueryDialect
} from '../commonTypes';

export interface ICreateAlertParams extends IDataSourceParams {
  title: string;
  query: string;
  dialect: QueryDialect;
  folder?: number;
  enabled: boolean;
  columns: Array<{
    type: string;
    columnName: string;
    columnTitle: string;
  }>;
  cron: string;
  matchTTL?: number;
  maxMatches?: number;
}

interface Alert extends IPersistedItem {
  title: string;
  query: string;
  dialect: QueryDialect;
  folder: number;
  enabled: boolean;
  columns: Array<{
    type: string;
    columnName: string;
    columnTitle: string;
  }>;
  cron: string;
  matchTTL: number;
  maxMatches: number;
  userId: number;
  lastRun: string;
  lastRunProblem?: {
    error: string;
    partial: boolean;
  };
  nextRun?: string;
}

export interface CreateAlertResponse extends Alert {}

export interface IUpdateAlertParams
  extends IDataSourceParams,
    IIdentified,
    Partial<ICreateAlertParams> {}

export interface UpdateAlertResponse extends Alert {}

export interface IDeleteAlertParams extends IDataSourceParams, IIdentified {}

export interface ICreateAlertFolderParams extends IDataSourceParams {
  title: string;
}

interface AlertFolder extends IPersistedItem {
  title: string;
  parent: number;
}

export interface CreateAlertFolderResponse extends AlertFolder {}

export interface IUpdateAlertFolderParams extends IDataSourceParams, IIdentified {
  title: string;
}

export interface UpdateAlertFolderResponse extends AlertFolder {}

export interface IDeleteAlertFolderParams extends IDataSourceParams, IIdentified {}

export interface IGetAlertTreeParams extends IDataSourceParams {}

export interface GetAlertTreeResponse {
  id: -1;
  title: 'root';
  type: 'folder';
  children: FolderChildren<Alert, 'alert'>;
}

export interface IGetAlertParams extends IDataSourceParams, IIdentified {}

export interface GetAlertResponse extends Alert {}

export interface IGetMatchParams extends IDataSourceParams {
  alertId: number;
  matchId: number;
}

type MatchStatus = 'unconfirmed' | 'confirmed' | 'dismissed';

export interface Match extends IPersistedItem {
  alertId: number;
  hash: string;
  status: MatchStatus;
  user: {
    id: number;
    username: string;
    email: string;
  };
  viewers: {
    id: number;
    username: string;
    email: string;
    date: string;
  };
  nodes: string[];
  edges: string[];
  columns: string[];
  expirationDate: string;
}

export interface GetMatchResponse extends Match {}

export interface IGetMatchesParams extends IDataSourceParams {
  alertId: number;
  offset?: number;
  limit?: number;
  // TODO RC-refactoring fix snake case in server
  sortDirection?: 'asc' | 'desc';
  sortBy?: 'date' | '0' | '1' | '2' | '3' | '4';
  status?: MatchStatus;
}

export type GetMatchesResponse = Match[];

export interface IGetMatchActionsParams extends IDataSourceParams {
  alertId: number;
  matchId: number;
}

type MatchActionType = 'confirm' | 'dismiss' | 'unconfirm' | 'open';

export interface MatchAction extends IPersistedItem {
  matchId: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  action: MatchActionType;
}

export type GetMatchActionsResponse = MatchAction[];

export interface IDoMatchActionParams extends IDataSourceParams {
  alertId: number;
  matchId: number;
  action: MatchActionType;
}
