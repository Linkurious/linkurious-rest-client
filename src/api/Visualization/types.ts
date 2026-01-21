/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {
  CommentMention,
  DeletableUser,
  GenericObject,
  IDataSourceParams,
  PaginationClause,
  PersistedItem,
  Tree
} from '../commonTypes';
import {
  VizEdge,
  IVizEdgeInfo,
  VizNode,
  IVizNodeInfo,
  WidgetEdge,
  WidgetNode,
  IVizNodeGroupInfo
} from '../graphItemTypes';
import {GraphQueryDialect} from '../GraphQuery';
import {IRangeValues, ItemSelector, IStyles, IStyleIcon, IStyleImage} from '../displayTypes';
import {User} from '../User';
import {IAlternativeIdSettings} from '../DataSource';
import {ILeafletConfig} from '../Config';

export interface IGetVisualizationParams extends IDataSourceParams {
  id: number;
  withDigest?: boolean;
  withDegree?: boolean;
}

export interface ReleaseVisualizationEditLockParams extends IDataSourceParams {
  id: number;
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

export interface VisualizationThumbnailNode {
  id: string;
  attributes: {[key: string]: unknown; color?: unknown};
}

export interface VisualizationThumbnailEdge {
  id: string;
  source: string;
  target: string;
  attributes: unknown;
}

/**
 * The information needed to generate a thumbnail SVG render of the visualization (in the frontend or other clients).
 *
 * It is not directly a SVG for performance and access rights reasons.
 * When saving a visualization the frontend can add thumbnail information obtainned via `ogma.export.json(...)`.
 * This information provided on save must contain metadata such as categories or edge types (`VisualizationThumbnailWithMetadata` type) .
 * This data will be stored and then exposed via `VisualizationTreeItem.thumbnail` or `SharedVisualization.thumbnail`.
 * The exposed thumbnail data (`VisualizationThumbnail` type) is filtered according to user access rights and does not contain the metadata mentioned above.
 * This data can be then used to generate a thumbnail via the `svg` Ogma util.
 */
export interface VisualizationThumbnail {
  nodes: VisualizationThumbnailNode[];
  edges: VisualizationThumbnailEdge[];
}

export interface VisualizationThumbnailNodeWithMetadata extends VisualizationThumbnailNode {
  data: {
    colorByCategory: GenericObject<string | null>;
  };
}

export interface VisualizationThumbnailEdgeWithMetadata extends VisualizationThumbnailEdge {
  data: {
    type: string;
  };
}

/**
 * The information needed to save a thumbnail with the visualization.
 * It will be later used to generate a thumbnail SVG render of the visualization (in the frontend or other clients).
 *
 * See also {@link VisualizationThumbnail}
 */
export interface VisualizationThumbnailWithMetadata {
  nodes: VisualizationThumbnailNodeWithMetadata[];
  edges: VisualizationThumbnailEdgeWithMetadata[];
}

export interface BaseVisualization {
  nodes: IVizNodeInfo[];
  nodeGroups?: IVizNodeGroupInfo[];
  edges: IVizEdgeInfo[];
  nodeFields: IItemFields;
  edgeFields: IItemFields;
  design: IVisualizationDesign;
  filters: IVisualizationFilters;
  edgeGrouping?: GenericObject<boolean>;
  nodeGroupingRuleIds: number[];
  alternativeIds: IAlternativeIdSettings;
  mode: VisualizationMode;
  layout: VisualizationLayout;
  geo: IVisualizationGeo;
  timeline?: IVisualizationTimeline;
  sandbox?: boolean; // optional on base visualization
}

export interface Visualization extends BaseVisualization, PersistedItem {
  spaceId?: number;
  title: string;
  description?: string;
  folder: number;
  nodes: IVizNodeInfo[];
  edges: IVizEdgeInfo[];
  nodeFields: IItemFields;
  edgeFields: IItemFields;
  design: IVisualizationDesign;
  filters: IVisualizationFilters;
  edgeGrouping: GenericObject<boolean>;
  sourceKey: string;
  sandbox: boolean; // mandatory on visualization
  alternativeIds: IAlternativeIdSettings;
  mode: VisualizationMode;
  layout: VisualizationLayout;
  geo: IVisualizationGeo;
  timeline: IVisualizationTimeline;
  // TODO viz.user and viz.right are defined only on getVisualization
  user?: Pick<User, 'id' | 'username' | 'email'>;
  right: VisualizationRight;
  widgetKey?: string; // defined if the visualization has a widget
  locked: boolean;
  lastLockedByUserId?: number;
  lastLockedByUser: Pick<User, 'username' | 'email'>;
  lastEditedByUser: Pick<User, 'username' | 'email'>;
}

export interface PopulatedVisualization extends Visualization {
  nodes: VizNode[];
  edges: VizEdge[];
}

export interface ICreateVisualizationParams extends IDataSourceParams {
  spaceId?: number;
  title: string;
  description?: string;
  folder?: number;
  nodes: IVizNodeInfo[];
  nodeGroupingRuleIds?: number[];
  nodeGroups?: IVizNodeGroupInfo[];
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
  thumbnail?: VisualizationThumbnailWithMetadata | null; // Set explicitly to null to remove an existing thumbnail
}

export interface IDuplicateVisualizationParams extends IDataSourceParams {
  id: number;
  title?: string;
  description?: string;
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

export interface SharedVisualization {
  right: VisualizationRight;
  visualizationId: number;
  ownerId: number;
  ownerUsername: string;
  sourceKey: string;
  title: string;
  description?: string;
  updatedAt: string;
  locked: boolean;
  lastLockedByUser: Pick<User, 'username' | 'email'>;
  lastEditedByUser: Pick<User, 'username' | 'email'>;
  thumbnail?: VisualizationThumbnail;
}

export type GetSharedVisualizationsResponse = SharedVisualization[];

export interface ICreateVisualizationFolderParams extends IDataSourceParams {
  title: string;
  parent: number;
  spaceId?: number;
}

export interface VisualizationFolder extends PersistedItem {
  title: string;
  parent: number;
  sourceKey: string;
  spaceId?: number;
}

export interface IUpdateVisualizationFolderParams
  extends Partial<ICreateVisualizationFolderParams> {
  id: number;
}

export interface IDeleteVisualizationFolderParams extends IDataSourceParams {
  id: number;
}

export interface VisualizationTreeItem {
  id: number;
  title: string;
  description?: string;
  shareCount: number;
  widgetKey?: string; // defined if the visualization has a widget
  createdAt: string;
  updatedAt: string;
  lastLockedByUser: Pick<User, 'username' | 'email'>;
  lastEditedByUser: Pick<User, 'username' | 'email'>;
  locked: boolean;
  thumbnail?: VisualizationThumbnail;
}

export type VisualizationTree = Tree<VisualizationTreeItem, 'visu'>;

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

export interface IGetVisualizationTreeParams extends IDataSourceParams {
  spaceId?: number;
}

export interface IGetSandboxParams extends IDataSourceParams {
  spaceId?: number;
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
    right: ShareVisualizationRight;
  }>;
}

export interface IShareVisualizationParams extends IDataSourceParams {
  id: number;
  userId: number;
  right: ShareVisualizationRight;
}

export interface VisualizationSharesParams {
  userId: number;
  right: ShareVisualizationRight;
}

export interface IShareWithMultipleUsersParams extends IDataSourceParams {
  id: number;
  shares: VisualizationSharesParams[];
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
  legend: {nodes: Legend; edges: Legend};
  mapLayers: ILeafletConfig[];
  mode: VisualizationMode;
  ui: {
    search: boolean;
    share: boolean;
    fullscreen: boolean;
    layout: boolean;
    zoom: boolean;
    legend: boolean;
    geo: boolean;
  };
}

export interface Legend {
  [key: string]: Array<{
    label: string;
    value: string | IStyleIcon | IStyleImage | number;
  }>;
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

export interface VisualizationCommentUser extends DeletableUser {
  hasAccess: boolean;
}

export interface VisualizationComment {
  id: number;
  content: string;
  user: VisualizationCommentUser;
  createdAt: string;
  metadata: CommentMetadata;
}

export interface CommentMetadata {
  mentions: CommentMention[];
}

export interface CreateVisualizationCommentParams extends IDataSourceParams {
  visualizationId: number;
  content: string;
}

export interface GetVisualizationCommentsParams extends IDataSourceParams, PaginationClause {
  visualizationId: number;
}

export interface DeleteVisualizationCommentParams extends IDataSourceParams {
  commentId: number;
}
