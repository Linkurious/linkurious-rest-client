/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-02.
 */
import { GenericObject, ICaptionsConfig } from './Configuration';

export interface IDataSourceParams {
  sourceKey?: string;
}

export interface IDataSource {
  name: string;
  key: string;
  configIndex: number;
}

export interface IDataSourceFeatures {
  immutableNodeCategories: boolean;
  canCountBeforeIndexation: boolean;
  canIndexEdges: boolean;
  searchHitsCount: boolean;
  alternativeIds: GenericObject<string>;
  maxNodeCategories?: number;
  externalIndex: boolean;
  canCount: boolean;
  dialects: string[];
}

export interface ISpecialProperties {
  keu: string;
  read: boolean;
  create: boolean;
  update: boolean;
}

export interface IAlternativeIdSettings {
  node: string;
  edge: string;
}

export interface IDataSourceSettings {
  strictSchema: boolean;
  alternativeId: IAlternativeIdSettings;
  latitudeProperty?: string;
  longitudeProperty?: string;
  skipEdgeIndexation: boolean;
  readonly: boolean;
  specialProperties: ISpecialProperties;
}

export interface IUserDataSource extends IDataSource {
  state: DataSourceStatus;
  connected: boolean;
  reason: string;
  error?: string;
  features: IDataSourceFeatures;
  settings: IDataSourceSettings;
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

export interface IAdminDataSource extends IDataSource {
  state: DataSourceStatus;
  lastSeen: string;
  lastIndexed: string;
  lastSampled: string;
  host: string;
  port: string;
  storeId: string;
  visualizationCount: number;
}

export interface IConnectDataSourceParams {
  sourceIndex: number;
}

export interface IResetDataSourceDefaultsParams extends IDataSourceParams {
  design?: boolean;
  captions?: boolean;
}

export interface IDataSourceStyle {
  node: Array<GenericObject<unknown>>;
  edge: Array<GenericObject<unknown>>;
}

export interface IGetUserDataSourceParams {
  withStyles?: boolean;
  withCaptions?: boolean;
}

export interface IGetUserDataSourceResponse {
  sources: IUserDataSource[];
}

export interface IGetAdminDataSourceResponse {
  sources: IAdminDataSource[];
}


export interface ISetDataSourceDefaultsParams extends IDataSourceParams {
  styles?: IDataSourceStyle;
  captions?: ICaptionsConfig;
}

export interface IDeleteDataSourceParams extends IDataSourceParams {
  mergeInto?: string;
}

export interface IAffectedSource {
  visualizations: number;
  folders: number;
}


export interface IDeleteDataSourceResponse {
  migrated: boolean;
  affected: IAffectedSource;
}
