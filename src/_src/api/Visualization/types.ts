/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import { VizEdge, VizNode } from '../..';
import {IDataSourceParams} from '../commonTypes';
import { ISimpleUser } from '../User/types';


export interface IMergeVisualizationsParams {
  from: number;
  to: number;
}

export interface IUpdateVisualizationFolderParams extends IDataSourceParams {
  id: number;
  title?: string;
  parent?: number;
}

export interface IVisualizationDesign {
  styles?: any;
  palette?: any;
}

export interface IVisualizationGeo {
  latitudeProperty?: string;
  longitudeProperty?: string;
  layers?: string[];
}


export interface IAlternativeIdConfig {
  node: string;
  edge: string;
}

export interface IVisualizationLayout {
  algorithm?: string;
  mode?: string;
}

export enum VisuslizationMode {
  NODE_LINK = 'nodelink',
  GEO = 'geo'
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

export interface IVisualizationResponse {
  id: number;
  design: IVisualizationDesign;
  nodeFields: IItemFields;
  edgeFields: IItemFields;
  sourceKey: string;
  title: string;
  folder: number;
  nodes: VizNode[];
  edges: VizEdge[];
  alternativeIds: IAlternativeIdConfig;
  layout: IVisualizationLayout;
  geo: IVisualizationGeo;
  mode: VisuslizationMode;
  right: VisualizationRights;
  filters: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IWidgetContent extends IVisualizationDesign {
  title?: string;
  description?: string;
  url?: string;
  mode?: string;
  mapLayers?: any[];
  ui?: IWidgetUI;
}


export interface ICreateWidgetParams {
  visualizationId: number;
  content?: IWidgetContent;
}

export interface IUpdateWidgetParams extends  ICreateWidgetParams {}

export interface ICreateVisualizationFolderParams {
  title: string;
  parent: number;
}

export interface ICreateVisualizationFolderResponse {
  id: number;
  title: string;
  parent: number;
  sourceKey: string;
}

export interface ISharedVisualization extends IDataSourceParams {
  title: string;
  visualizationId: number;
  ownerId: number;
}

export enum VisualizationRights {
  READ = 'read',
  WRITE = 'write',
  OWNER = 'owner'
}
export interface IBaseShare {
  userId: number;
  right: VisualizationRights;
  visualizationId: number;
}

export interface ISharer extends IBaseShare {
  username: string;
  email: string;
}

export interface SharedWith {
  owner: ISimpleUser;
  shares: ISharer[];
  userId: number;
  right: VisualizationRights;
  visualizationId: number;
}

export interface IVisualizationShares {
  owner: ISimpleUser;
  shares: SharedWith[];
}

export interface ICreateVisualizationParams extends IDataSourceParams {
  title: string;
  folder?: number;
  nodes: VizNode[];
  edges: VizEdge[];
  alternativeIds?: IAlternativeIdConfig;
  layout?: IVisualizationLayout;
  mode?: string;
  geo?: IVisualizationGeo;
  design?: IVisualizationDesign;
  filters?: any[];
  nodeFields: IItemFields;
  edgeFields: IItemFields;
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

export interface IDuplicateVisualizationResponse {
  visualizationId: number;
}

export interface IGetWidgetParams {
 id: string;
}

export interface IGetWidgetResponse {
  title: string;
  key: string;
  userId: number;
  visualizationId: number;
  content: IWidgetContent;
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

export interface IVisualizationTree {
  type: 'visu' | 'folder';
  id: number;
  title: string;
  children?: IVisualizationTree[];
  shareCount?: number;
  widgetKey?: string;
}

export interface IDeleteVisualizationParams {
  id: number;
}

export interface IGetVisualizationSharesPrams extends IDataSourceParams {
  id: number;
}

export interface IShareVisualizationParams extends IDataSourceParams {
  userId: number;
  right?: string;
  vizId: number;
}

export interface IVisualizationShare {
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

export interface IItemFields {
  captions: {[key: string]: {displayName: boolean; properties: string[]; active: boolean}};
  types: {[key: string]: string};
}

export interface IUpdateSandboxParams extends IDataSourceParams {
  design?: IVisualizationDesign;
  nodeFields?: IItemFields;
  edgeFields?: IItemFields;
}

export interface IUpdateVisualizationParams extends Partial<ICreateVisualizationParams> {
  id: number;
  forceLock?: boolean;
}

export interface IVisualizationTree {
  type: 'visu' | 'folder';
  id: number;
  title: string;
  children?: IVisualizationTree[];
  shareCount?: number;
  widgetKey?: string;
}
