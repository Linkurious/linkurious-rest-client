/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {VizEdge, VizNode} from '../graphItemTypes';
import {FolderChildren, IDataSourceParams} from '../commonTypes';
import {SimpleUser} from '../User';

export interface IMergeVisualizationsParams {
  from: number;
  to: number;
}

export interface IUpdateVisualizationFolderParams extends IDataSourceParams {
  id: number;
  title?: string;
  parent?: number;
}

export interface VisualizationDesign {
  styles?: any;
  palette?: any;
}

export interface VisualizationGeo {
  latitudeProperty?: string;
  longitudeProperty?: string;
  layers?: string[];
}

export interface AlternativeIdConfig {
  node: string;
  edge: string;
}

export interface VisualizationLayout {
  algorithm?: string;
  mode?: string;
}

export enum VisuslizationMode {
  NODE_LINK = 'nodelink',
  GEO = 'geo'
}

export interface WidgetUI {
  search?: boolean;
  share?: boolean;
  layout?: boolean;
  fullscreen?: boolean;
  zoom?: boolean;
  legend?: boolean;
  geo?: boolean;
}

export interface VisualizationResponse {
  id: number;
  design: VisualizationDesign;
  nodeFields: ItemFields;
  edgeFields: ItemFields;
  sourceKey: string;
  title: string;
  folder: number;
  nodes: VizNode[];
  edges: VizEdge[];
  alternativeIds: AlternativeIdConfig;
  layout: VisualizationLayout;
  geo: VisualizationGeo;
  mode: VisuslizationMode;
  right: VisualizationRights;
  filters: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WidgetContent extends VisualizationDesign {
  title?: string;
  description?: string;
  url?: string;
  mode?: string;
  mapLayers?: any[];
  ui?: WidgetUI;
}

export interface ICreateWidgetParams {
  visualizationId: number;
  content?: WidgetContent;
}

export interface IUpdateWidgetParams extends ICreateWidgetParams {}

export interface ICreateVisualizationFolderParams {
  title: string;
  parent: number;
}

export interface CreateVisualizationFolderResponse {
  id: number;
  title: string;
  parent: number;
  sourceKey: string;
}

export interface SharedVisualization extends IDataSourceParams {
  title: string;
  visualizationId: number;
  ownerId: number;
}

export enum VisualizationRights {
  READ = 'read',
  WRITE = 'write',
  OWNER = 'owner'
}
export interface BaseShare {
  userId: number;
  right: VisualizationRights;
  visualizationId: number;
}

export interface Sharer extends BaseShare {
  username: string;
  email: string;
}

export interface SharedWith {
  owner: SimpleUser;
  shares: Sharer[];
  userId: number;
  right: VisualizationRights;
  visualizationId: number;
}

export interface VisualizationShares {
  owner: SimpleUser;
  shares: SharedWith[];
}

export interface ICreateVisualizationParams extends IDataSourceParams {
  title: string;
  folder?: number;
  nodes: VizNode[];
  edges: VizEdge[];
  alternativeIds?: AlternativeIdConfig;
  layout?: VisualizationLayout;
  mode?: string;
  geo?: VisualizationGeo;
  design?: VisualizationDesign;
  filters?: any[];
  nodeFields: ItemFields;
  edgeFields: ItemFields;
}

export interface IDeleteWidgetParams {
  id: string;
}

export interface IDeleteFolderParams {
  id: number;
}

export interface IDuplicateVisualizationParams {
  id: number;
  title?: string;
  folder?: number;
}

export interface DuplicateVisualizationResponse {
  visualizationId: number;
}

export interface IGetWidgetParams {
  id: string;
}

export interface GetWidgetResponse {
  title: string;
  key: string;
  userId: number;
  visualizationId: number;
  content: WidgetContent;
}

export enum PopulateType {
  EXPAND_NODE_ID = 'expandNodeId',
  NODE_ID = 'nodeId',
  EDGE_ID = 'edgeId',
  SEARCH_NODE = 'searchNodes',
  SEARCH_EDGE = 'searchEdges',
  PATTERN = 'pattern'
}

export interface IGetVisualizationSandboxParams {
  populate?: PopulateType;
  itemId?: number;
  searchQuery?: string;
  searchFuzziness?: number;
  doLayout?: boolean;
  patternDialect?: string;
  patternQuery?: boolean;
  withDigest?: boolean;
  withDegree?: boolean;
  matchId?: boolean;
}

export interface IGetVisualizationByIdParams {
  id: number;
  populated?: boolean;
  withDigest?: boolean;
  withDegree?: boolean;
}

export interface VizInfo {
  id: number;
  title: string;
  shareCount?: number;
  widgetKey?: string;
}

export interface GetVisualizationTreeResponse {
  id: -1;
  title: 'root';
  type: 'folder';
  children?: FolderChildren<VizInfo, 'visu'>;
}

export interface IDeleteVisualizationParams {
  id: number;
}

export interface IGetVisualizationSharesParams extends IDataSourceParams {
  id: number;
}

export interface IShareVisualizationParams extends IDataSourceParams {
  userId: number;
  right?: string;
  vizId: number;
}

export interface VisualizationShare {
  userId: number;
  right: VisualizationRights;
  visualizationId: number;
  updatedAt: string;
  createdAt: string;
}

export interface IUnshareVisualizationParams extends IDataSourceParams {
  id: number;
  userId: number;
}

export interface ItemFields {
  captions: {[key: string]: {displayName: boolean; properties: string[]; active: boolean}};
  types: {[key: string]: string};
}

export interface IUpdateSandboxParams extends IDataSourceParams {
  design?: VisualizationDesign;
  nodeFields?: ItemFields;
  edgeFields?: ItemFields;
}

export interface IUpdateVisualizationParams extends Partial<ICreateVisualizationParams> {
  id: number;
  forceLock?: boolean;
}
