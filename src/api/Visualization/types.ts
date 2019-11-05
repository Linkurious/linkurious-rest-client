/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {FolderChildren, GenericObject, IDataSourceParams, PersistedItem} from '../commonTypes';
import {VizEdge, VizEdgeInfo, VizNode, VizNodeInfo} from '../graphItemTypes';
import {IAlternativeIdSettings} from '../DataSource';
import {GraphQueryDialect} from '../GraphQuery';

export interface IGetVisualizationCountParams extends IDataSourceParams {}

export type GetVisualizationCountResponse = number;

export interface IGetVisualizationParams extends IDataSourceParams {
  id: number;
  withDigest?: boolean;
  withDegree?: boolean;
}

export enum VisualizationRight {
  READ = 'read',
  WRITE = 'write',
  OWNER = 'owner'
}

export enum VisualizationMode {
  NODE_LINK = 'nodelink',
  GEO = 'geo'
}

export interface ItemFields {
  captions: GenericObject<{displayName: boolean; properties: string[]; active: boolean}>;
  types: GenericObject<'string' | 'number' | 'date-timestamp'>;
}

export interface VisualizationDesign {
  // TODO type visualization design
}

export interface VisualizationGeo {
  latitudeProperty?: string;
  longitudeProperty?: string;
  layers: string[];
}

export type VisualizationLayout =
  | {}
  | {
      algorithm: 'force';
      mode: 'best' | 'fast';
    }
  | {
      algorithm: 'hierarchical';
      mode: 'LR' | 'RL' | 'BT' | 'TB';
      rootNode?: string;
    }
  | {
      algorithm: 'radial';
      rootNode?: string;
    };

export interface VisualizationFilters {
  // TODO type visualization filters
}

export interface VisualizationTimeline {
  node: GenericObject<string>;
  edge: GenericObject<string>;
  range: {
    '<='?: number;
    '<'?: number;
    '>'?: number;
    '>='?: number;
  };
  zoomLevel: 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds';
}

export interface Visualization extends PersistedItem {
  title: string;
  sourceKey: string;
  folder: number;
  nodes: VizNode[];
  edges: VizEdge[];
  right: VisualizationRight;
  widgetKey?: string;
  sandbox: boolean;
  alternativeIds: IAlternativeIdSettings;
  mode: VisualizationMode;
  design: VisualizationDesign;
  nodeFields: ItemFields;
  edgeFields: ItemFields;
  filters: VisualizationFilters;
  timeline: VisualizationTimeline;
  layout: VisualizationLayout;
  geo: VisualizationGeo;
  user: {
    username: string;
    email: string;
  };
}

export type GetVisualizationResponse = Visualization;

export interface ICreateVisualizationParams extends IDataSourceParams {
  title: string;
  folder?: number;
  nodes: VizNodeInfo[];
  edges: VizEdgeInfo[];
  alternativeIds?: IAlternativeIdSettings;
  mode?: string;
  design?: VisualizationDesign;
  nodeFields?: ItemFields;
  edgeFields?: ItemFields;
  filters?: VisualizationFilters;
  timeline?: VisualizationTimeline;
  layout?: VisualizationLayout;
  geo?: VisualizationGeo;
}

export type CreateVisualizationResponse = Visualization;

export interface IDuplicateVisualizationParams extends IDataSourceParams {
  id: number;
  title?: string;
  folder?: number;
}

export type DuplicateVisualizationResponse = {
  visualizationId: number;
};

export interface IDeleteVisualizationParams extends IDataSourceParams {
  id: number;
}

// TODO forceLock and doLayout camelCase in server
export interface IUpdateVisualizationParams extends IDataSourceParams {
  id: number;
  visualization: Partial<ICreateVisualizationParams>;
  forceLock?: boolean;
  doLayout?: boolean;
}

export interface IGetSharedVisualizationsParams extends IDataSourceParams {}

