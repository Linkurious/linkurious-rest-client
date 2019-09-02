/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-30.
 */
interface GenericObject<T> {
  [key: string]: T
}

export interface IConfigurationParams<T> {
  path?: string;
  configuration: T;
  sourceIndex?: number;
  reset?: boolean;
}

export interface IResetConfigParams extends IConfigurationParams<undefined> {
  reset: true;
}

export interface IDataSourceConfigParams extends IConfigurationParams<SelectedDataSourceConfig> {
  sourceIndex: number;
  path: 'dataSource'
}

export interface IDataSourceConfig<G = IGraphVendorConfig, I = IIndexVendorConfig> {
  deleted?: boolean;
  name?: string;
  manualSourceKey?: string;
  readonly?: boolean;
  graphdb: G;
  index: I;
}

export type SelectedDataSourceConfig =
  IDataSourceConfig<INeo4jConfig, INeo4jSearchConfig> |
  IDataSourceConfig<INeo4jConfig, InternalIndexConfig> |
  IDataSourceConfig<INeo4jConfig, INeo2esConfig> |
  IDataSourceConfig<IJanusGraphConfig, IJanusGraphSearchConfig> |
  IDataSourceConfig<IJanusGraphConfig, InternalIndexConfig> |
  IDataSourceConfig<ICosmosDbConfig, IAzureSearchConfig> |
  IDataSourceConfig<ICosmosDbConfig, InternalIndexConfig> |
  IDataSourceConfig<IJanusGraphForComposeConfig, IJanusGraphSearchConfig> |
  IDataSourceConfig<IJanusGraphForComposeConfig, InternalIndexConfig>;

export type InternalIndexConfig = IElasticSearchConfig | IElasticSearch2Config;

export interface IVendorConfig {
  vendor: string;
}

export interface IGraphVendorConfig extends IVendorConfig {
  url: string;
  user?: string;
  password?: string;
  latitudeProperty?: string;
  longitudeProperty?: string;
  allowSelfSigned?: boolean;
  alternativeNodeId?: string;
  alternativeEdgeId?: string;
}

export interface ICosmosDbConfig extends IGraphVendorConfig {
  database: string;
  collection: string;
  primaryKey: string;
  '.NET SDK URI'?: string;
  user: undefined;
  password: undefined;
}

export interface IGremlinSessionConfig extends IGraphVendorConfig {
  maxStale?: number;
  sessionPool?: number;
}

export interface IJanusGraphConfig extends IGremlinSessionConfig {
  graphAlias?: string;
  traversalSourceAlias?: string;
  configurationPath?: string;
  configuration?: object;
  disableIndexExistCheck?: boolean;
}

export interface IJanusGraphForComposeConfig extends IJanusGraphConfig {
  graphName: string;
  create?: boolean;
  graphAlias: undefined;
  traversalSourceAlias: undefined;
  configurationPath: undefined;
  configuration: undefined;
}

export interface INeo4jConfig extends IGraphVendorConfig {
  proxy?: string;
  writeURL?: string;
}

export interface IIndexVendorConfig extends IVendorConfig {
  skipEdgeIndexation: boolean;
  indexName?: string;
}

export interface IAzureSearchConfig extends IIndexVendorConfig {
  url: string;
  apiKey: string;
  nodeIndexName: string;
  edgeIndexName?: string;
}

export interface IElasticSearchConfig extends IIndexVendorConfig {
  host: string;
  port: number;
  https?: boolean;
  forceReindex?: boolean;
  dynamicMapping: boolean;
  dateDetection: boolean;
  indexName?: string;
  mapping?: object;
  analyzer?: string;
  user?: string;
  password?: string;
}

export interface IElasticSearch2Config extends IIndexVendorConfig {
  host: string;
  port: number;
  https?: boolean;
  forceReindex?: boolean;
  dynamicMapping: boolean;
  simplifiedSearch?: boolean;
  caCert?: string;
  forceStringMapping: string[];
  analyzer?: string;
  user?: string;
  password?: string;
}

export interface IJanusGraphSearchConfig extends IIndexVendorConfig {
  create?: boolean;
  nodeIndexName?: string;
  edgeIndexName?: string;
}

export interface INeo2esConfig extends IVendorConfig {
  simplifiedSearch?: boolean;
}

export interface INeo4jSearchConfig extends IIndexVendorConfig {
  initialization: boolean;
  categoriesToIndex?: string[];
  edgeTypesToIndex?: string[];
  nodeIndexName?: string;
  edgeIndexName?: string;
  skipEdgeIndexation: boolean;
  simplifiedSearch?: boolean;
  batchSize?: number;
  numberOfThreads?: number;
  initialOffsetNodes?: number;
  initialOffsetEdges?: number;
}

export enum DefaultPage {
  DASHBOARD = "dashboard",
  WORKSPACE = "workspace"
}

export interface IAccessConfig {
  floatingLicenses?: number;
  authRequired?: boolean;
  guestMode?: boolean;
  defaultPage?: DefaultPage;
  defaultPageParams?: GenericObject<unknown>;
  dataEdition?: boolean;
  widget?: boolean;
  loginTimeout?: number;
  externalUsersAllowedGroups?: Array<string | number>;
  externalUserDefaultGroupId?: number | number[];
  externalUsersGroupMapping?: GenericObject<number | number[]>;
  azureActiveDirectory: unknown;
  msActiveDirectory?: IMSActiveDirectoryConfig;
  ldap?: ILDAPConfig;
  saml2?: ISaml2Config;
  oauth2?: IOAuth2Config;
}

