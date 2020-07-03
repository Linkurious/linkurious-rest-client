/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-25.
 */

import {Captions, DefaultStyles} from '../displayTypes';
import {IDataSourceParams} from '../commonTypes';
import {GraphQueryDialect} from '../GraphQuery';

export interface IGetDataSourcesStatusParams {
  withStyles?: boolean;
  withCaptions?: boolean;
}

export enum DataSourceState {
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
  maxNodeCategories?: number; // defined only if the number of categories is limited
  externalIndex: boolean;
  canCount: boolean;
  dialects: GraphQueryDialect[];
  alerts: boolean;
  canDryRun: boolean;
  supportNativeDate: boolean;
}

export interface DataSourceSettings {
  readOnly: boolean;
}

export interface AlternativeIdSettings {
  node?: string; // defined only if alternative IDs are configured in the GraphDAO options
  edge?: string;
}

export interface GeoSettings {
  latitudeProperty?: string; // defined only if configured in the GraphDAO options
  longitudeProperty?: string;
}

export interface ConnectedDataSourceSettings extends DataSourceSettings, GeoSettings {
  alternativeIds: AlternativeIdSettings;
  propertyKeyAccessRights: boolean;
  strictSchema: boolean;
  skipEdgeIndexation: boolean;
}

export interface DataSourceUserInfo {
  name: string;
  connected: boolean;
  key?: string; // defined if the data-source is connected
  configIndex: number;
  state: DataSourceState;
  reason: string;
  error?: string;
  features: DataSourceFeatures;
  defaultStyles?: DefaultStyles; // defined if withStyles or withCaptions was set to true in the request and the data-source is connected
  defaultCaptions?: Captions;
  settings: DataSourceSettings | ConnectedDataSourceSettings;
}

export interface ISetDefaultSourceStylesParams extends IDataSourceParams {
  styles?: DefaultStyles;
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

export interface IDeleteSourceConfigParams {
  configIndex: number;
}

/**
 * A DataSourceAdminInfo can represent:
 * - a disconnected data-source configuration
 * - a disconnected data-source state not configured anymore
 * - a connected data-source (data-source configuration + state)
 */
export interface DataSourceAdminInfo {
  name?: string; // defined if name is configured by the user
  configIndex?: number; // defined if it's a data-source config
  key?: string; // defined if it's a data-source state
  state: DataSourceState;
  lastSeen?: string; // defined if it's a data-source state
  lastIndexed?: string; // defined if the indexation has run at least once
  lastSampled?: string; // defined if the sampling has run at least once
  host: string;
  port: string;
  storeId?: string; // defined if it's a data-source state
  visualizationCount: number;
}
