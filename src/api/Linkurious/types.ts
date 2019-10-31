/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {TlsOptions} from 'tls';

import {GenericObject} from '../commonTypes';

// GetStatus
export interface IGetStatusResponse {
  status: LKEStatus;
}

// GetVersion
export interface IGetVersionResponse extends LKEVersion {}

// GetConfig
export interface IGetConfigParams {
  sourceIndex: number;
}

export interface IGetConfigResponse {
  // available to not authenticated user
  ogma: OgmaConfiguration;
  domain: string;
  ssoProvider?: string;
  url: string;

  // partially available to not authenticated user
  access?: IAccessConfig;

  // available to authenticated users
  advanced?: IAdvancedConfig;
  leaflet?: ILeafletConfig[];

  // partially available to authenticated user
  alerts?: IAlertsConfig;

  // available only to admins
  db?: IDatabaseConfig;
  server?: IHttpServerConfig;
  auditTrail?: IAuditTrailConfig;
  defaultPreferences?: IUserPreferenceConfig;
  guestPreferences?: IGuestPreferenceConfig;
  dataSource?: SelectedDataSourceConfig;
  needRestart?: boolean;
}

// UpdateConfigParams
export type IUpdateConfigParams<T> =
  | IResetConfigParams
  | IDataSourceConfigParams
  | IConfigurationParams<T>;

// SendAnalytics
export interface ISendAnalyticsParams {
  type: string;
  userId?: number;
  event?: string;
  name?: string;
  properties?: any;
  traits?: any;
  timestamp?: string;
  context?: any;
  groupId?: string;
}

// GetReport
export interface IGetReportParams {
  with_configuration: boolean;
}

// GetCustomFiles
export interface IGetCustomFilesParams {
  root?: string;
  extensions?: string;
}

export interface IGetCustomFilesResponse {
  results: Array<{
    path: string;
    name: string;
  }>;
}

// RestartLinkurious
export interface IRestartLinkuriousResponse {
  url: string;
}

// GetStatus
export interface LKEStatus {
  code: number;
  name: string;
  message: string;
  uptime: number;
}

// GetVersion
export interface LKEVersion {
  tag_name: string;
  name: string;
  prerelease: boolean;
}

