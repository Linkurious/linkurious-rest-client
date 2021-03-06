/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, PersistedItem, Tree} from '../commonTypes';
import {
  VizEdge,
  IVizEdgeInfo,
  VizNode,
  IVizNodeInfo,
  WidgetEdge,
  WidgetNode
} from '../graphItemTypes';
import {GraphQueryDialect} from '../GraphQuery';
import {IRangeValues, ItemSelector, IStyles} from '../displayTypes';
import {User} from '../User';
import {IAlternativeIdSettings} from '../DataSource';

export interface IGetVisualizationParams extends IDataSourceParams {
  id: number;
  withDigest?: boolean;
  withDegree?: boolean;
}

export enum VisualizationRight {
  READ = 'read',
  WRITE = 'write',
  WRITE_FILTERED = 'write-filtered',
  OWNER = 'owner',
  OWNER_FILTERED = 'owner-filtered'
}

export enum ShareVisualizationRight {
  READ = 'read',
  WRITE = 'write',
  OWNER = 'owner'
}

export enum VisualizationMode {
  NODE_LINK = 'nodelink',
  GEO = 'geo'
}

export interface ICaptionConfig {
  displayName: boolean;
  properties: string[];
  active: boolean;
}

export type ItemFieldsCaptions = GenericObject<ICaptionConfig>;

export interface IItemFields {
  captions: ItemFieldsCaptions;
  types: GenericObject<GenericObject<{type: 'string' | 'number'}>>;
}

export interface IVisualizationDesign {
  palette: {
    default: string[];
  };
  styles: IStyles;
}

export interface IVisualizationGeo {
  layers: string[];
}

export type VisualizationLayout = IForceAlgorithm | IHierarchicalAlgorithm | IRadialAlgorithm;

export enum ForceLayoutMode {
  BEST = 'best',
  FAST = 'fast'
}

export enum HierarchicalLayoutMode {
  LR = 'LR',
  RL = 'RL',
  TB = 'TB',
  BT = 'BT'
}

export enum LayoutAlgorithm {
  FORCE = 'force',
  HIERARCHICAL = 'hierarchical',
  RADIAL = 'radial'
}

export interface IForceParameters {
  mode: ForceLayoutMode;
}

export interface IHierarchicalParameters {
  mode: HierarchicalLayoutMode;
  rootNode?: string;
}

export interface IRadialParameters {
  rootNode: string;
}

export interface IForceAlgorithm extends IForceParameters {
  algorithm: LayoutAlgorithm.FORCE;
}

export interface IHierarchicalAlgorithm extends IHierarchicalParameters {
  algorithm: LayoutAlgorithm.HIERARCHICAL;
}

export interface IRadialAlgorithm extends IRadialParameters {
  algorithm: LayoutAlgorithm.RADIAL;
}

export interface IVisualizationFilters {
  node: ItemSelector[];
  edge: ItemSelector[];
}

export enum ZoomLevel {
  YEARS = 'years',
  MONTHS = 'months',
  DAYS = 'days',
  HOURS = 'hours',
  MINUTES = 'minutes',
  SECONDS = 'seconds'
}

export interface IVisualizationTimeline {
  node: GenericObject<string>;
  edge: GenericObject<string>;
  range?: IRangeValues;
  zoomLevel?: ZoomLevel;
}

export interface BaseVisualization {
  nodes: IVizNodeInfo[];
  edges: IVizEdgeInfo[];
  nodeFields: IItemFields;
  edgeFields: IItemFields;
  design: IVisualizationDesign;
  filters: IVisualizationFilters;
  edgeGrouping?: GenericObject<boolean>;
  alternativeIds: IAlternativeIdSettings;
  mode: VisualizationMode;
  layout: VisualizationLayout;
  geo: IVisualizationGeo;
  timeline?: IVisualizationTimeline;
}

export interface Visualization extends BaseVisualization, PersistedItem {
  title: string;
  folder: number;
  nodes: IVizNodeInfo[];
  edges: IVizEdgeInfo[];
  nodeFields: IItemFields;
  edgeFields: IItemFields;
  design: IVisualizationDesign;
  filters: IVisualizationFilters;
  edgeGrouping: GenericObject<boolean>;
  sourceKey: string;
  sandbox: boolean;
  alternativeIds: IAlternativeIdSettings;
  mode: VisualizationMode;
  layout: VisualizationLayout;
  geo: IVisualizationGeo;
  timeline: IVisualizationTimeline;
  // TODO viz.user and viz.right are defined only on getVisualization
  user: Pick<User, 'id' | 'username' | 'email'>;
  right: VisualizationRight;
  widgetKey?: string; // defined if the visualization has a widget
}

export interface PopulatedVisualization extends Visualization {
  nodes: VizNode[];
  edges: VizEdge[];
}

export interface ICreateVisualizationParams extends IDataSourceParams {
  title: string;
  folder?: number;
  nodes: IVizNodeInfo[];
  edges: IVizEdgeInfo[];
  alternativeIds?: IAlternativeIdSettings;
  mode?: VisualizationMode;
  design?: IVisualizationDesign;
  nodeFields?: IItemFields;
  edgeFields?: IItemFields;
  filters?: IVisualizationFilters;
  edgeGrouping?: GenericObject<boolean>;
  timeline?: IVisualizationTimeline;
  layout?: VisualizationLayout;
  geo?: IVisualizationGeo;
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
    widgetKey?: string; // defined if the visualization has a widget
    createdAt: string;
    updatedAt: string;
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
  CASE_ID = 'caseId'
}

export interface IGetSandboxParams extends IDataSourceParams {
  populate?: PopulateType;
  itemId?: string;
  caseId?: number;
  searchQuery?: string;
  searchFuzziness?: number;
  patternQuery?: string;
  patternDialect?: GraphQueryDialect;
  doLayout?: boolean;
  withDigest?: boolean;
  withDegree?: boolean;
}

export interface IUpdateSandboxParams extends IDataSourceParams {
  design?: IVisualizationDesign;
  nodeFields?: IItemFields;
  edgeFields?: IItemFields;
  geo?: IVisualizationGeo;
}

export interface IGetVisualizationSharesParams extends IDataSourceParams {
  id: number;
}

export interface GetVisualizationSharesResponse {
  owner: Pick<User, 'id' | 'username' | 'email'>;
  shares: Array<{
    userId: number;
    visualizationId: number;
    username: string;
    email: string;
    right: VisualizationRight;
  }>;
}

export interface IShareVisualizationParams extends IDataSourceParams {
  id: number;
  userId: number;
  right: ShareVisualizationRight;
}

export interface VisualizationShare {
  userId: number;
  right: VisualizationRight;
  visualizationId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUnshareVisualizationParams extends IDataSourceParams {
  id: number;
  userId: number;
}

export interface IGetWidgetParams {
  widgetKey: string;
}

export interface WidgetContent {
  graph: {nodes: WidgetNode[]; edges: WidgetEdge[]};
  legend: boolean;
  mapLayers: boolean;
  mode: VisualizationMode;
  ui: boolean;
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
