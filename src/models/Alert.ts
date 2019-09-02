/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-16.
 */

// TS2019-DONE

import {FolderChildren, IPersistedItem} from './Model';

import {IDataSourceParams} from './DataSource';

export interface ICreateAlertFolderParams extends IDataSourceParams {
  title: string;
  parent?: number;
}

export interface ICreateAlertFolderResponse extends IPersistedItem {
  title: string;
  parent: number;
}

export interface IUpdateAlertFolderParams extends IDataSourceParams {
  id: number;
  title?: string;
  parent?: number;
}

export interface IDeleteAlertFolderParams extends IDataSourceParams {
  id: number;
}

export interface IGetAlertTreeParams extends IDataSourceParams {}

export interface IGetAlertTreeResponse {
  id: -1;
  title: 'root';
  type: 'folder';
  children: FolderChildren<IGetAlertResponse, 'alert'>;
}

export interface IGetAlertParams extends IDataSourceParams {
  id: number;
}

export interface IGetAlertResponse extends IPersistedItem {
  folder: number;
  title: string;
  sourceKey: string;
  query: string;
  dialect: string;
  enabled: boolean;
  columns: Array<{type: 'number' | 'string'; columnName: string; columnTitle: string}>;
  cron: string;
  lastRun?: string;
  lastRunProblem?: {
    error: string;
    partial: boolean;
  };
  nextRun?: string;
}