// GetConfig
export interface IDatabaseOptions {
  dialect: 'sqlite' | 'mysql' | 'mariadb' | 'mssql';
  storage?: string;
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

export interface IHttpServerConfig {
  listenPort: number;
  clientFolder: string;
  cookieSecret?: string;
  allowOrigin?: string | string[];
  domain?: string;
  baseFolder?: string;
  publicPortHttp?: number;
  publicPortHttps?: number;
  cookieDomain?: string;
  listenPortHttps?: number;
  useHttps?: boolean;
  forceHttps?: boolean;
  forcePublicHttps: boolean;
  certificateFile?: string;
  certificateKeyFile?: string;
  certificatePassphrase?: string;
}

export interface IAuditTrailConfig {
  enabled?: boolean;
  logFolder?: string;
  fileSizeLimit?: number;
  strictMode?: boolean;
  logResult?: boolean;
  mode?: 'r' | 'w' | 'rw';
}

export interface IUserPreferenceConfig {
  locale: string;
  pinOnDrag: boolean;
  incrementalLayout: boolean;
}

export interface IGuestPreferenceConfig {
  locale: string;
  uiWorkspaceSearch: boolean;
  uiExport: boolean;
  uiLayout: 'regular' | 'simple' | 'none';
  uiDesign: boolean;
  uiFilter: boolean;
}

export type SelectedDataSourceConfig =
  | IDataSourceConfig<INeo4jConfig, INeo4jSearchConfig>
  | IDataSourceConfig<INeo4jConfig, InternalIndexConfig>
  | IDataSourceConfig<INeo4jConfig, INeo2esConfig>
  | IDataSourceConfig<IJanusGraphConfig, IJanusGraphSearchConfig>
  | IDataSourceConfig<IJanusGraphConfig, InternalIndexConfig>
  | IDataSourceConfig<ICosmosDbConfig, IAzureSearchConfig>
  | IDataSourceConfig<ICosmosDbConfig, InternalIndexConfig>
  | IDataSourceConfig<IJanusGraphForComposeConfig, IJanusGraphSearchConfig>
  | IDataSourceConfig<IJanusGraphForComposeConfig, InternalIndexConfig>;

export interface IDataSourceConfig<G = IGraphVendorConfig, I = IVendorConfig> {
  name?: string;
  manualSourceKey?: string;
  readonly?: boolean;
  graphdb: G;
  index: I;
}

export interface IGraphVendorConfig extends IVendorConfig {
  latitudeProperty?: string;
  longitudeProperty?: string;
  allowSelfSigned?: boolean;
}

export interface IVendorConfig {
  vendor: string;
}

export interface INeo4jConfig extends IGraphVendorConfig {
  url: string;
  proxy?: string;
  writeURL?: string;
  user?: string;
  password?: string;
  alternativeNodeId?: string;
  alternativeEdgeId?: string;
}

export interface IGremlinSessionConfig extends IGraphVendorConfig {
  maxStale?: number;
  sessionPool?: number;
}

export interface IJanusGraphConfig extends IGremlinSessionConfig {
  url: string;
  graphAlias?: string;
  traversalSourceAlias?: string;
  configurationPath?: string;
  configuration?: object;
  user?: string;
  password?: string;
  alternativeNodeId?: string;
  alternativeEdgeId?: string;
  disableIndexExistCheck?: boolean;
}

export interface ICosmosDbConfig extends IGraphVendorConfig {
  url: string;
  database: string;
  collection: string;
  primaryKey: string;
  '.NET SDK URI'?: string;
}

export interface IJanusGraphForComposeConfig extends IJanusGraphConfig {
  url: string;
  graphName: string;
  create?: boolean;
  user?: string;
  password?: string;
  alternativeNodeId?: string;
  alternativeEdgeId?: string;
  disableIndexExistCheck?: boolean;
}

export interface INeo4jSearchConfig extends IVendorConfig {
  initialization?: boolean;
  indexEdges?: boolean;
  simplifiedSearch?: boolean;
}

export type InternalIndexConfig = IElasticSearchConfig | IElasticSearch2Config;

export interface IElasticSearchConfig extends IVendorConfig {
  host: string;
  port: number;
  forceReindex?: boolean;
  skipEdgeIndexation?: boolean;
  dynamicMapping?: boolean;
  dateDetection?: boolean;
  https?: boolean;
  indexName?: string;
  analyzer?: string;
  user?: string;
  password?: string;
}

export interface IElasticSearch2Config extends IVendorConfig {
  host: string;
  port: number;
  forceReindex?: boolean;
  https?: boolean;
  user?: string;
  password?: string;
  dynamicMapping?: boolean;
  forceStringMapping?: string[];
  analyzer?: string;
  skipEdgeIndexation?: boolean;
  caCert?: string;
  simplifiedSearch?: boolean;
}

export interface INeo2esConfig extends IVendorConfig {
  simplifiedSearch?: boolean;
}

export interface IJanusGraphSearchConfig extends IVendorConfig {
  create?: boolean;
  indexEdges?: boolean;
  nodeIndexName?: string;
  edgeIndexName?: string;
}

export interface IAzureSearchConfig extends IVendorConfig {
  url: string;
  apiKey: string;
  nodeIndexName: string;
  edgeIndexName?: string;
}

export interface IAlertsConfig {
  enabled?: boolean;
  maxMatchTTL?: number;
  maxMatchesLimit?: number;
  maxRuntimeLimit?: number;
  maxConcurrency?: number;
}

export interface IAdvancedConfig {
  supernodeThreshold: number;
  expandThreshold: number;
  rawQueryLimit: number;
  searchAddAllThreshold: number;
  minSearchQueryLength: number;
  rawQueryTimeout: number;
  sampledItemsPerType: number;
  sampledVisualizationItems: number;
  defaultTimeZone: string;
  timeline: boolean;
  connectionRetries?: number;
  pollInterval?: number;
  indexationChunkSize?: number;
  layoutWorkers?: number;
  defaultFuzziness?: number;
  extraCertificateAuthorities?: string;
  obfuscation?: boolean;
  edgesBetweenSupernodes?: boolean;
}

export interface ILeafletConfig {
  name: string;
  urlTemplate: string;
  attribution: string;
  minZoom: number;
  maxZoom: number;
  thumbnail: string;
  subdomains?: string;
  id?: string;
  accessToken?: string;
  overlay?: boolean;
}

export enum DefaultPage {
  DASHBOARD = 'dashboard',
  WORKSPACE = 'workspace'
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
  autoRefreshGroupMapping?: boolean;
  msActiveDirectory?: IMSActiveDirectoryConfig;
  ldap?: ILDAPConfig;
  saml2?: ISaml2Config;
  oauth2?: IOAuth2Config;
}

export interface IMSActiveDirectoryConfig {
  enabled?: boolean;
  url?: string;
  baseDN?: string;
  domain?: string;
  netbiosDomain?: string;
  tls?: TlsOptions; //In progress here
}

export interface ILDAPConfig {
  enabled: boolean;
  url: string;
  bindDN?: string;
  bindPassword?: string;
  baseDN: string | string[];
  usernameField: string;
  emailField?: string;
  groupField?: string;
  tls?: TlsOptions;
}

export interface ISaml2Config {
  enabled: boolean;
  url: string;
  identityProviderCertificate: string;
  groupAttribute?: string;
  emailAttribute?: string;
}

export interface IOpenIDConnectConfig {
  userinfoURL?: string;
  scope?: string;
  groupClaim?: string;
}

export interface IAzureOAuthConfig {
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
  azure?: IAzureOAuthConfig;
}

export declare enum AntiAliasing {
  SUPER_SAMPLING = 'super-sampling',
  NATIVE = 'native',
  NONE = 'none'
}

export declare enum OgmaRenderer {
  WEBGL = 'webgl',
  CANVAS = 'canvas'
}

export declare enum ImgCrossOrigin {
  ANONYMOUS = 'anonymous',
  USE_CREDENTIALS = 'use-credentials'
}

export interface IWebGLConfig {
  antiAliasing?: AntiAliasing;
  fontSamplingSize?: number;
}

export interface OgmaConfiguration {
  renderer?: OgmaRenderer;
  webglOptions?: IWebGLConfig;
  imgCrossOrigin?: ImgCrossOrigin;
  options?: GenericObject<unknown>;
}

// UpdateConfigParams
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
  path: 'dataSource';
}