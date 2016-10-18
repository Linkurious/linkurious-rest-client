export declare type indexingStatus = 'ongoing' | 'needed' | 'done' | 'unknown';
export declare type EdgeOrientation = 'in' | 'out' | 'both';
export declare type ItemType = 'node' | 'edge';
export declare type ItemsType = 'nodes' | 'edges';
export declare type RightType = 'read' | 'write' | 'none' | 'do';
export declare type PopulateType = 'expandNodeId' | 'nodeId' | 'edgeId' | 'searchNodes' | 'searchEdges' | 'pattern';
export declare type ItemId = string | number;
export declare type VisualizationModeType = 'nodelink' | 'geo';
export declare type ShareRightType = 'read' | 'write' | 'owner';
export declare type ConstraintsOperatorType = 'contains' | 'equals' | 'more than' | 'less than' | 'starts with';
export declare type IIndexationCallback = (res: IIndexationStatus) => void;
export interface IClientState {
    user: IFullUser;
    currentSource: IDataSource;
}
export interface IIdentifiedItem {
    id: ItemId;
}
export interface IIdentifiedItemList {
    ids: Array<ItemId>;
}
export interface IItem extends IIdentifiedItem {
    data: any;
    version?: number;
}
export interface IEdge extends IItem {
    type: string;
    source: ItemId;
    target: ItemId;
}
export interface INode extends IItem {
    statistics?: Array<IDigest>;
    categories: any;
}
export interface IFullNode extends INode {
    edges: Array<IEdge>;
}
export interface ISearchNode extends INode {
    children: Array<INode>;
    title: string;
}
export interface IIdentified {
    id: number;
}
export interface ISimpleUser extends IIdentified {
    username: string;
    email: string;
}
export interface IUser extends ISimpleUser {
    groups: Array<ISimpleGroup>;
    ldap: boolean;
    admin?: boolean;
}
export interface IFullUser extends IUser {
    preferences: any;
    actions: any;
}
export interface ISimpleGroup extends IIdentified {
    name: string;
    builtIn: boolean;
}
export interface IGroup extends ISimpleGroup {
    userCount?: number;
    accessRights?: Array<IAccessRight>;
}
export interface IAccessRight extends IDataSourceRelative {
    type: RightType;
    targetType: string;
    targetName: string;
}
export interface IGroupRights {
    types: Array<string>;
    targetTypes: Array<string>;
    actions: Array<string>;
}
export interface IDataSource {
    name: string;
    key: string;
    configIndex: number;
}
export interface IDataSourceState extends IDataSource {
    connected: boolean;
    state: string;
    reason: string;
    error?: string;
}
export interface IFullDataSource extends IDataSource {
    state: string;
    lastSeen: string;
    indexedDate: string;
    host: string;
    port: string;
    storeId: string;
    visualizationCount: number;
}
export interface IIndexationStatus {
    indexing_progress: number;
    node_count: number;
    edge_count: number;
    index_size: number;
    indexed_source: string;
    indexing_status: string;
    indexing: indexingStatus;
}
export interface IDeletedDataSource {
    migrated: boolean;
    affected: IAffectedSource;
}
export interface IAffectedSource {
    visualizations: number;
    folders: number;
}
export interface IBaseGraphConfig {
    alternativeEdgeId?: string;
    alternativeNodeId?: string;
    latitudeProperty?: string;
    longitudeProperty?: string;
}
export interface INeo4Config extends IBaseGraphConfig {
    vendor: 'neo4j';
    url: string;
    webAdmin?: string;
    user?: string;
    password?: string;
    allowSelfSigned?: boolean;
    proxy?: string;
    writeUrl?: string;
}
export interface ITitanConfig extends IBaseGraphConfig {
    vendor: 'titan';
    url: string;
    configurationPath: string;
}
export interface IDseConfig extends IBaseGraphConfig {
    vendor: 'dse';
    url: string;
    graphName: string;
    create?: boolean;
}
export interface IElasticSearchConfig {
    vendor: 'elasticSearch';
    host: string;
    port: number;
    forceReindex: boolean;
    dynamicMapping: boolean;
    dateDetection?: boolean;
    https?: boolean;
    user?: string;
    password?: string;
}
export interface ISimpleGraphQuery extends IIdentified {
    name: string;
    content: string;
    dialect: string;
}
export interface IGraphQuery extends ISimpleGraphQuery {
    createdAt: string;
    updatedAt: string;
}
export interface ISearchResult {
    type: ItemsType | ItemType;
    totalHits: number;
}
export interface ISearchEdgesInDirectory extends ISearchResult {
    results: Array<IEdge>;
}
export interface ISearchNodesInDirectory extends ISearchResult {
    results: Array<INode>;
}
export interface ISearchItemList extends ISearchResult {
    results: Array<ISearchMatchGroup>;
}
export interface ISearchFullItems extends ISearchResult {
    results: Array<ISearchNode>;
}
export interface ISearchMatchGroup {
    title: string;
    categories: Array<string>;
    children: Array<ISearchMatch>;
}
export interface ISearchMatch {
    id: ItemId;
    name: string;
    field: string;
    value: string;
}
export interface IBaseSchema {
    nodeCategories: Array<string>;
}
export interface ISchema extends IBaseSchema {
    edgeTypes: Array<string>;
    nodeProperties: Array<string>;
    edgeProperties: Array<string>;
}
export interface IDigest extends IBaseSchema {
    edgeType: string;
    nodes: number;
    edges: number;
}
export interface IAlternativeIdConfig {
    node: string;
    edge: string;
}
export interface ICountItemType {
    count: number;
}
export interface IProperty extends ICountItemType {
    key: string;
    type?: string;
}
export interface IItemType extends ICountItemType {
    name: string;
    properties: Array<IProperty>;
}
export interface IAppStatus {
    code: number;
    name: string;
    message: string;
    uptime: number;
}
export interface IAppVersion {
    tag_name: string;
    name: string;
    prerelease: boolean;
}
export interface IAppConfig {
    allSources: IDataSourcesConfig;
    rights: IRightsConfig;
    analytics: IAnalyticsConfig;
    sigma: any;
    palette: any;
    styles: any;
    leaflet: ILeafletConfig;
    source: ISourceConfig;
    graphDb?: any;
    index?: any;
    sourceName?: string;
    enterprise: boolean;
    domain: string;
}
export interface IDataSourcesConfig {
    maxPathLength: number;
    shortestPathsMaxResults: number;
    connectionRetries: number;
    pollInterval: number;
    indexationChunkSize: number;
    expandThreshold: number;
    searchAddAllThreshold: number;
    searchThreshold: number;
    minSearchQueryLength: number;
    rawQueryTimeout: number;
}
export interface IRightsConfig {
    dataEdition: boolean;
    loginTimeout: number;
    widget: boolean;
}
export interface IAnalyticsConfig {
    enabled: boolean;
    code: string;
    domain: string;
}
export interface ILeafletConfig {
    name: string;
    thumbnail: string;
    urlTemplate: string;
    attribution: string;
    subdomains: string;
    id: string;
    accessToken: string;
    minZoom: number;
    maxZoom: number;
}
export interface ISourceConfig {
    features: any;
    alternativeIds?: IAlternativeIdConfig;
    latitudeProperty?: string;
    longitudeProperty?: string;
    directory: IDirectoryEnabled;
}
export interface IDirectoryEnabled {
    nodes: boolean;
    edges: boolean;
}
export interface ISandBox {
    design?: IVisualizationDesign;
    nodeFields?: IItemFields;
    edgeFields?: IItemFields;
}
export interface IVisualization extends ISandBox, IIdentified {
    title: string;
    folder: number;
    nodes: Array<IVisualizationNode>;
    edges: Array<IVisualizationEdge>;
    alternativeIds: IAlternativeIdConfig;
    layout: IVisualizationLayout;
    geo: IVisualizationGeo;
    mode: VisualizationModeType;
    filters: Array<any>;
    createdAt?: string;
    updatedAt?: string;
}
export interface IQueryVisualization {
    design?: IVisualizationDesign;
    nodeFields?: IItemFields;
    edgeFields?: IItemFields;
    title?: string;
    folder?: number;
    nodes?: Array<IVisualizationNode>;
    edges?: Array<IVisualizationEdge>;
    alternativeIds?: IAlternativeIdConfig;
    layout?: IVisualizationLayout;
    geo?: IVisualizationGeo;
    mode?: VisualizationModeType;
    filters?: Array<any>;
}
export interface IItemFields {
    captions: any;
    fields: Array<IFields>;
}
export interface IFields {
    name: string;
    active: boolean;
}
export interface IVisualizationEdge extends IIdentifiedItem {
    selected?: boolean;
}
export interface IVisualizationNode extends IVisualizationEdge {
    nodelink: INodeLink;
    geo?: INodeGeo;
}
export interface INodeGeo {
    latitude?: number;
    longitude?: number;
    latitudeDiff?: number;
    longitudeDiff?: number;
}
export interface INodeLink {
    x: number;
    y: number;
    fixed?: boolean;
}
export interface IVisualizationLayout {
    algorithm?: string;
    mode?: string;
}
export interface IVisualizationGeo {
    latitudeProperty?: string;
    longitudeProperty?: string;
    layers?: Array<string>;
}
export interface IVisualizationDesign {
    styles?: any;
    palette?: any;
}
export interface IWidget {
    title: string;
    key: string;
    userId: number;
    visualizationId: number;
    content: IWidgetContent;
}
export interface IWidgetContent extends IVisualizationDesign {
    graph: IWidgetGraph;
    title?: string;
    description?: string;
    url?: string;
    mode?: string;
    mapLayers?: Array<any>;
    ui?: IWidgetUI;
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
export interface IWidgetGraph {
    nodes: Array<INode>;
    edges: Array<IEdge>;
}
export interface IFolderFullResponse {
    folder: IFolder;
}
export interface IFolder {
    id: number;
    title: string;
    parent: number;
    sourceKey: string;
}
export interface IBaseShare {
    userId: number;
    right: ShareRightType;
    visualizationId: number;
}
export interface IShare extends IBaseShare {
    updatedAt: string;
    createdAt: string;
}
export interface ISharer extends IBaseShare {
    username: string;
    email: string;
}
export interface ISharers {
    owner: ISimpleUser;
    shares: Array<ISharer>;
}
export interface ITreeChildren {
    type: 'visu' | 'folder';
    id: number;
    title: string;
    children?: Array<ITreeChildren>;
    shareCount?: number;
    widgetKey?: string;
}
export interface IConstraint {
    property: string;
    operator: ConstraintsOperatorType;
    value: any;
}
export interface IBaseRequest {
}
export interface IDataSourceRelative {
    dataSourceKey?: string;
}
export interface IDataSourceConfig {
    dataSourceIndex?: number;
}
