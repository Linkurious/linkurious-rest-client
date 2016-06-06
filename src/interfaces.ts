export type indexingStatus = 'ongoing'|'needed'|'done'|'unknown';
export type EdgeOrientation = 'in'|'out'|'both';
export type ItemType = 'node'|'edge';
export type ItemsType = 'nodes'|'edges';
export type RightType = 'read'|'write'|'none'|'do';
export type PopulateType = 'expandNodeId'|'nodeId'|'edgeId'|'searchNodes'|'searchEdges'|'pattern';
export type ItemId = string | number;
export type VisualizationModeType = 'nodelink'|'geo';
export type ShareRightType = 'read'|'write'|'owner';
export type ConstraintsOperatorType = 'contains'|'equals'|'more than'|'less than'|'starts with';

export type IIndexationCallback = (res:IIndexationStatus) => void;

export interface IClientState {
  user:IFullUser;
  currentSource:IDataSource;
}

// NODE & EDGE

export interface IIdentifiedItem {
  id:ItemId;
}

export interface IIdentifiedItemList {
  ids:Array<ItemId>;
}

export interface IItem extends IIdentifiedItem {
  data:any;
  version?:number;
}

export interface IEdge extends IItem {
  type:string;
  source:ItemId;
  target:ItemId;
}

export interface INode extends IItem {
  statistics?:Array<IDigest>;
  categories:any;
}

export interface IFullNode extends INode {
  edges:Array<IEdge>;
}

// USER

export interface IIdentified {
  id:number;
}

export interface ISimpleUser extends IIdentified {
  username:string;
  email:string;
}

export interface IUser extends ISimpleUser {
  groups:Array<ISimpleGroup>;
  ldap:boolean;
  admin?:boolean;
}

export interface IFullUser extends IUser {
  preferences:any;
  actions:any;
}

// GROUP

export interface ISimpleGroup extends IIdentified {
  name:string;
  builtIn:boolean;
}

export interface IGroup extends ISimpleGroup {
  userCount?:number;
  accessRights?:Array<IAccessRight>;
}

export interface IAccessRight extends IDataSourceRelative {
  type:RightType;
  targetType:string;
  targetName:string;
}

export interface IGroupRights {
  types:Array<string>;
  targetTypes:Array<string>;
  actions:Array<string>;
}

// DATA-SOURCE

export interface IDataSource {
  name:string;
  key:string;
  configIndex:number;
}

export interface IDataSourceState extends IDataSource {
  connected:boolean;
  state:string;
  reason:string;
  error?:string;
}

export interface IFullDataSource extends IDataSource {
  state:string;
  lastSeen:string;
  indexedDate:string;
  host:string;
  port:string;
  storeId:string;
  visualizationCount:number;
}

export interface IIndexationStatus {
  indexing_progress:number;
  node_count:number;
  edge_count:number;
  index_size:number;
  indexed_source:string;
  indexing_status:string;
  indexing:indexingStatus;
}

export interface IDeletedDataSource {
  migrated:boolean;
  affected:IAffectedSource;
}

interface IAffectedSource {
  visualizations:number;
  folders:number;
}

interface IBaseGraphConfig {
  alternativeEdgeId?:string;
  alternativeNodeId?:string;
  latitudeProperty?:string;
  longitudeProperty?:string;
}

export interface INeo4Config extends IBaseGraphConfig {
  vendor:'neo4j';
  url:string;
  webAdmin?:string;
  user?:string;
  password?:string;
  allowSelfSigned?:boolean;
  proxy?:string;
  writeUrl?:string;
}

export interface ITitanConfig extends IBaseGraphConfig {
  vendor:'titan';
  url:string;
  configurationPath:string;
}

export interface IDseConfig extends IBaseGraphConfig {
  vendor:'dse';
  url:string;
  graphName:string;
  create?:boolean;
}

export interface IElasticSearchConfig {
  vendor:'elasticSearch';
  host:string;
  port:number;
  forceReindex:boolean;
  dynamicMapping:boolean;
  dateDetection?:boolean;
  https?:boolean;
  user?:string;
  password?:string;
}

// QUERY

export interface ISimpleGraphQuery {
  name:string;
  content:string;
  dialect:string;
}

export interface IGraphQuery extends ISimpleGraphQuery {
  createdAt:string;
  updatedAt:string;
}

// SEARCH

export interface ISearchResult {
  // todo:remove ambiguity node/nodes/edge/edges (i.e. fix on server too)
  type:ItemsType|ItemType;
  totalHits:number;
}

export interface ISearchEdgesInDirectory extends ISearchResult {
  results:IEdge;
}

export interface ISearchNodesInDirectory extends ISearchResult {
  results:INode;
}

export interface ISearchItemList extends ISearchResult {
  results:Array<ISearchMatchGroup>;
}

export interface ISearchFullItems extends ISearchResult {
  results:Array<IFullNode>;
}

interface ISearchMatchGroup {
  title:string;
  categories:Array<string>;
  children:Array<ISearchMatch>;
}

interface ISearchMatch {
  id:ItemId;
  name:string;
  field:string;
  value:string;
}

// SCHEMA

export interface IBaseSchema {
  nodeCategories:Array<string>;
}

