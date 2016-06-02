// Global state

export interface StateModel {
  user:User.model;
  currentSource:DataSource.clientModel;
}

// APIs

//export type GraphDBVendor = 'neo4j'|'titan'|'dse';
export type indexingStatus = 'ongoing'|'needed'|'done'|'unknown';
export type EdgeOrientation = 'in'|'out'|'both';
export type ItemType = 'node'|'edge';
export type ItemsType = 'nodes'|'edges';
export type RightType = 'read'|'write'|'none'|'do';
export type PopulateType = 'expandNodeId'|'nodeId'|'edgeId'|'searchNodes'|'searchEdges'|'pattern';
export type ItemId = string | number;

export type IndexationCallback = (res:DataSource.indexationStatus) => void;

export namespace User {
  export interface model {
    id:number;
    username:string;
    email:string;
    groups?:Array<Group.model>;
    admin?:boolean;
    preferences?:any;
    actions?:any;
    ldap?:boolean;
  }

  export namespace request {
    export interface list {
      filter?:string;
      groupId?:Array<number>;
      unwantedIds?:Array<number>;
      size?:number;
      start?:number;
    }
  }

  export namespace form {

    export interface login {
      usernameOrEmail:string,
      password:string
    }

    export interface update {
      username ?:string;
      email ?:string;
      password ?:string;
      preferences ?:any;
    }

    export interface create {
      username:string;
      email:string;
      password:string;
      groups ?:Array<string>;
    }

    export interface batch {
      users:Array<number>;
      addGroups:Array<number>;
      rmGroups:Array<number>;
    }
  }
}

export namespace Group {
  export interface model {
    id:number;
    name:string;
    userCount ?:number;
    builtIn:boolean;
    accessRights ?:Array<accessRights>;
  }

  export interface sourceAccessRights {
    types:Array<string>;
    targetTypes:Array<string>;
    actions:Array<string>;
  }

  export interface accessRights {
    sourceKey?:string;
    type:RightType;
    targetType:string;
    targetName:string;
  }

  export namespace form {

    export interface create {
      name:string;
      dataSource ?:string;
    }

    export interface batchRights {
      groupIds:Array<number>;
      rightType:RightType;
      targetType:string;
    }

    export interface updateRights {
      type:RightType;
      targetType:string;
      targetName:string;
    }
  }
}

export namespace DataSource {
  export interface model {
    name:string;
    configIndex:number;
    key:string;
    connected:boolean;
    state:string;
    reason:string;
    error?:string;
  }

  export interface list {
    sources:Array<model>;
  }

  export interface clientModel {
    name:string;
    key:string;
    configIndex:number;
  }

  export interface adminModel {
    lastSeen:string;
    indexedDate:string;
    key:string;
    host:string;
    port:string;
    storeId:string;
    state:string;
    visualizationCount:number;
    configIndex:number;
  }

  export interface indexationStatus {
    indexing_progress:number;
    node_count:number;
    edge_count:number;
    index_size:number;
    indexed_source:string;
    indexing_status:string;
    indexing:indexingStatus;
  }

  export interface deletedDatas {
    migrated:boolean;
    affected:affectedSource;
  }

  export namespace form {
    export interface create {
      name:string;
      graphDb:neo4Config|titanConfig|dseConfig;
      index:elasticSearchConfig;
    }

    export interface Delete {
      sourceKey:string;
      mergeInto:string;
    }

    export interface setProperties {
      properties:Array<string>;
    }
  }

  interface affectedSource {
    visualizations:number;
    folders:number;
  }

  interface neo4Config extends GenericGraphConfig {
    vendor:'neo4j',
    url:string,
    webAdmin?:string,
    user?:string,
    password?:string
  }

  interface titanConfig extends GenericGraphConfig {
    vendor:'titan',
    url:string,
    configurationPath:string
  }

  interface dseConfig extends GenericGraphConfig {
    vendor:'dse',
    url:string,
    graphName:string,
    create ?:boolean
  }

  interface elasticSearchConfig {
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

  interface GenericGraphConfig {
    alternativeEdgeId?:string;
    alternativeNodeId?:string;
    latitudeProperty?:string;
    longitudeProperty?:string;
  }
}

export namespace Edge {

  export interface model {
    id:ItemId;
    source?:ItemId;
    target?:ItemId;
    type:string;
    data:any;
    version ?:number;
    nodes ?:Array<Node>;
  }

  export namespace request {
    export interface getAdjacent {
      orientation:EdgeOrientation;
      nodeId:ItemId;
      type ?:string;
      skip:number;
      limit:number;
      withVersion ?:boolean;
    }

