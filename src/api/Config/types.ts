/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {TlsOptions} from 'tls';

import {GenericObject} from '../commonTypes';
import {IPluginConfig} from '../Plugin';
import {OgmaNodeShape, OgmaEdgeShape} from '../displayTypes';

export interface IGetConfigParams {
  sourceIndex?: number;
}

export interface Configuration {
  // available to not authenticated user
  ogma: IOgmaConfig;
  domain: string;
  ssoProvider?: 'oauth2' | 'saml2';
  url: string;

  // partially available to not authenticated user
  access?: IAccessConfig;

  // available to authenticated users
  advanced?: IAdvancedConfig;
  leaflet?: ILeafletConfig[];
  license?: {
    expired: boolean;
  };

  // partially available to authenticated user
  alerts?: IAlertsConfig;

  // available only to admins
  db?: IDatabaseConfig;
  server?: IHttpServerConfig;
  auditTrail?: IAuditTrailConfig;
  defaultPreferences?: IUserPreferencesConfig;
  guestPreferences?: IGuestPreferencesConfig;
  plugins?: IPluginConfig;
  dataSource?: SelectedDataSourceConfig;
  needRestart?: boolean;
}

export type DatabaseDialect = 'sqlite' | 'mysql' | 'mariadb' | 'mssql';

export interface IDatabaseOptions {
  dialect: DatabaseDialect;
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
  cookieHttpOnly?: boolean;
  cookieSecret?: string;
  allowOrigin?: string | string[];
  allowFraming?: boolean;
  domain?: string;
  baseFolder?: string;
  publicPortHttp?: number;
  publicPortHttps?: number;
  cookieDomain?: string;
  listenPortHttps?: number;
  useHttps?: boolean;
  forceHttps?: boolean;
  forcePublicHttps?: boolean;
  certificateFile?: string;
  certificateKeyFile?: string;
  certificatePassphrase?: string;
  tlsCipherList?: string;
  customHTTPHeaders?: GenericObject;
}

export enum AuditTrailMode {
  READ = 'r',
  WRITE = 'w',
  READ_WRITE = 'rw'
}

export interface IAuditTrailConfig {
  enabled?: boolean;
  logFolder?: string;
  fileSizeLimit?: number;
  strictMode?: boolean;
  logResult?: boolean;
  mode?: AuditTrailMode;
  logFulltextSearch?: boolean;
  logPlugins?: boolean;
}

export interface IUserPreferencesConfig {
  locale: string;
  pinOnDrag: boolean;
  incrementalLayout: boolean;
}

export interface IGuestPreferencesConfig {
  locale: string;
  uiWorkspaceSearch: boolean;
  uiExport: boolean;
  uiLayout: UILayout;
  uiDesign: boolean;
  uiEdgeGrouping: boolean;
  uiFilter: boolean;
}

export enum UILayout {
  REGULAR = 'regular',
  SIMPLE = 'simple',
  NONE = 'none'
}

export type SelectedDataSourceConfig =
  | IDataSourceConfig<INeo4jConfig, INeo4jSearchConfig>
  | IDataSourceConfig<INeo4jConfig, InternalIndexConfig>
  | IDataSourceConfig<INeo4jConfig, INeo2esConfig>
  | IDataSourceConfig<ICosmosDbConfig, IAzureSearchConfig>
  | IDataSourceConfig<ICosmosDbConfig, InternalIndexConfig>;

export interface IDataSourceConfig<G = IGraphVendorConfig, I = IVendorConfig> {
  name?: string;
  sourceKey?: string;
  readOnly?: boolean;
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
  databaseName?: string;
  alternativeNodeId?: string;
  alternativeEdgeId?: string;
  allowVirtualEntities?: boolean;
}

export interface ICosmosDbConfig extends IGraphVendorConfig {
  url: string;
  database: string;
  collection: string;
  primaryKey: string;
  partitionKey: string;
  '.NET SDK URI': string;
}

export interface INeo4jSearchConfig extends IVendorConfig {
  initialization?: boolean;
  indexEdges?: boolean;
}

