/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-25.
 */

import {Captions, Styles} from '../displayTypes';
import {IDataSourceParams} from '../commonTypes';

export interface IGetDataSourcesStatusParams {
  withStyles?: boolean;
  withCaptions?: boolean;
}

export enum DataSourceStatus {
  READY = 'ready',
  NEED_REINDEX = 'needReindex',
  NEED_FIRST_INDEX = 'needFirstIndex',
  NEED_CONFIG = 'needConfig',
  INDEXING = 'indexing',
  DICOVERING_SCHEMA = 'discoveringSchema',
  OFFLINE = 'offline',
  CONNECTING = 'connecting'
}

export interface DataSourceFeatures {
  immutableNodeCategories: boolean;
  canCountBeforeIndexation: boolean;
  canIndexEdges: boolean;
  searchHitsCount: boolean;
  alternativeIds: boolean;
  maxNodeCategories?: number;
  externalIndex: boolean;
  canCount: boolean;
  dialects: string[];
  alerts: boolean;
  canDryRun: boolean;
  supportNativeDate: boolean;
}

export interface DataSourceSettings {
  readonly: boolean;
}

export interface AlternativeIdSettings {
  node?: string;
  edge?: string;
}

export interface ConnectedDataSourceSettings extends DataSourceSettings {
  alternativeIds: AlternativeIdSettings;
  strictSchema: boolean;
  skipEdgeIndexation: boolean;
  latitudeProperty?: string;
  longitudeProperty?: string;
}

export interface DataSource {
  name: string;
  connected: boolean;
  key?: string;
  configIndex: number;
  state: DataSourceStatus;
  reason: string;
  error?: string;
  features: DataSourceFeatures;
  defaultStyles?: Styles;
  defaultCaptions?: Captions;
  settings: DataSourceSettings | ConnectedDataSourceSettings;
}

export interface ISetDefaultSourceStylesParams extends IDataSourceParams {
  styles?: Styles;
  captions?: Captions;
}

export interface IResetSourceStylesParams extends IDataSourceParams {
  design?: boolean;
  captions?: boolean;
}

export interface IConnectDataSourceParams {
  sourceIndex: number;
}

export interface IDeleteSourceDataParams extends IDataSourceParams {
  mergeInto?: string;
}

export interface DeleteSourceDataResponse {
  migrated: boolean;
  affected: {
    visualizations: number;
    folders: number;
    groups: number;
    alerts: number;
    matches: number;
    graphQueries: number;
  };
}

// export interface IAdminDataSource {
//   name?: string;
//   configIndex?: number;
//   key?: string;
//   state: DataSourceStatus;
//   lastSeen?: string;
//   lastIndexed?: string;
//   lastSampled?: string;
//   host: string;
//   port: string;
//   storeId?: string;
//   visualizationCount: number;
// }