export interface ISchema extends IBaseSchema {
  edgeTypes:Array<string>;
  nodeProperties:Array<string>;
  edgeProperties:Array<string>;
}

export interface IDigest extends IBaseSchema {
  edgeType:string;
  nodes:number;
  edges:number;
}

export interface IAlternativeIdConfig {
  node:string;
  edge:string;
}

interface ICountItemType {
  count:number;
}

export interface IProperty extends ICountItemType {
  key:string;
  type?:string;
}

export interface IItemType extends ICountItemType {
  name:string;
  properties:Array<IProperty>;
}

// APP

export interface IAppStatus {
  code:number;
  name:string;
  message:string;
  uptime:number;
}

export interface IAppVersion {
  tag_name:string;
  name:string;
  prerelease:boolean;
}

export interface IAppConfig {
  allSources:IDataSourcesConfig;
  rights:IRightsConfig;
  analytics:IAnalyticsConfig;
  sigma:any;
  palette:any;
  styles:any;
  leaflet:ILeafletConfig;
  source:ISourceConfig;
  graphDb?:any;
  index?:any;
  sourceName?:string;
  enterprise:boolean;
  domain:string;
}

interface IDataSourcesConfig {
  maxPathLength:number;
  shortestPathsMaxResults:number;
  connectionRetries:number;
  pollInterval:number;
  indexationChunkSize:number;
  expandThreshold:number;
  searchAddAllThreshold:number;
  searchThreshold:number;
  minSearchQueryLength:number;
  rawQueryTimeout:number;
}

interface IRightsConfig {
  dataEdition:boolean;
  loginTimeout:number;
  widget:boolean;
}

interface IAnalyticsConfig {
  enabled:boolean;
  code:string;
  domain:string;
}

interface ILeafletConfig {
  name:string;
  thumbnail:string;
  urlTemplate:string;
  attribution:string;
  subdomains:string;
  id:string;
  accessToken:string;
  minZoom:number;
  maxZoom:number;
}

interface ISourceConfig {
  features:any;
  alternativeIds?:IAlternativeIdConfig;
  latitudeProperty?:string;
  longitudeProperty?:string;
  directory:IDirectoryEnabled;
}

interface IDirectoryEnabled {
  nodes:boolean;
  edges:boolean;
}

// VISUALIZATION

export interface ISandBox {
  design:IVisualizationDesign;
  nodeFields:IItemFields;
  edgeFields:IItemFields;
}

export interface IVisualization extends ISandBox {
  title:string;
  folder:number;
  nodes:Array<IVisualizationNode>;
  edges:Array<IVisualizationEdge>;
  alternativeIds:IAlternativeIdConfig;
  layout:IVisualizationLayout;
  geo:IVisualizationGeo;
  mode:VisualizationModeType;
  filters:Array<any>;
}

export interface IItemFields {
  captions:any;
  fields:Array<IFields>;
}

interface IFields {
  name:string;
  active:boolean;
}

export interface IVisualizationEdge extends IIdentifiedItem {
  selected?:boolean;
}

export interface IVisualizationNode extends IVisualizationEdge {
  nodeLink:INodeLink;
  geo?:INodeGeo;
}

interface INodeGeo {
  latitude?:number;
  longitude?:number;
  latitudeDiff?:number;
  longitudeDiff?:number;
}

interface INodeLink {
  x:number;
  y:number;
  fixed?:boolean;
}

export interface IVisualizationLayout {
  algorithm?:string;
  mode?:string;
}

export interface IVisualizationGeo {
  latitudeProperty?:string;
  longitudeProperty?:string;
  layers?:Array<string>;
}

export interface IVisualizationDesign {
  styles?:any;
  palette?:any;
}

export interface IWidget {
  title:string;
  key:string;
  userId:number;
  visualizationId:number;
  content:IWidgetContent;
}

export interface IWidgetContent extends IVisualizationDesign {
  graph:IWidgetGraph;
  title?:string;
  description?:string;
  url?:string;
  mode?:string;
  mapLayers?:Array<any>;
  ui?:IWidgetUI;
}

interface IWidgetUI {
  search?:boolean;
  share?:boolean;
  layout?:boolean;
  fullscreen?:boolean;
  zoom?:boolean;
  legend?:boolean;
  geo?:boolean;
}

interface IWidgetGraph {
  nodes:Array<INode>;
  edges:Array<IEdge>;
}

interface IBaseShare {
  userId:number;
  right:ShareRightType;
  visualizationId:number;
}

export interface IShare extends IBaseShare {
  updatedAt:string;
  createdAt:string;
}

interface ISharer extends IBaseShare {
  username:string;
  email:string;
}

export interface ISharers {
  owner:ISimpleUser;
  shares:Array<ISharer>;
}

export interface ITree {
  tree:Array<ITreeChildren>;
}

interface ITreeChildren {
  type:'visu'|'folder';
  id:number;
  title:string;
  children?:Array<ITreeChildren>;
  shareCount?:number;
  widgetKey?:string;
}

export interface IConstraint {
  property:string;
  operator:ConstraintsOperatorType;
  value:any;
}

export interface IBaseRequest {}

export interface IDataSourceRelative {
  dataSourceKey?:string;
}

export interface IDataSourceConfig {
  dataSourceIndex?:number;
}
