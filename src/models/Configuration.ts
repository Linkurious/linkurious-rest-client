/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-30.
 */

// TS2019-DONE

import {GenericObject} from './Model';

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

export interface IDataSourceConfig<G = IGraphVendorConfig, I = IVendorConfig> {
  name?: string;
  manualSourceKey?: string;
  readonly?: boolean;
  graphdb: G;
  index: I;
}

export interface IGetApplicationConfigParams {
  sourceIndex?: number;
}

export interface IDeleteDataSourceConfigParams {
  dataSourceIndex: number;
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

export type InternalIndexConfig = IElasticSearchConfig | IElasticSearch2Config;

export interface IVendorConfig {
  vendor: string;
}

export interface IGraphVendorConfig extends IVendorConfig {
  latitudeProperty?: string;
  longitudeProperty?: string;
  allowSelfSigned?: boolean;
}

export interface ICosmosDbConfig extends IGraphVendorConfig {
  url: string;
  database: string;
  collection: string;
  primaryKey: string;
  '.NET SDK URI'?: string;
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

export interface INeo4jConfig extends IGraphVendorConfig {
  url: string;
  proxy?: string;
  writeURL?: string;
  user?: string;
  password?: string;
  alternativeNodeId?: string;
  alternativeEdgeId?: string;
}

export interface IAzureSearchConfig extends IVendorConfig {
  url: string;
  apiKey: string;
  nodeIndexName: string;
  edgeIndexName?: string;
}

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

export interface IJanusGraphSearchConfig extends IVendorConfig {
  create?: boolean;
  indexEdges?: boolean;
  nodeIndexName?: string;
  edgeIndexName?: string;
}

export interface INeo2esConfig extends IVendorConfig {
  simplifiedSearch?: boolean;
}

export interface INeo4jSearchConfig extends IVendorConfig {
  initialization?: boolean;
  indexEdges?: boolean;
  simplifiedSearch?: boolean;
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

export interface IAdvancedConfig {
  supernodeThreshold: number;
  expandThreshold: number;
  rawQueryLimit: number;
  searchAddAllThreshold: number;
  minSearchQueryLength: number;
  rawQueryTimeout: number;
  defaultTimeZone: string;
  sampledItemsPerType: number;
  sampledVisualizationItems: number;
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
  mode?: 'r' | 'w' | 'rw';
}

export interface IGuestPreferenceConfig {
  locale: string;
  uiWorkspaceSearch: boolean;
  uiExport: boolean;
  uiLayout: 'regular' | 'simple' | 'none';
  uiDesign: boolean;
  uiFilter: boolean;
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
  certificateFile?: string;
  certificateKeyFile?: string;
  certificatePassphrase?: string;
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

export interface IOgmaConfig {
  renderer?: OgmaRenderer;
  webglOptions?: IWebGLConfig;
  imgCrossOrigin?: ImgCrossOrigin;
  options?: GenericObject<unknown>;
}

export interface IUserPreferenceConfig {
  locale: string;
  pinOnDrag: boolean;
  incrementalLayout: boolean;
}

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

export interface IGetApplicationConfigResponse {
  // available only to admins
  db?: IDatabaseConfig;
  server?: IHttpServerConfig;
  auditTrail?: IAuditTrailConfig;
  defaultPreferences?: IUserPreferenceConfig;
  guestPreferences?: IGuestPreferenceConfig;
  dataSource?: SelectedDataSourceConfig;
  needRestart?: boolean;

  // partially available to authenticated user
  alerts?: IAlertsConfig;

  // available to authenticated users
  advanced?: IAdvancedConfig;
  leaflet?: ILeafletConfig[];

  // partially available to not authenticated user
  access?: IAccessConfig;

  // available also to not authenticated user
  ogma: IOgmaConfig;
  domain: string;
  ssoProvider?: string;
  url: string;
}