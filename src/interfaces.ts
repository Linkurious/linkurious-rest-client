/*
 * user model
 */
export interface User {
  id:number;
  username:string;
  email:string;
  groups:any;
  admin:boolean;
  preferences:any;
  actions:any;
}

export interface Group {
  id : number;
  name : string;
  userCount : number;
  builtIn : boolean;
}

export interface UserResult {
  id : number;
  username : string;
  email : string;
  ldap : boolean;
  groups : Array<Group>
}

export interface SearchUserResult {
  found : number;
  results : Array<UserResult>;
}

/*
 * current source model
 */
export interface StateSource {
  name:string;
  key:string;
  configIndex:number;
}

export interface Source {
  name : string;
  configIndex : number;
  key : string;
  connected : boolean;
  state : string;
  reason : string;
  error : string;
}

export interface SourcesList {
  sources : Array<Source>
}

/*
 * global REST client model
 */
export interface clientState {
  user:User;
  currentSource:StateSource;
}

/*
 * Linkurious class
 */
export interface LinkuriousInterface {
  host:string;
  state:clientState;
  userLogin(userLogin:string, password:string):Promise<any>;
  userIsAuth():Promise<boolean>;
  userIsAdmin():Promise<boolean>;
  logout():Promise<string>;
  getCurrentUser(): Promise<User>;
  updateCurrentUser(data:any) : Promise<any>;
}

/*
 * log libraries params
 */
export interface LoggerPlugin {
  debug:Function;
  error:Function;
}

/*
 * LogDriver class
 */
export interface LogDriverInterface {
  level:string;
  logger:LoggerPlugin;
  debug(logBody:ErrorBody):void;
  error(logBody:ErrorBody):void;
}

/*
 * HTTPDriver interface
 */
export interface HTTPDriverInterface {
  POST(uri:string, data:any):Promise<any>;
  PATCH(uri:string, data:any):Promise<any>;
  GET(uri:string, data?:any):Promise<any>;
  DELETE(uri:string):Promise<any>;
}

/*
 * server response body
 */
export interface ResponseBody {
  status:number;
  type:string;
  key:string;
  message:string;
}

/*
 * Error model
 */
export interface ErrorBody {
  key:string;
  message:string;
}

export interface Edge {
  id : number;
  source : number;
  target : number;
  type : string;
  data : any;
  version ?: number;
  nodes ?: Array<Node>;
}

export interface GraphQuery {
  content : string;
  name : string;
  dialect : string;
  createdAt : string;
  updatedAt : string;
}

export interface RequestNodesAndEdgesVersionsInterface {
  nodes : Array<number>;
  edges : Array<number>;
}

export interface RequestShortestPathInterface {
  startNode : number;
  endNode : number;
  maxDepth ?: number;
  withVersion ?: boolean;
}

export interface RequestGraphWithQueryInterface {
  dialect : string;
  query : string;
  withVersion : boolean;
}

export interface AppStatus {
  code : number;
  name : string;
  message : string;
  uptime : number;
}

export interface AppVersion {
  tag_name : string;
  name : string;
  prerelease : boolean;
}

export interface AllSourcesConfig {
  maxPathLength : number;
  shortestPathsMaxResults : number;
  connectionRetries : number;
  pollInterval : number;
  indexationChunkSize : number;
  expandThreshold : number;
  searchAddAllThreshold : number;
  searchThreshold : number;
  minSearchQueryLength : number;
  rawQueryTimeout : number;
}

export interface RightsConfig {
  dataEdition : boolean;
  loginTimeout : number;
  widget : boolean;
}

export interface AnalyticsConfig {
  enabled : boolean;
  code : string;
  domain : string;
}

export interface LeafletConfig {
  name : string;
  thumbnail : string;
  urlTemplate : string;
  attribution : string;
  subdomains : string;
  id : string;
  accessToken : string;
  minZoom : number;
  maxZoom : number;
}

export interface AlternativeIds {
  node : string;
  edge : string;
}

export interface Directory {
  nodes : boolean;
  edges : boolean;
}

export interface SourceConfig {
  features : any;
  alternativeIds : AlternativeIds;
  latitudeProperty : string;
  longitudeProperty : string;
  directory : Directory;
}

export interface AppConfig {
  allSources : AllSourcesConfig;
  rights : RightsConfig;
  analytics : AnalyticsConfig;
  sigma : any;
  palette : any;
  styles : any;
  leaflet : LeafletConfig;
  source : SourceConfig;
  graphDb : any;
  index : any;
  enterprise : boolean;
  domain : string;
}

export interface Count {
  count : number;
}

export interface DigestItem {
  edgeType : string;
  nodeCategories : Array<string>;
  nodes : number;
  edges : number;
}

export interface DigestList {
  digest : Array<DigestItem>;
}

export interface Node {
  id : number;
  data : any;
  statistics ?: DigestList;
  categories : any;
  edges ?: Array<Edge>;
  version ?: number;
}

export interface RequestNodeAdjacentItems {
  ids : Array<number>;
  ignoredNodes : Array<number>;
  visibleNodes : Array<number>;
  nodeCategory : string;
  edgeType : string;
  limit : number;
  limitType : string;
}

