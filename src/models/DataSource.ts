/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-02.
 */
import {ICaptionsConfig} from './Configuration';

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
  alternativeIds: IAlternativeIdSettings;
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
  DOTTED = 'dptted'
}

export interface IStyleRule<T extends NodeStyle | EdgeStyle> {
  index: number;
  type: SelectorType;
  itemType?: string;
  input?: string[];
  value: string | number | boolean | Array<unknown> | IRange;
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
  // @backward-compatibility replaced by minVisibleSize in 2.5.0
  threshold?: number;
}

export interface IImageDataValue {
  type: 'data';
  path: string[];
}

export interface IImage {
  url: string | IImageDataValue;
  scale?: number;
  fit?: boolean;
  tile?: boolean;
  minVisibleSize?: number;
  // @backward-compatibility replaced by minVisibleSize in 2.5.0
  threshold?: number;
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