export interface IAdvancedConfig {
  supernodeThreshold: number;
  connectionRetries: number;
  pollInterval: number;
  indexationChunkSize: number;
  expandThreshold: number;
  rawQueryLimit: number;
  searchAddAllThreshold: number;
  minSearchQueryLength: number;
  rawQueryTimeout: number;
  layoutWorkers: number;
  defaultFuzziness: number;
  extraCertificateAuthorities?: string;
  obfuscation?: boolean;
  edgesBetweenSupernodes?: boolean;
  defaultTimeZone: string;
  sampledItemsPerType: number;
  sampledVisualizationItems: number;
  timeline: boolean;
}

export interface IAlertsConfig {
  enabled?: boolean;
  maxMatchTTL?: boolean;
  maxMatchesLimit?: boolean;
  maxRuntimeLimit?: boolean;
  maxConcurrency?: boolean;
}

export interface IAuditTrailConfig {
  enabled?: boolean;
  logFolder?: string;
  fileSizeLimit?: number;
  strictMode?: boolean;
  logResult?: boolean;
  mode?: string;
}

export interface IGuestPreferenceConfig {
  locale: string;
  uiWorkspaceSearch: boolean;
  uiExport: boolean;
  uiLayout: string;
  uiDesign: boolean;
  uiFilter: boolean;
}

export interface IHttpServerConfig {
  listenPort: number;
  clientFolder: string;
  cookieSecret?: string;
  allowOrigin?: string | string[];
  domain?: string;
  publicPortHttp?: number;
  publicPortHttps?: number;
  cookieDomain?: string;
  listenPortHttps?: number;
  useHttps?: boolean;
  forceHttps?: boolean;
  certificateFile?: string;
  certificateKeyFile?: string;
  certificatePassphrase?: string;
}


export interface ILDAPConfig {
  enabled?: boolean;
  url?: string;
  bindDN?: string;
  bindPassword?: string;
  baseDN: string | string[];
  usernameField: string;
  emailField?: string;
  groupField?: string;
  authorizedGroups?: unknown;
  tls?: ITLSOptions & GenericObject<unknown>;
}


export interface ILeafletConfig {
  name: string;
  urlTemplate: string;
  attribution: string;
  minZoom: number;
  maxZoom: number;
  thumbnail: string;
  subdomains?: boolean;
  id?: boolean;
  accessToken?: boolean;
  /**
   * whether this layer is an overlay
   */
  overlay?: boolean;
}


export interface ITLSOptions {
  rejectUnauthorized?: boolean;
}
export interface IMSActiveDirectoryConfig {
  enabled?: boolean;
  url?: string;
  baseDN?: string;
  domain?: string;
  netbiosDomain?: string;
  tls?: ITLSOptions & GenericObject<unknown>;
}

export interface IOpenIDConnectConfig {
  userinfoURL?: string;
  scope?: string;
  groupClaim?: string;
}
export interface AzureOAuthConfig {
  tenantID?: string;
}
export interface IOAuth2Config {
  enabled: boolean;
  provider: string;
  authorizationURL: string;
  tokenURL: string;
  clientID: string;
  clientSecret: string;
  openidconnect?: IOpenIDConnectConfig;
  azure?: AzureOAuthConfig;
}

export declare enum AntiAliasing {
  SUPER_SAMPLING = "super-sampling",
  NATIVE = "native",
  NONE = "none"
}
export declare enum OgmaRenderer {
  WEBGL = "webgl",
  CANVAS = "canvas"
}
export declare enum ImgCrossOrigin {
  ANONYMOUS = "anonymous",
  USE_CREDENTIALS = "use-credentials"
}

export interface IWebGLConfig {
  antiAliasing?: AntiAliasing;
  fontSamplingSize?: number;
}
export interface IOgmaConfig {
  renderer?: OgmaRenderer;
  webglOptions?: IWebGLConfig;
  imgCrossOrigin?: ImgCrossOrigin;
  options?: GenericObject<unknown>;
}


export interface ISaml2Config {
  enabled?: boolean;
  url?: string;
  identityProviderCertificate?: string;
  groupAttribute?: string;
  emailAttribute?: string;
}

export interface IUserPreferenceConfig {
  locale: string;
  pinOnDrag: boolean;
}

export interface IDatabaseOptions {
  dialect: string;
  host?: string;
  port?: string;
}

export interface IDatabaseConfig {
  name: string;
  username?: string;
  password?: string;
  connectionRetries?: number;
  options?: IDatabaseOptions;
}

export interface ICaption {
  active: boolean;
  displayName: boolean;
  properties: string[];
  id?: unknown;
  name?: unknown;
}

export interface ICaptionsConfig {
  nodes: GenericObject<ICaption>;
  edges: GenericObject<ICaption>;
}

export interface IAdminConfig {
  access: IAccessConfig;
  advanced: IAdvancedConfig;
  alerts?: IAlertsConfig;
  auditTrail: IAuditTrailConfig;
  dataSource: IDataSourceConfig;
  db: IDatabaseConfig;
  defaultPreferences: IUserPreferenceConfig;
  defaultCaptions?: ICaptionsConfig
  domain: string;
  guestPreferences: IGuestPreferenceConfig;
  leaflet: ILeafletConfig[];
  needRestart: boolean;
  ogma: IOgmaConfig;
  server: IHttpServerConfig;
  ssoProvider?: string;
  url: string;
}