export interface RequestNodeNeighbors {
  ids : Array<number>;
}

export interface RequestNode {
  withEdges ?: boolean;
  withDigest ?: boolean;
  withVersion ?: boolean;
}

export interface Schema {
  nodeCategories : Array<string>;
  edgeTypes : Array<string>;
  nodeProperties : Array<string>;
  edgeProperties : Array<string>;
}

export interface RequestProperties {
  includeType ?: string;
  omitNoindex ?: boolean;
}

export interface Property {
  key : string;
  count : number;
  type ?: string;
}

export interface PropertyList {
  properties : Array<Property>
}

export interface RequestEdgeType {
  includeType ?: boolean;
}

export interface RequestNodeType extends RequestEdgeType {
  omitInferred : boolean;
}

export interface ItemType {
  count : number;
  name : string;
  properties : Array<Property>;
}

export interface TypesList {
  edgeTypes ?: Array<ItemType>
  nodeTypes ?: Array<ItemType>
}

export interface IndexationProgress {
  indexing_progress : number;
  node_count : number;
  edge_count : number;
  index_size : number;
  indexed_source : string;
}

export interface RequestSearchItems {
  q : string;
  strictEdges ?: boolean;
  fuzziness ?: number;
  size ?: number;
  from ?: number;
  filter ?: string;
}

export interface SearchChildren {
  id : number;
  name : string;
  field : string;
  value : string;
}

export interface SearchItems {
  title : string;
  categories : Array<string>;
  children : Array<SearchChildren>;
}

export interface ResultSearchItems {
  type : Item;
  totalHits : number;
  results : Array<SearchItems>;
}

export interface Constraints {
  property : string;
  operator : string;
  value : any;
}

export interface RequestDirectory {
  type : Item;
  categoryOrTypes : Array<string>;
  properties : Array<string>;
  constraints : Constraints;
  pageSize : number;
  pageStart : number;
}

export interface ResultSearchDirectory {
  type : Item;
  totalHits : number;
  results : Node | Edge;
}

export interface IndexationStatus {
  indexing : indexingStatus;
  indexing_progress : string;
  node_count : number;
  edge_count : number;
  index_size : number;
  indexed_source : string;
  indexing_status : string;
}

export interface GraphDb {
  vendor : GraphDBVendor;
  url : string;
  graphName ?: string;
  create ?: boolean;
  webAdmin ?: string;
  user ?: string;
  password ?: string;
  configurationPath ?: string;
}

export interface IndexConfig {
  vendor : string;
  host : string;
  port : number;
  forceReindex : boolean;
  dynamicMapping : boolean;
}

export interface RequestDeleteDatas {
  sourceKey : string;
  mergeInto : string;
}

export interface AffectedSource {
  visualizations : number;
  folders : number;
}

export interface ResultDeleteDatas {
  migrated : boolean;
  affected : AffectedSource;
}

export interface AdminDataSource {
  lastSeen : string;
  indexedDate : string;
  key : string;
  host : string;
  port : string;
  storeId : string;
  state : string;
  visualizationCount : number;
  configIndex : number;
}

export interface ResultAdminDataSource {
  sources : Array<AdminDataSource>;
}

export interface RequestArrayProperties {
  properties : Array<string>;
}

export type GraphDBVendor = 'neo4j'|'titan'|'dse';
export type indexingStatus = 'ongoing'|'needed'|'done'|'unknown';
export type EdgesList = Array<Edge>;
export type EdgeOrientation = 'in'|'out'|'both';
export type Item = 'node'|'edge'|'nodes'|'edges';

export namespace Form {
  export namespace user {
    export interface update {
      username ?: string;
      email ?: string;
      password ?:string;
      preferences ?:any;
    }

    export interface search {
      filter : string;
      groupId : Array<number>;
      unwantedIds : Array<number>;
      size : number;
      start : number;
    }
  }

  export namespace edge {
    export interface create {
      source : string;
      target : string;
      type : string;
      data : any;
    }

    export interface update {
      properties : any;
      deleteProperties : Array<string>;
      type : string;
    }

    export interface getAdjacent {
      orientation : EdgeOrientation;
      nodeId : number;
      type ?: string;
      skip : number;
      limit : number;
      withVersion ?: boolean;
    }
  }

  export namespace node {
    export interface create {
      properties ?: any;
      categories ?: Array<string>;
    }

    export interface update {
      properties :any;
      deletedProperties : Array<string>;
      addedProperties : Array<string>;
      deletedCategories : Array<string>;
      version : number;
    }
  }

  export namespace rawQuery {
    export interface create {
      dialect : string;
      content : string;
      name ?: string;
    }

    export interface update {
      name : string;
      content : string;
    }
  }

  export namespace config {
    export interface update {
      key : string;
      configuration : any;
      sourceIndex ?: number;
      reset ?: boolean;
    }
  }

  export namespace dataSource {
    export interface create {
      name : string;
      graphDb : GraphDb;
      index : IndexConfig;
    }
  }
}

