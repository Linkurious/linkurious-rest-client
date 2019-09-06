/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-02.
 */

// TS2019-DONE

import {GenericObject} from './Model';

export interface IDataSourceParams {
  sourceKey?: string;
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
  strictSchema: boolean;
  skipEdgeIndexation: boolean;
  alternativeIds: IAlternativeIdSettings;
  latitudeProperty?: string;
  longitudeProperty?: string;
}

export interface ICaption {
  active: boolean;
  displayName: boolean;
  properties: string[];
  id?: unknown;
  name?: unknown;
}

export interface ICaptionsConfig {
  nodes: GenericObject<ICaption>;
  edges: GenericObject<ICaption>;
}

export type IUserDataSource = {
  name: string;
  configIndex: number;
  state: DataSourceStatus;
  reason: string;
  error?: string;
  features: IDataSourceFeatures;
} & (
  | {
      connected: true;
      key: string;
      defaultStyles: IDataSourceStyle;
      defaultCaptions: ICaptionsConfig;
      settings: IDataSourceSettings;
    }
  | {
      connected: false;
      settings: IConnectedDataSourceSettings;
    });

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

export interface IGetUserDataSourcesResponse {
  sources: IUserDataSource[];
}

export interface IGetAdminDataSourcesResponse {
  sources: IAdminDataSource[];
}

export interface ISetDataSourceDefaultsParams extends IDataSourceParams {
  styles?: IDataSourceStyle;
  captions?: ICaptionsConfig;
}

export interface IDeleteDataSourceParams extends IDataSourceParams {
  mergeInto?: string;
}

export interface IDeleteDataSourceResponse {
  migrated: boolean;
  affected: {
    visualizations: number;
    folders: number;
  };
}