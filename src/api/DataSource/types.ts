/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-25.
 */

import {Captions, Styles} from '../displayTypes';

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

export interface UserDataSource {
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
//
// export interface IConnectDataSourceParams {
//   sourceIndex: number;
// }
//
// export interface IResetDataSourceDefaultsParams extends IDataSourceParams {
//   design?: boolean;
//   captions?: boolean;
// }
//
// export type GetAdminDataSourcesResponse = IAdminDataSource[];
//
// export interface ISetDataSourceDefaultsParams extends IDataSourceParams {
//   styles?: IDataSourceStyle;
//   captions?: ICaptionsConfig;
// }
//
// export interface IDeleteDataSourceParams extends IDataSourceParams {
//   mergeInto?: string;
// }
//
// export interface DeleteDataSourceResponse {
//   migrated: boolean;
//   affected: {
//     visualizations: number;
//     folders: number;
//   };
// }
//
// export enum IndexationStatus {
//   ONGOING = 'ongoing',
//   DONE = 'done',
//   NEEDED = 'needed'
// }
//
// // TODO make camelCase for consistency
// export interface GetIndexationStatusResponse {
//   indexing: IndexationStatus;
//   indexing_progress?: string;
//   indexing_status: string;
//   node_count?: number;
//   edge_count?: number;
//   index_size?: number;
//   indexed_source: string;
// }
