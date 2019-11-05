/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-25.
 */

import {GenericObject, IDataSourceParams} from '../commonTypes';

export interface IDataSourceFeatures {
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

export interface IAlternativeIdSettings {
  node?: string;
  edge?: string;
}

export interface IDataSourceSettings {
  readonly: boolean;
}

export interface IConnectedDataSourceSettings extends IDataSourceSettings {
  alternativeIds: IAlternativeIdSettings;
  strictSchema: boolean;
  skipEdgeIndexation: boolean;
  latitudeProperty?: string;
  longitudeProperty?: string;
}

export interface Caption {
  active: boolean;
  displayName: boolean;
  properties: string[];
  id?: unknown;
  name?: unknown;
}

export interface ICaptionsConfig {
  nodes: GenericObject<Caption>;
  edges: GenericObject<Caption>;
}

export interface UserDataSource {
  name: string;
  connected: boolean;
  key?: string;
  configIndex: number;
  state: DataSourceStatus;
  reason: string;
  error?: string | null;
  features: IDataSourceFeatures;
  defaultStyles?: IDataSourceStyle;
  defaultCaptions?: ICaptionsConfig;
  settings: IDataSourceSettings | IConnectedDataSourceSettings;
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

export interface IAdminDataSource {
  name?: string;
  configIndex?: number;
  key?: string;
  state: DataSourceStatus;
  lastSeen?: string;
  lastIndexed?: string;
  lastSampled?: string;
  host: string;
  port: string;
  storeId?: string;
  visualizationCount: number;
}

export interface IConnectDataSourceParams {
  sourceIndex: number;
}

export interface IResetDataSourceDefaultsParams extends IDataSourceParams {
  design?: boolean;
  captions?: boolean;
}

export enum SelectorType {
  ANY = 'any',
  NO_VALUE = 'novalue',
  NAN = 'nan',
  RANGE = 'range',
  IS = 'is'
}

export interface IRange {
  '<='?: number;
  '<'?: number;
  '>'?: number;
  '>='?: number;
}

export enum IOgmaNodeShape {
  CIRCLE = 'circle',
  CROSS = 'cross',
  DIAMOND = 'diamond',
  PENTAGON = 'pentagon',
  SQUARE = 'square',
  STAR = 'star',
  EQUILATERAL = 'equilateral'
}

export enum IOgmaEdgeShape {
  LINE = 'line',
  ARROW = 'arrow',
  TAPERED = 'tapered',
  DASHED = 'dashed',
  DOTTED = 'dotted'
}

export interface IStyleRule<T extends NodeStyle | EdgeStyle> {
  index: number;
  type: SelectorType;
  itemType?: string;
  input?: string[];
  value?: string | number | boolean | Array<unknown> | IRange;
  style: T;
}

export interface IColor {
  type: 'auto';
  input: string[];
  ignoreCase?: boolean;
}

export interface IIcon {
  content?: string | number;
  font?: string;
  color?: string | IColor;
  scale?: number;
  minVisibleSize?: number;
}

export interface IImageDataValue {
  type: 'data';
  path: string[];
}

export interface IImage {
  url?: string | IImageDataValue;
  scale?: number;
  fit?: boolean;
  tile?: boolean;
  minVisibleSize?: number;
}

export interface NodeStyle {
  size?: string | number;
  color?: string | IColor;
  icon?: string | number | IIcon;
  image?: string | IImage;
  shape?: IOgmaNodeShape;
}

export interface EdgeStyle {
  color?: string | IColor;
  width?: string | number;
  shape?: IOgmaEdgeShape;
}

export interface IDataSourceStyle {
  node: Array<IStyleRule<NodeStyle>>;
  edge: Array<IStyleRule<EdgeStyle>>;
}

export interface IGetUserDataSourcesParams {
  withStyles?: boolean;
  withCaptions?: boolean;
}

export type GetUserDataSourcesResponse = UserDataSource[];

export type GetAdminDataSourcesResponse = IAdminDataSource[];

export interface ISetDataSourceDefaultsParams extends IDataSourceParams {
  styles?: IDataSourceStyle;
  captions?: ICaptionsConfig;
}

export interface IDeleteDataSourceParams extends IDataSourceParams {
  mergeInto?: string;
}

export interface DeleteDataSourceResponse {
  migrated: boolean;
  affected: {
    visualizations: number;
    folders: number;
  };
}

export enum IndexationStatus {
  ONGOING = 'ongoing',
  DONE = 'done',
  NEEDED = 'needed'
}

// TODO make camelCase for consistency
export interface GetIndexationStatusResponse {
  indexing: IndexationStatus;
  indexing_progress?: string;
  indexing_status: string;
  node_count?: number;
  edge_count?: number;
  index_size?: number;
  indexed_source: string;
}