export type InternalIndexConfig = IElasticSearchConfig;

export interface IElasticSearchConfig extends IVendorConfig {
  host: string;
  port: number;
  https?: boolean;
  user?: string;
  password?: string;
  mapping?: string;
  analyzer?: string;
  incrementalIndexation?: boolean;
  timestampPropertyName?: string;
  incrementalIndexationCron?: string;
  forceReindex?: boolean;
  skipEdgeIndexation?: boolean;
}

export interface INeo2esConfig extends IVendorConfig {}

export interface IAzureSearchConfig extends IVendorConfig {
  url: string;
  apiKey: string;
  nodeIndexName: string;
  edgeIndexName?: string;
}

export interface IAlertsConfig {
  enabled?: boolean;
  maxCaseTTL?: number;
  maxCasesLimit?: number;
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
  searchPrefixExpansion: boolean;
  showBuiltinQueries?: boolean;
  slowQueryThreshold?: number;
  searchRetryMultiplier?: number;
  sampledItemsPerType: number;
  sampledVisualizationItems: number;
  pollInterval?: number;
  indexationChunkSize?: number;
  layoutWorkers?: number;
  defaultFuzziness?: number;
  extraCertificateAuthorities?: string;
  obfuscation?: boolean;
  edgesBetweenSupernodes?: boolean;
  itemTypeCountLimit?: number;
  dataSourceConnectionTimeout?: number;
  dataSourceAutoReconnectInterval?: number;
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
  defaultPageParams?: GenericObject;
  dataEdition?: boolean;
  widget?: boolean;
  loginTimeout?: number;
  externalUsersAllowedGroups?: Array<string | number>;
  externalUserDefaultGroupId?: number | number[];
  externalUsersGroupMapping?: GenericObject<number | string | Array<number | string>>;
  autoRefreshGroupMapping?: boolean;
  msActiveDirectory?: Array<IMSActiveDirectoryConfig> | IMSActiveDirectoryConfig;
  ldap?: Array<ILDAPConfig> | ILDAPConfig;
  saml2?: ISaml2Config;
  oauth2?: IOAuth2Config;
}

export interface IMSActiveDirectoryConfig {
  enabled?: boolean;
  url?: string;
  baseDN?: string;
  domain?: string;
  netbiosDomain?: string;
  tls?: TlsOptions;
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
  resource?: string;
  openidconnect?: IOpenIDConnectConfig;
  azure?: IAzureOAuthConfig;
}

export enum AntiAliasing {
  SUPER_SAMPLING = 'super-sampling',
  NATIVE = 'native',
  NONE = 'none'
}

export enum OgmaRenderer {
  WEBGL = 'webgl',
  CANVAS = 'canvas'
}

export enum ImgCrossOrigin {
  ANONYMOUS = 'anonymous',
  USE_CREDENTIALS = 'use-credentials'
}

export interface IWebGLConfig {
  antiAliasing?: AntiAliasing;
  fontSamplingSize?: number;
}

export interface TextOptions {
  maxTextLength?: number;
  minVisibleSize?: number;
  maxLineLength?: number;
  backgroundColor?: string;
  font?: string;
  color?: string;
  size?: number;
}

export interface IOgmaConfig {
  renderer?: OgmaRenderer;
  webglOptions?: IWebGLConfig;
  imgCrossOrigin?: ImgCrossOrigin;
  options?: {
    styles?: {
      node?: {
        nodeRadius?: number;
        shape?: OgmaNodeShape;
        text?: TextOptions & {nodePosition?: 'right' | 'left' | 'top' | 'bottom' | 'center'};
      };
      edge?: {
        edgeWidth?: number;
        shape?: OgmaEdgeShape;
        text?: TextOptions;
      };
    };
    interactions?: {
      zoom?: {
        modifier?: number;
      };
      rotation?: {
        enabled?: boolean;
      };
    };
    backgroundColor?: string;
  };
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
  path: 'dataSource';
}

export type IUpdateConfigParams<T = unknown> =
  | IResetConfigParams
  | IDataSourceConfigParams
  | IConfigurationParams<T>;
