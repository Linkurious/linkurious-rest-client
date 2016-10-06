/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-06-03.
 *
 * File:
 * Description :
 */
'use strict';

import {
  IIdentifiedItem, IDataSourceRelative, IBaseRequest, EdgeOrientation, ItemId, IIdentified,
  RightType, INeo4Config, ITitanConfig, IDseConfig, IElasticSearchConfig, IConstraint,
  IIdentifiedItemList, IDataSourceConfig, PopulateType, IWidgetContent, IVisualizationNode,
  IVisualizationEdge, IVisualizationLayout, IAlternativeIdConfig, IVisualizationGeo,
  IVisualizationDesign, IItemFields, ISandBox, IQueryVisualization, MatchStatus
} from './interfaces';

export interface IGetAdjacentEdges extends IDataSourceRelative, IBaseRequest {
  orientation?:EdgeOrientation;
  type ?:string;
  skip?:number;
  limit?:number;
  withVersion ?:boolean;
  nodeId?:ItemId;
  source?:ItemId;
  target?:ItemId;
  adjacent?:ItemId;
}

export interface IGetEdgeTypes extends IDataSourceRelative, IBaseRequest {
  includeType ?:boolean;
}

export interface ICreateEdge extends IDataSourceRelative, IBaseRequest {
  source:ItemId;
  target:ItemId;
  type:string;
  data:any;
}

export interface IUpdateEdge extends IIdentifiedItem, IDataSourceRelative, IBaseRequest {
  data:any;
  deletedData:Array<string>;
  version:number;
}

export interface IGetUserList extends IBaseRequest {
  filter?:string;
  groupId?:Array<number>;
  unwantedIds?:Array<number>;
  size?:number;
  start?:number;
}

export interface ILoginUser extends IBaseRequest {
  usernameOrEmail:string;
  password:string;
}

export interface IUpdateUser extends IIdentified, IBaseRequest {
  username ?:string;
  email ?:string;
  password ?:string;
  preferences ?:any;
}

export interface ICreateUser extends IBaseRequest {
  username:string;
  email:string;
  password:string;
  groups ?:Array<string|number>;
}

export interface ICreateGraphQuery extends IDataSourceRelative, IBaseRequest {
  dialect:string;
  content:string;
  name:string;
}

export interface IUpdateBatchUser extends IBaseRequest {
  users:Array<number>;
  addGroups:Array<number>;
  rmGroups:Array<number>;
}

export interface ICreateGroup extends IBaseRequest, IDataSourceRelative {
  name:string;
}

export interface IGetGroup extends IIdentified, IDataSourceRelative {}

export interface IUpdateGroupRights extends IDataSourceRelative, IIdentified, IBaseRequest {
  type:string;
  targetType:string;
  targetName:string;
}

export interface IUpdateBatchGroupRights extends IDataSourceRelative, IBaseRequest {
  groupIds:Array<number>;
  rightType:RightType;
  targetType:string;
}

export interface ICreateDataSource extends IBaseRequest {
  name:string;
  graphDb:INeo4Config|ITitanConfig|IDseConfig;
  index:IElasticSearchConfig;
}

export interface IDeleteDataSource extends IDataSourceRelative, IBaseRequest {
  sourceKey:string;
  mergeInto:string;
}

export interface ISetDataSourceProperties extends IDataSourceRelative, IBaseRequest {
  properties:Array<string>;
}

export interface IUpdateGraphQuery extends IDataSourceRelative, IIdentified, IBaseRequest {
  name ?:string;
  content ?:string;
}

export interface ISendQuery extends IDataSourceRelative, IBaseRequest {
  dialect:string;
  query:string;
  withVersion:boolean;
}

export interface IGetShortestPaths extends IDataSourceRelative, IBaseRequest {
  startNode:ItemId;
  endNode:ItemId;
  maxDepth ?:number;
  withVersion ?:boolean;
}

export interface IGetNeighborsCategories extends IDataSourceRelative, IBaseRequest {
  ids:Array<ItemId>;
}

export interface IGetDirectory extends IDataSourceRelative, IBaseRequest {
  categoriesOrTypes?:Array<string>;
  properties:Array<string>;
  constraints?:IConstraint;
  pageSize?:number;
  pageStart?:number;
}

