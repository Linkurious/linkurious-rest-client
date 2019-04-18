/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-11-28.
 *
 * File:
 * Description :
 */

'use strict';

import { Linkurious } from './src';
import { Fetcher } from './src/http/fetcher';
import { FetcherFactory } from './src/http/FetcherFactory';
import { Logger } from './src/log/Logger';
import { LinkuriousError } from './src/LinkuriousError';
import {
  Rejection,
  RejectionKey,
  BadGraphRequest,
  ConstraintViolation,
  DataSourceUnavailable,
  Forbidden,
  GraphRequestTimeout,
  GraphUnreachable,
  GroupExists,
  GuestDisabled,
  InvalidParameter,
  NotFound,
  Unauthorized,
  WriteForbidden,
  Cancelled,
  ClientError,
} from './src/response/errors';
import { ServerResponse } from './src/response';
import { Success } from './src/response/success';
import {
  BooleanTemplate,
  DateTemplate,
  DatetimeTemplate,
  EnumTemplate,
  NodesetTemplate,
  NodeTemplate,
  NumberTemplate,
  StringTemplate,
} from 'linkurious-shared/fesm5';

export type indexingStatus = 'ongoing' | 'needed' | 'done' | 'unknown';
export type EdgeOrientation = 'in' | 'out' | 'both';
export type ItemType = 'node' | 'edge';
export type ItemsType = 'nodes' | 'edges';
export type RightType = 'read' | 'write' | 'none' | 'do';
export type PopulateType = 'expandNodeId' | 'nodeId' | 'edgeId' | 'searchNodes' | 'searchEdges' | 'pattern';
export type ItemId = string | number;
export type VisualizationModeType = 'nodelink' | 'geo';
export type ShareRightType = 'read' | 'write' | 'owner';
export type ConstraintsOperatorType = 'contains' | 'equals' | 'more than' | 'less than' | 'starts with';
export type MatchStatus = 'unconfirmed' | 'confirmed' | 'dismissed';
export type MatchActionType = 'open' | 'confirm' | 'dismiss' | 'unconfirm';
export type TypeAccessRight = 'writable' | 'readable' | 'editable' | 'none';

export type IIndexationCallback = (res: IIndexationStatus) => void;

export interface FetcherConfig {
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  ignoreContentType?: boolean;
  dataSource?: string | number;
  body?: { [key: string]: unknown };
  query?: { [key: string]: unknown };
}

export interface RequestConfig<R, T> extends FetcherConfig {
  transform?: (r: R) => T;
}

export interface IClientState {
  user: IFullUser | undefined;
  currentSource: IDataSourceState;
  guestMode: boolean;
}

export interface IFetcherClientState {
  user: IFullUser;
  currentSource: IDataSource;
  guestMode: boolean;
}

// NODE & EDGE

export interface IIdentifiedItem {
  id: ItemId;
}

export interface IIdentifiedItemList {
  ids: Array<ItemId>;
}

export interface IItem extends IIdentifiedItem {
  data: any;
  source?: ItemId;
  target?: ItemId;
}

export interface IEdge extends IItem {
  type: string;
  source: ItemId;
  target: ItemId;
  readAt: string;
}

export interface INode extends IItem {
  statistics?: Array<IDigest>;
  readAt: string;
  categories: any;
}

export interface IFullNode extends INode {
  edges: Array<IEdge>;
}

export interface ISearchNode extends INode {
  children: Array<INode>;
  title: string;
}

// USER

export interface IIdentified {
  id: number;
}

export interface ISimpleUser extends IIdentified {
  username: string;
  email: string;
}

export interface IUser extends ISimpleUser {
  groups: Array<ISimpleGroup>;
  source: 'string';
  admin?: boolean;
}

export interface IFullUser extends IUser {
  preferences: any;
  actions: any;
  locale: string;
}

// GROUP

export interface IBaseGroup extends IIdentified {
  name: string;
}

