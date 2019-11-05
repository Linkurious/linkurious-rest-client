/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, PersistedItem, Tree} from '../commonTypes';
import {VizEdge, VizEdgeInfo, VizNode, VizNodeInfo} from '../graphItemTypes';
import {AlternativeIdSettings} from '../DataSource';
import {GraphQueryDialect} from '../GraphQuery';
import {Styles} from '../displayTypes';

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
  palette: {
    default: string[];
  };
  styles: Styles;
}

export interface VisualizationGeo {
  latitudeProperty?: string;
  longitudeProperty?: string;
  layers: string[];
}

// TODO make viz layout mandatory in the server
export type VisualizationLayout = ForceAlgorithm | HierarchicalAlgorithm | RadialAlgorithm;

export type ForceLayoutMode = 'best' | 'fast';
export type HierarchicalLayoutMode = 'LR' | 'RL' | 'TB' | 'BT';

export enum LayoutAlgorithm {
  FORCE = 'force',
  HIERARCHICAL = 'hierarchical',
  RADIAL = 'radial'
}

export interface ForceParameters {
  mode: ForceLayoutMode;
}

export interface HierarchicalParameters {
  mode: HierarchicalLayoutMode;
  rootNode?: string;
}

// TODO make rootNode mandatory in the server
export interface RadialParameters {
  rootNode: string;
}

export interface ForceAlgorithm extends ForceParameters {
  algorithm: LayoutAlgorithm.FORCE;
}

export interface HierarchicalAlgorithm extends HierarchicalParameters {
  algorithm: LayoutAlgorithm.HIERARCHICAL;
}

export interface RadialAlgorithm extends RadialParameters {
  algorithm: LayoutAlgorithm.RADIAL;
}

export interface VisualizationFilters {
  // TODO type this
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
  alternativeIds: AlternativeIdSettings;
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

export interface ICreateVisualizationParams extends IDataSourceParams {
  title: string;
  folder?: number;
  nodes: VizNodeInfo[];
  edges: VizEdgeInfo[];
  alternativeIds?: AlternativeIdSettings;
  mode?: string;
  design?: VisualizationDesign;
  nodeFields?: ItemFields;
  edgeFields?: ItemFields;
  filters?: VisualizationFilters;
  timeline?: VisualizationTimeline;
  layout?: VisualizationLayout;
  geo?: VisualizationGeo;
}

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

export interface IUpdateVisualizationFolderParams
  extends Partial<ICreateVisualizationFolderParams> {
  id: number;
}

export interface IDeleteVisualizationFolderParams extends IDataSourceParams {
  id: number;
}

export type VisualizationTree = Tree<
  {
    id: number;
    title: string;
    shareCount: number;
    widgetKey?: string;
  },
  'visu'
>;

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

export interface Widget {
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

export type IUpdateWidgetParams = ICreateWidgetParams;

export interface IDeleteWidgetParams {
  widgetKey: string;
}