export type GetSharedVisualizationsResponse = Array<{
  right: VisualizationRight;
  visualizationId: number;
  ownerId: number;
  ownerUsername: string;
  sourceKey: string;
  title: string;
  updatedAt: string;
}>;

export interface ICreateVisualizationFolderParams extends IDataSourceParams {
  title: string;
  parent: number;
}

// TODO add createdAt updatedAt to server
export interface VisualizationFolder extends PersistedItem {
  title: string;
  parent: number;
  sourceKey: string;
}

export type CreateVisualizationFolderResponse = VisualizationFolder;

export interface IUpdateVisualizationFolderParams
  extends Partial<ICreateVisualizationFolderParams> {
  id: number;
}

// TODO unwrap folder in server
export type UpdateVisualizationFolderResponse = VisualizationFolder;

export interface IDeleteVisualizationFolderParams extends IDataSourceParams {
  id: number;
}

export interface IGetVisualizationTreeParams extends IDataSourceParams {}

export interface GetVisualizationTreeResponse {
  id: -1;
  title: 'root';
  type: 'folder';
  children: FolderChildren<
    {
      id: number;
      title: string;
      shareCount: number;
      widgetKey?: string;
    },
    'alert'
  >;
}

export enum PopulateType {
  VISUALIZATION_ID = 'visualizationId',
  EXPAND_NODE_ID = 'expandNodeId',
  NODE_ID = 'nodeId',
  EDGE_ID = 'edgeId',
  SEARCH_NODE = 'searchNodes',
  SEARCH_EDGE = 'searchEdges',
  PATTERN = 'pattern',
  MATCH_ID = 'matchId'
}

export interface IGetSandboxParams extends IDataSourceParams {
  populate?: PopulateType;
  itemId?: number;
  matchId?: number;
  searchQuery?: string;
  searchFuzziness?: number;
  patternQuery?: boolean;
  patternDialect?: GraphQueryDialect;
  doLayout?: boolean;
  withDigest?: boolean;
  withDegree?: boolean;
}

export type GetSandboxResponse = Visualization;

export interface IUpdateSandboxParams extends IDataSourceParams {
  design?: VisualizationDesign;
  nodeFields?: ItemFields;
  edgeFields?: ItemFields;
  geo?: VisualizationGeo;
  layout?: VisualizationLayout;
}

export interface IGetVisualizationSharesParams extends IDataSourceParams {
  id: number;
}

export interface GetVisualizationSharesResponse {
  owner: {
    id: number;
    username: string;
    email: string;
  };
  shares: Array<{
    userId: number;
    visualizationId: number;
    username: string;
    email: string;
    right: VisualizationRight;
  }>;
}

export interface IShareVisualizationParams extends IDataSourceParams {
  visualizationId: number;
  userId: number;
  right: 'read' | 'write';
}

export interface VisualizationShare {
  userId: number;
  right: VisualizationRight;
  visualizationId: number;
  updatedAt: string;
  createdAt: string;
}

export type ShareVisualizationResponse = VisualizationShare;

export interface IUnshareVisualizationParams extends IDataSourceParams {
  id: number;
  userId: number;
}

export interface IGetWidgetParams {
  widgetKey: string;
}

export interface WidgetContent {
  // TODO type this
}

interface Widget {
  title: string;
  key: string;
  userId: number;
  visualizationId: number;
  password: boolean;
  url: string;
  createdAt: string;
  updatedAt: string;
  content: WidgetContent;
}

export type GetWidgetResponse = Widget;

export interface ICreateWidgetParams {
  visualizationId: number;
  options?: {
    search?: boolean;
    share?: boolean;
    fullscreen?: boolean;
    zoom?: boolean;
    legend?: boolean;
    geo?: boolean;
    password?: string;
  };
}

export type CreateWidgetResponse = string;

export type IUpdateWidgetParams = ICreateWidgetParams;

export type UpdateWidgetResponse = string;

export interface IDeleteWidgetParams {
  widgetKey: string;
}
