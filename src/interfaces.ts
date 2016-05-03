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
  with_version ?: boolean;
}

export interface RequestGraphWithQueryInterface {
  dialect : string;
  query : string;
  with_version : boolean;
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
}

export interface NodesWithEdges extends Node{
  edges : Array<Edge>;
}

export interface RequestNodeAdjacentItems {
  ids : Array<number>;
  ignored_nodes : Array<number>;
  visible_nodes : Array<number>;
  node_category : string;
  edge_type : string;
  limit : number;
  limit_type : string;
}

export interface RequestNodeNeighbors {
  ids : Array<number>;
}

export interface RequestNode {
  with_edges ?: boolean;
  with_digest ?: boolean;
  with_version ?: boolean;
}

export type EdgesList = Array<Edge>;
export type EdgeOrientation = 'in'|'out'|'both';

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
      group_id : Array<number>;
      unwanted_ids : Array<number>;
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
      delete_properties : Array<string>;
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
      deleted_properties : Array<string>;
      added_properties : Array<string>;
      deleted_categories : Array<string>;
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
}