    export interface types {
      includeType ?:boolean;
    }
  }

  export namespace form {
    export interface create {
      source:ItemId;
      target:ItemId;
      type:string;
      data:any;
    }

    export interface update {
      properties:any;
      deleteProperties:Array<string>;
      type:string;
    }
  }
}

export namespace Query {
  export interface model {
    content:string;
    name:string;
    dialect:string;
    createdAt:string;
    updatedAt:string;
  }

  export namespace form {
    export interface create {
      dialect:string;
      content:string;
      name ?:string;
    }

    export interface update {
      name:string;
      content:string;
    }

    export interface request {
      dialect:string;
      query:string;
      withVersion:boolean;
    }
  }
}

export namespace Graph {
  export namespace request {
    export interface shortestPath {
      startNode:number;
      endNode:number;
      maxDepth ?:number;
      withVersion ?:boolean;
    }
  }
}

export namespace Directory {

  export interface list {
    type:ItemsType;
    totalHits:number;
    results:Node.model | Edge.model;
  }

  export namespace request {
    export interface list {
      type:ItemsType;
      categoryOrTypes:Array<string>;
      properties:Array<string>;
      constraints:constraints;
      pageSize:number;
      pageStart:number;
    }
  }

  interface constraints {
    property:string;
    operator:string;
    value:any;
  }
}

export namespace Schema {

  export interface model {
    nodeCategories:Array<string>;
    edgeTypes:Array<string>;
    nodeProperties:Array<string>;
    edgeProperties:Array<string>;
  }

  export interface lists {
    nodes:Array<number>;
    edges:Array<number>;
  }

  export interface typesList {
    edgeTypes ?:Array<type>
    nodeTypes ?:Array<type>
  }

  export interface alternativeIds {
    node:string;
    edge:string;
  }

  export interface directory {
    nodes:boolean;
    edges:boolean;
  }

  export interface digest {
    edgeType:string;
    nodeCategories:Array<string>;
    nodes:number;
    edges:number;
  }

  export interface propertyList {
    properties:Array<property>
  }

  export interface itemsList {
    type:ItemType;
    totalHits:number;
    results:Array<item>;
  }

  export namespace request {
    export interface properties {
      includeType ?:string;
      omitNoindex ?:boolean;
    }

    export interface itemsList {
      q:string;
      strictEdges ?:boolean;
      fuzziness ?:number;
      size ?:number;
      from ?:number;
      filter ?:string;
    }
  }

  interface property {
    key:string;
    count:number;
    type ?:string;
  }

  interface type {
    count:number;
    name:string;
    properties:Array<property>;
  }

  interface item {
    title:string;
    categories:Array<string>;
    children:Array<itemChildren>;
  }

  interface itemChildren {
    id:number;
    name:string;
    field:string;
    value:string;
  }
}

export namespace Node {
  export interface model {
    id:ItemId;
    data:any;
    statistics ?:Array<Schema.digest>;
    categories:any;
    edges ?:Array<Edge.model>;
    version ?:number;
  }

  export namespace request {
    export interface one {
      withEdges ?:boolean;
      withDigest ?:boolean;
      withVersion ?:boolean;
    }

    export interface adjacentItems {
      ids:Array<ItemId>;
      ignoredNodes:Array<number>;
      visibleNodes:Array<number>;
      nodeCategory?:string;
      edgeType?:string;
      limit?:number;
      limitType?:string;
      withVersion:boolean;
    }

    export interface neighborsCategories {
      ids:Array<ItemId>;
    }

    export interface types {
      includeType ?:boolean;
      omitInferred:boolean;
    }
  }

  export namespace form {
    export interface create {
      properties ?:any;
      categories ?:Array<string>;
    }

    export interface update {
      properties:any;
      deletedProperties:Array<string>;
      addedProperties:Array<string>;
      deletedCategories:Array<string>;
      version:number;
    }
  }
}

export namespace App {
  export interface status {
    code:number;
    name:string;
    message:string;
    uptime:number;
  }

  export interface version {
    tag_name:string;
    name:string;
    prerelease:boolean;
  }

  export interface config {
    allSources:AllSourcesConfig;
    rights:RightsConfig;
    analytics:AnalyticsConfig;
    sigma:any;
    palette:any;
    styles:any;
    leaflet:LeafletConfig;
    source:SourceConfig;
    graphDb:any;
    index:any;
    enterprise:boolean;
    domain:string;
  }

  export namespace form {
    export interface update {
      path:string;
      configuration:any;
      sourceIndex ?:number;
      reset ?:boolean;
    }
  }