export interface IGetItemProperties extends IDataSourceRelative, IBaseRequest {
  includeType ?:string;
  omitNoindex ?:boolean;
}

export interface IGetItemVersions extends IDataSourceRelative, IBaseRequest {
  nodes:Array<ItemId>;
  edges:Array<ItemId>;
}

export interface ISearchItemList extends IDataSourceRelative, IBaseRequest {
  q:string;
  strictEdges ?:boolean;
  fuzziness ?:number;
  size ?:number;
  from ?:number;
  filter ?:string;
}

export interface IGetNode extends IIdentifiedItem, IDataSourceRelative, IBaseRequest {
  withEdges ?:boolean;
  withDigest ?:boolean;
  withVersion ?:boolean;
}

export interface IGetAdjacentItems extends IIdentifiedItemList, IDataSourceRelative, IBaseRequest {
  ignoredNodes:Array<ItemId>;
  visibleNodes:Array<ItemId>;
  nodeCategory?:string;
  edgeType?:string;
  limit?:number;
  limitType?:string;
  withVersion:boolean;
}

export interface IGetItemTypes extends IDataSourceRelative, IBaseRequest {
  includeType ?:boolean;
  omitInferred:boolean;
}

export interface ICreateNode extends IDataSourceRelative, IBaseRequest {
  data ?:any;
  categories ?:Array<string>;
}

export interface IUpdateNode extends IIdentifiedItem, IDataSourceRelative, IBaseRequest {
  data:any;
  deletedData:Array<string>;
  addedCategories:Array<string>;
  deletedCategories:Array<string>;
  version:number;
}

export interface IUpdateAppConfig extends IDataSourceConfig, IBaseRequest {
  path:string;
  configuration:any;
  reset ?:boolean;
}

export interface IGetSandbox extends IDataSourceRelative, IBaseRequest {
  populate?:PopulateType;
  itemId ?:number;
  searchQuery ?:string;
  searchFuzziness ?:number;
  patternQuery ?:string;
  doLayout ?:boolean;
  patternDialect ?:string;
}

export interface ICreateWidget extends IDataSourceRelative, IBaseRequest {
  visualization_id:number;
  content:IWidgetContent;
}

export interface ICreateFolder extends IDataSourceRelative, IBaseRequest {
  title:string;
  parent:number;
}

export interface ICreateVisualization extends IDataSourceRelative, IBaseRequest {
  title:string;
  folder ?:number;
  nodes:Array<IVisualizationNode>;
  edges:Array<IVisualizationEdge>;
  alternativeIds ?:IAlternativeIdConfig;
  layout ?:IVisualizationLayout;
  mode ?:string;
  geo ?:IVisualizationGeo;
  design ?:IVisualizationDesign;
  filters ?:Array<any>;
  nodeFields:IItemFields;
  edgeFields:IItemFields;
}

export interface ISetShareRights extends IDataSourceRelative, IBaseRequest {
  userId:number;
  right ?:string;
  vizId:number;
}

export interface IUnshareVisualization extends IDataSourceRelative, IIdentified, IBaseRequest {
  userId:number;
}

export interface IUpdateFolder extends IDataSourceRelative, IIdentified, IBaseRequest {
  key:string;
  value:string;
}

export interface IUpdateSandbox extends IDataSourceRelative, IBaseRequest {
  visualization:ISandBox;
}

export interface IUpdateVisualization extends IDataSourceRelative, IBaseRequest {
  id:IIdentified;
  visualization:IQueryVisualization;
  forceLock ?:boolean;
}
export interface ICreateAlert extends IDataSourceRelative, IBaseRequest {
  title?:string;
  query?:string;
  dialect?:string;
  enabled?:boolean;
  cron?:string;
  matchTTL?:number;
  scoreColumn?:string;
  scoreDirection?:string;
  maxMatches?:number;
  maxRuntime?:number;
}

export interface IUpdateAlert extends ICreateAlert, IIdentified {}

export interface IAlert extends IDataSourceRelative, IBaseRequest {
  id:number;
}

export interface IMatch extends IDataSourceRelative, IAlert {
  matchId:number;
}

export interface IAddActionMatch extends IMatch {
  action:string;
}

export interface IFilteredAlert extends IAlert {
  offset?:number;
  limit?:number;
  sort_direction?:'asc'|'desc';
  sort_by?:string;
  status?:MatchStatus;
}