export interface ISimpleGroup extends IBaseGroup {
  builtin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGroup extends ISimpleGroup {
  userCount?: number;
  accessRights?: Array<IAccessRight>;
  sourceKey: string;
}

export interface IAccessRight extends IDataSourceRelative {
  type: RightType;
  targetType: string;
  targetName: string;
}

export interface IGroupRights {
  types: Array<string>;
  targetTypes: Array<string>;
  actions: Array<string>;
}

// DATA-SOURCE

export interface IDataSource {
  name: string;
  key: string;
  configIndex: number;
}

export interface IDataSourceState {
  name: string;
  key: string;
  configIndex: number;
  connected: boolean;
  state: string;
  reason: string;
  error?: string;
  features: any;
  settings: any;
}

export interface IFullDataSource extends IDataSource {
  state: string;
  lastSeen: string;
  indexedDate: string;
  host: string;
  port: string;
  storeId: string;
  visualizationCount: number;
}

export interface IIndexationStatus {
  indexing_progress: number;
  node_count: number;
  edge_count: number;
  index_size: number;
  indexed_source: string;
  indexing_status: string;
  indexing: indexingStatus;
}

export interface IDeletedDataSource {
  migrated: boolean;
  affected: IAffectedSource;
}

export interface IAffectedSource {
  visualizations: number;
  folders: number;
}

export interface IBaseGraphConfig {
  alternativeEdgeId?: string;
  alternativeNodeId?: string;
  latitudeProperty?: string;
  longitudeProperty?: string;
}

export interface INeo4Config extends IBaseGraphConfig {
  vendor: 'neo4j';
  url: string;
  webAdmin?: string;
  user?: string;
  password?: string;
  allowSelfSigned?: boolean;
  proxy?: string;
  writeUrl?: string;
}

export interface ITitanConfig extends IBaseGraphConfig {
  vendor: 'titan';
  url: string;
  configurationPath: string;
}

export interface IDseConfig extends IBaseGraphConfig {
  vendor: 'dse';
  url: string;
  graphName: string;
  create?: boolean;
}

export interface IElasticSearchConfig {
  vendor: 'elasticSearch';
  host: string;
  port: number;
  forceReindex: boolean;
  dynamicMapping: boolean;
  dateDetection?: boolean;
  https?: boolean;
  user?: string;
  password?: string;
}

// QUERY

export interface ISimpleGraphQuery extends IIdentified {
  name: string;
  content: string;
  dialect: string;
}

export interface IGraphQuery extends ISimpleGraphQuery {
  id: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  sourceKey: string;
  write: boolean;
  graphInput: 'none' | '1-node' | '2-nodes' | 'nodeset' | undefined;
  sharing: 'private' | 'source' | 'groups';
  builtin: boolean;
  sharedWithGroups: Array<number> | undefined;
  right: 'owner' | 'read';
  type: 'template' | 'static';
  templateFields?: Array<
    | NumberTemplate
    | StringTemplate
    | EnumTemplate
    | NodeTemplate
    | NodesetTemplate
    | DateTemplate
    | DatetimeTemplate
    | BooleanTemplate
  >;
}

// SEARCH

export interface ISearchResult {
  // todo:remove ambiguity node/nodes/edge/edges (i.e. fix on server too)
  type: ItemsType | ItemType;
  totalHits?: number;
  moreResults?: boolean;
}

export interface ISearchEdgesInDirectory extends ISearchResult {
  results: Array<IEdge>;
}

export interface ISearchNodesInDirectory extends ISearchResult {
  results: Array<INode>;
}

export interface ISearchItemList extends ISearchResult {
  results: Array<ISearchMatchGroup>;
}

export interface ISearchFullItems extends ISearchResult {
  results: Array<INode>;
}

export interface ISearchMatchGroup {
  title: string;
  categories: Array<string>;
  children: Array<ISearchMatch>;
}

export interface ISearchMatch {
  id: ItemId;
  name: string;
  field: string;
  value: string;
}

// SCHEMA

export interface IBaseSchema {
  nodeCategories: Array<string>;
}

export interface ISchema extends IBaseSchema {
  edgeTypes: Array<string>;
  nodeProperties: Array<string>;
  edgeProperties: Array<string>;
}

export interface IDigest extends IBaseSchema {
  edgeType: string;
  nodes: number;
  edges: number;
}

export interface IAlternativeIdConfig {
  node: string;
  edge: string;
}

export interface ICountItemType {
  count: number;
}

export interface IProperty extends ICountItemType {
  key: string;
  type?: string;
}

export interface IItemType extends ICountItemType {
  name: string;
  access: TypeAccessRight;
  properties: Array<IProperty>;
}

// APP

export interface IAppStatus {
  code: number;
  name: string;
  message: string;
  uptime: number;
}

export interface IAppVersion {
  tag_name: string;
  name: string;
  prerelease: boolean;
}

export interface IAppConfig {
  allSources: IDataSourcesConfig;
  locale: string;
  access: IRightsConfig;
  analytics: IAnalyticsConfig;
  sigma: any;
  palette: any;
  styles: any;
  leaflet: ILeafletConfig;
  source: ISourceConfig;
  graphDb?: any;
  index?: any;
  sourceName?: string;
  enterprise: boolean;
  domain: string;
}

export interface IDataSourcesConfig {
  maxPathLength: number;
  shortestPathsMaxResults: number;
  connectionRetries: number;
  pollInterval: number;
  indexationChunkSize: number;
  expandThreshold: number;
  searchAddAllThreshold: number;
  searchThreshold: number;
  minSearchQueryLength: number;
  rawQueryTimeout: number;
}

export interface IRightsConfig {
  authStrategies: Array<string>;
  authRequired: boolean;
  dataEdition: boolean;
  loginTimeout: number;
  widget: boolean;
}

export interface IAnalyticsConfig {
  enabled: boolean;
  code: string;
  domain: string;
}

export interface ILeafletConfig {
  name: string;
  thumbnail: string;
  urlTemplate: string;
  attribution: string;
  subdomains: string;
  id: string;
  accessToken: string;
  minZoom: number;
  maxZoom: number;
}

export interface ISourceConfig {
  features: any;
  alternativeIds?: IAlternativeIdConfig;
  latitudeProperty?: string;
  longitudeProperty?: string;
  directory: IDirectoryEnabled;
}

export interface IDirectoryEnabled {
  nodes: boolean;
  edges: boolean;
}

// VISUALIZATION

export interface IOgmaEdge {
  id: string | number;
  source: string | number;
  target: string | number;
  data: {
    type: string;
    selected?: boolean;
    properties: any;
    readAt: string;
  };
}

export interface IOgmaNode {
  id: string | number;
  x: number;
  y: number;
  data: {
    categories: Array<string>;
    properties: any;
    statistics: any;
    geo?: INodeCoordinates;
    nodelink?: any;
    selected?: boolean;
    readAt: string;
  };
}

export interface INodeCoordinates {
  longitude?: number;
  latitude?: number;
  longitudeDiff?: number;
  latitudeDiff?: number;
}

export interface ISandBox {
  design: IVisualizationDesign;
  nodeFields: IItemFields;
  edgeFields: IItemFields;
}

export interface IServerVisualization extends ISandBox, IIdentified {
  title: string;
  folder: number;
  nodes: Array<INode>;
  edges: Array<IEdge>;
  alternativeIds: IAlternativeIdConfig;
  layout: IVisualizationLayout;
  geo: IVisualizationGeo;
  mode: VisualizationModeType;
  filters: Array<any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVisualization extends ISandBox, IIdentified {
  title: string;
  folder: number;
  nodes: Array<IOgmaNode>;
  edges: Array<IOgmaEdge>;
  alternativeIds: IAlternativeIdConfig;
  layout: IVisualizationLayout;
  geo: IVisualizationGeo;
  mode: VisualizationModeType;
  filters: Array<any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface IQueryVisualization {
  design?: IVisualizationDesign;
  nodeFields?: IItemFields;
  edgeFields?: IItemFields;
  title?: string;
  folder?: number;
  nodes?: Array<IVisualizationNode>;
  edges?: Array<IVisualizationEdge>;
  alternativeIds?: IAlternativeIdConfig;
  layout?: IVisualizationLayout;
  geo?: IVisualizationGeo;
  mode?: VisualizationModeType;
  filters?: Array<any>;
}

export interface IItemFields {
  captions: { [key: string]: { displayName: boolean; properties: Array<string>; active: boolean } };
  types: { [key: string]: string };
}

export interface IFields {
  name: string;
  active: boolean;
}

export interface IVisualizationEdge extends IIdentifiedItem {
  selected?: boolean;
}

export interface IVisualizationNode extends IVisualizationEdge {
  nodelink: INodeLink;
  geo?: INodeGeo;
}

export interface INodeGeo {
  latitude?: number;
  longitude?: number;
  latitudeDiff?: number;
  longitudeDiff?: number;
}

export interface INodeLink {
  x: number;
  y: number;
  fixed?: boolean;
}

export interface IVisualizationLayout {
  algorithm?: string;
  mode?: string;
}

export interface IVisualizationGeo {
  latitudeProperty?: string;
  longitudeProperty?: string;
  layers?: Array<string>;
}

export interface IVisualizationDesign {
  styles?: any;
  palette?: any;
}

export interface IWidget {
  title: string;
  key: string;
  userId: number;
  visualizationId: number;
  content: IWidgetContent;
}

export interface IWidgetContent extends IVisualizationDesign {
  title?: string;
  description?: string;
  url?: string;
  mode?: string;
  mapLayers?: Array<any>;
  ui?: IWidgetUI;
}

export interface IWidgetUI {
  search?: boolean;
  share?: boolean;
  layout?: boolean;
  fullscreen?: boolean;
  zoom?: boolean;
  legend?: boolean;
  geo?: boolean;
}

export interface IFolderFullResponse {
  folder: IFolder;
}

export interface IFolder {
  id: number;
  title: string;
  parent: number;
  sourceKey: string;
}

export interface IBaseShare {
  userId: number;
  right: ShareRightType;
  visualizationId: number;
}

export interface IShare extends IBaseShare {
  updatedAt: string;
  createdAt: string;
}

export interface ISharer extends IBaseShare {
  username: string;
  email: string;
}

export interface ISharers {
  owner: ISimpleUser;
  shares: Array<ISharer>;
}

export interface ITreeChildren {
  type: 'visu' | 'folder';
  id: number;
  title: string;
  children?: Array<ITreeChildren>;
  shareCount?: number;
  widgetKey?: string;
}

export interface IConstraint {
  property: string;
  operator: ConstraintsOperatorType;
  value: any;
}

export interface IBaseRequest {}

export interface IDataSourceConfig {
  dataSourceIndex?: number;
}

export interface IDataSourceKey {
  sourceKey: string;
}

export interface IAlertRunProblem {
  error: Object;
  partial: boolean;
}

export interface IBaseAlert {
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminAlert extends IBaseAlert, IDataSourceKey {
  query: string;
  dialect: string;
  enabled: boolean;
  cron: string;
  nextRun: string;
}

export interface IFullAdminAlert extends IAdminAlert, IIdentified {
  matchTTL: number;
  scoreColumn: string;
  sortDirection: string;
  maxMatches: number;
  maxRuntime: number;
  userId: number;
  lastRun: string;
  lastRunProblem: IAlertRunProblem;
}

export interface IMatch extends IIdentified, IBaseAlert {
  alertId: number;
  score: number;
  hash: string;
  status: MatchStatus;
  user: ISimpleUser;
  nodes: Array<number>;
  edges: Array<number>;
  expirationDate: string;
}

export interface IMatchAction extends IIdentified {
  action: MatchActionType;
  matchId: number;
  user: ISimpleUser;
  createdAt: string;
  updatedAt: string;
}

export interface IMatchStats {
  unconfirmed: number;
  confirmed: number;
  dismissed: number;
}

export interface IMatchResults {
  counts: IMatchStats;
  matches: Array<IMatch>;
}

export interface IGetAdjacentEdges extends IDataSourceRelative, IBaseRequest {
  orientation?: EdgeOrientation;
  type?: string;
  skip?: number;
  limit?: number;
  nodeId?: ItemId;
  source?: ItemId;
  target?: ItemId;
  adjacent?: ItemId;
}

export interface IGetEdgeTypes extends IDataSourceRelative, IBaseRequest {
  includeType?: boolean;
}

export interface ICreateEdge extends IDataSourceRelative, IBaseRequest {
  source: ItemId;
  target: ItemId;
  type: string;
  data: any;
}

export interface IUpdateEdge extends IIdentifiedItem, IDataSourceRelative, IBaseRequest {
  properties: any;
  deletedProperties: Array<string>;
  readAt: string;
}

export interface IGetUserList extends IBaseRequest {
  filter?: string;
  groupId?: Array<number>;
  unwantedIds?: Array<number>;
  size?: number;
  start?: number;
}

export interface ICreateUser extends IBaseRequest {
  username: string;
  email: string;
  password: string;
  groups?: Array<string | number>;
}

export interface ICreateGraphQuery extends IDataSourceRelative, IBaseRequest {
  dialect: string;
  content: string;
  name: string;
}

export interface IUpdateBatchUser extends IBaseRequest {
  users: Array<number>;
  addGroups: Array<number>;
  rmGroups: Array<number>;
}

export interface ICreateGroup extends IBaseRequest, IDataSourceRelative {
  name: string;
}

export interface IUpdateGroupRights extends IDataSourceRelative, IIdentified, IBaseRequest {
  type: string;
  targetType: string;
  targetName: string;
}

export interface IUpdateBatchGroupRights extends IDataSourceRelative, IBaseRequest {
  groupIds: Array<number>;
  rightType: RightType;
  targetType: string;
}

export interface ICreateDataSource extends IBaseRequest {
  name: string;
  graphDb: INeo4Config | ITitanConfig | IDseConfig;
  index: IElasticSearchConfig;
}

export interface IDeleteDataSource extends IDataSourceRelative, IBaseRequest {
  sourceKey: string;
  mergeInto?: string;
}

export interface ISetDataSourceProperties extends IDataSourceRelative, IBaseRequest {
  properties: Array<string>;
}

export interface IUpdateGraphQuery extends IDataSourceRelative, IIdentified, IBaseRequest {
  name?: string;
  content?: string;
}

export interface ISendQuery extends IDataSourceRelative, IBaseRequest {
  dialect: string;
  query: string;
  groupResults?: boolean;
  limit?: number;
  timeout?: number;
  columns?: Array<{ type: string; columnName: string }>;
  with_digest?: boolean;
  with_degree?: boolean;
}

export interface IGetShortestPaths extends IDataSourceRelative, IBaseRequest {
  startNode: ItemId;
  endNode: ItemId;
  maxDepth?: number;
  withDigest?: boolean;
}

export interface IGetDirectory extends IDataSourceRelative, IBaseRequest {
  categoriesOrTypes?: Array<string>;
  properties: Array<string>;
  constraints?: IConstraint;
  pageSize?: number;
  pageStart?: number;
}

export interface IGetItemProperties extends IDataSourceRelative, IBaseRequest {
  includeType?: string;
  omitNoindex?: boolean;
}

export interface IGetVisualization extends IIdentified {
  populated?: boolean;
  withDigest?: boolean;
}

export interface IGetNode extends IIdentifiedItem, IDataSourceRelative, IBaseRequest {
  withEdges?: boolean;
  withDigest?: boolean;
}

export interface IGetAdjacentItems extends IIdentifiedItemList, IDataSourceRelative, IBaseRequest {
  ignoredNodes: Array<ItemId>;
  visibleNodes: Array<ItemId>;
  nodeCategory?: string;
  edgeType?: string;
  limit?: number;
  limitType?: string;
  withDigest: boolean;
}

export interface IGetItemTypes extends IDataSourceRelative, IBaseRequest {
  includeType?: boolean;
  omitInferred: boolean;
}

export interface ICreateNode extends IDataSourceRelative, IBaseRequest {
  data?: any;
  categories?: Array<string>;
}

export interface IUpdateNode extends IIdentifiedItem, IDataSourceRelative, IBaseRequest {
  properties: any;
  deletedProperties: Array<string>;
  addedCategories: Array<string>;
  deletedCategories: Array<string>;
  readAt: number;
}

export interface IUpdateAppConfig extends IDataSourceConfig, IBaseRequest {
  path: string;
  configuration: any;
  reset?: boolean;
}

export interface IGetSandbox extends IDataSourceRelative, IBaseRequest {
  populate?: PopulateType;
  itemId?: number;
  searchQuery?: string;
  searchFuzziness?: number;
  patternQuery?: string;
  doLayout?: boolean;
  patternDialect?: string;
}

export interface ICreateWidget extends IDataSourceRelative, IBaseRequest {
  visualization_id: number;
  content: IWidgetContent;
}

export interface ICreateFolder extends IDataSourceRelative, IBaseRequest {
  title: string;
  parent: number;
}

export interface IDuplicateVisualization extends IDataSourceRelative, IIdentified {
  title: string;
  folder: number;
}

export interface ICreateVisualization extends IDataSourceRelative, IBaseRequest {
  title: string;
  folder?: number;
  nodes: Array<IVisualizationNode>;
  edges: Array<IVisualizationEdge>;
  alternativeIds?: IAlternativeIdConfig;
  layout?: IVisualizationLayout;
  mode?: string;
  geo?: IVisualizationGeo;
  design?: IVisualizationDesign;
  filters?: Array<any>;
  nodeFields: IItemFields;
  edgeFields: IItemFields;
}

export interface ISetShareRights extends IDataSourceRelative, IBaseRequest {
  userId: number;
  right?: string;
  vizId: number;
}

export interface IUnshareVisualization extends IDataSourceRelative, IIdentified, IBaseRequest {
  userId: number;
}

export interface IUpdateFolder extends IDataSourceRelative, IIdentified, IBaseRequest {
  key: string;
  value: string;
}

export interface IUpdateSandbox extends IDataSourceRelative, IBaseRequest {
  visualization: ISandBox;
}

export interface IUpdateVisualization extends IDataSourceRelative, IBaseRequest {
  id: IIdentified;
  visualization: IQueryVisualization;
  forceLock?: boolean;
}

export interface ICreateAlert extends IDataSourceRelative, IBaseRequest {
  title?: string;
  query?: string;
  dialect?: string;
  enabled?: boolean;
  cron?: string;
  matchTTL?: number;
  scoreColumn?: string;
  scoreDirection?: string;
  maxMatches?: number;
  maxRuntime?: number;
}

export interface IAlert extends IDataSourceRelative, IBaseRequest {
  id: number;
}

export interface IAddActionMatch extends IIdentified, IDataSourceRelative {
  action: string;
  matchId: number;
}

export interface IFilteredAlert extends IAlert {
  offset?: number;
  limit?: number;
  sort_direction?: 'asc' | 'desc';
  sort_by?: string;
  status?: MatchStatus;
}

export interface ILoggerDriver {
  debug: (message: string) => void;
  error: (message: string) => void;
}

export interface IHttpResponse {
  statusCode: number;
  body: any;
  header: Object;
}

export interface IHttpDriver {
  POST(uri: string, data?: any): Promise<IHttpResponse>;

  PUT(uri: string, data: any): Promise<IHttpResponse>;

  PATCH(uri: string, data: any): Promise<IHttpResponse>;

  GET(uri: string, data?: any): Promise<IHttpResponse>;

  DELETE(uri: string, data?: any): Promise<IHttpResponse>;
}

export interface IFetchConfig {
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  ignoreContentType?: boolean;
  dataSource?: string | number;
  id?: number;
  body?: any;
  query?: any;
}

export interface IDataSourceRelative {
  dataSourceKey?: string;
  dataSourceIndex?: number;
}

export interface IDataToSend {
  queryData?: any;
  bodyData?: any;
}

export {
  Linkurious,
  Fetcher,
  FetcherFactory,
  Logger,
  LinkuriousError,
  Rejection,
  RejectionKey,
  BadGraphRequest,
  ConstraintViolation,
  DataSourceUnavailable,
  Forbidden,
  GraphRequestTimeout,
  GraphUnreachable,
  GroupExists,
  GuestDisabled,
  InvalidParameter,
  NotFound,
  Unauthorized,
  WriteForbidden,
  Cancelled,
  ClientError,
  ServerResponse,
  Success,
};