  interface AllSourcesConfig {
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

  interface RightsConfig {
    dataEdition:boolean;
    loginTimeout:number;
    widget:boolean;
  }

  interface AnalyticsConfig {
    enabled:boolean;
    code:string;
    domain:string;
  }

  interface LeafletConfig {
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

  interface SourceConfig {
    features:any;
    alternativeIds?:Schema.alternativeIds;
    latitudeProperty?:string;
    longitudeProperty?:string;
    directory:Schema.directory;
  }
}

export namespace Visualization {

  export interface model {
    title:string;
    folder:number;
    nodes:VisualizationNode;
    edges:VisualizationEdge;
    alternativeIds:Schema.alternativeIds;
    layout:VisualizationLayout;
    geo:VisualizationGeo;
    mode:string;
    design:VisualizationDesign;
    filters:Array<any>;
    nodeFields:ItemFields;
    edgeFields:ItemFields;
  }

  export interface widget {
    title:string;
    key:string;
    userId:number;
    visualizationId:number;
    content:widgetContent;
  }

  export interface tree {
    tree:Array<branch>;
  }

  export interface Shares {
    owner:User.model;
    shares:Array<Share>;
  }

  export interface shareRights {
    visualizationId:number;
    userId:number;
    right:string;
    updatedAt:string;
    createdAt:string;
  }

  export namespace request {
    export interface sandbox {
      populate:PopulateType;
      itemId ?:number;
      searchQuery ?:string;
      searchFuzziness ?:number;
      patternQuery ?:string;
      doLayout ?:boolean;
      patternDialect ?:string;
    }
  }

  export namespace form {
    export interface createWidget {
      visualization_id:number;
      content:widgetContent;
    }

    export interface createFolder {
      title:string;
      parent:number;
    }

    export interface create {
      title:string;
      folder ?:number;
      nodes:Array<VisualizationNode>;
      edges:Array<VisualizationEdge>;
      alternativeIds ?:Schema.alternativeIds;
      layout ?:VisualizationLayout;
      mode ?:string;
      geo ?:VisualizationGeo;
      design ?:VisualizationDesign;
      filters ?:Array<any>;
      nodeFields:ItemFields;
      edgeFields:ItemFields;
    }

    export interface setShareRights {
      userId:number;
      right ?:string;
      vizId:number;
    }

    export interface updateFolder {
      key:string;
      value:string;
    }

    export interface updateSandbox {
      visualization:sandbox;
    }

    export interface update {
      visualization:model;
      force_lock ?:boolean;
    }
  }

  interface Share {
    userId:number;
    username:string;
    email:string;
    visualizationId:number;
    right:string;
  }

  interface sandbox {
    design:VisualizationDesign;
    nodeFields:ItemFields;
    edgeFields:ItemFields;
  }

  interface VisualizationNode {
    id:ItemId;
    selected ?:boolean;
    nodeLink:nodeLink;
    geo ?:nodeGeo;
  }

  interface nodeLink {
    x:number;
    y:number;
    fixed ?:boolean;
  }

  interface nodeGeo {
    latitude ?:number;
    longitude ?:number;
    latitudeDiff ?:number;
    longitudeDiff ?:number
  }

  interface VisualizationEdge {
    id:ItemId;
    selected ?:boolean;
  }

  interface VisualizationLayout {
    algorithm ?:string;
    mode ?:string;
  }

  interface VisualizationGeo {
    latitudeProperty ?:string;
    longitudeProperty ?:string;
    layers ?:Array<string>;
  }

  interface VisualizationDesign {
    styles:any;
    palette:any;
  }

  interface ItemFields {
    captions:any;
    fields:Array<Fields>;
  }

  interface Fields {
    name:string;
    active:boolean;
  }

  interface widgetContent {
    graph:graph;
    title ?:string;
    description ?:string;
    url ?:string;
    mode ?:string;
    styles ?:any;
    palette ?:any;
    mapLayers ?:Array<any>;
    ui ?:widgetUI;
  }

  interface graph {
    nodes:Array<Node.model>;
    edges:Array<Edge.model>;
  }

  interface widgetUI {
    search ?:boolean;
    share ?:boolean;
    layout ?:boolean;
    fullscreen ?:boolean;
    zoom ?:boolean;
    legend ?:boolean;
    geo ?:boolean;
  }

  interface branch {
    type:'visu'|'folder';
    id:number;
    title:string;
    children ?:Array<branch>;
    shareCount ?:number;
    widgetKey ?:string;
  }

}
