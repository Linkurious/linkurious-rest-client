/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

import {TlsOptions} from 'tls';

import {GenericObject} from '../commonTypes';
import {LicenseState} from '../License';
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
  setupAuthentication: boolean;
  instanceKey: string;
  config: {
    hide: boolean;
  };
  license: {
    readOnly: boolean;
    state: LicenseState;
    seatsLimitExceeded: boolean;
  };

  // partially available to not authenticated user
  access: IAccessConfig;

  // available to authenticated users
  advanced?: IAdvancedConfig;
  embeddedElasticSearch?: {
    enabled: boolean;
  };
  leaflet?: ILeafletConfig[];

  // partially available to authenticated user
  alerts?: IAlertsConfig;

  // available only to admins
  db?: IDatabaseConfig;
  server?: IHttpServerConfig;
  metrics?: MetricsConfig;
  auditTrail?: IAuditTrailConfig;
  defaultPreferences?: IUserPreferencesConfig;
  guestPreferences?: IGuestPreferencesConfig;
  webhooks?: WebhooksConfig;
  plugins?: IPluginConfig;
  dataSource?: SelectedDataSourceConfig;
  needRestart?: boolean;
  emailNotifications: IEmailNotificationsConfig;
  entityResolution?: EntityResolutionConfig;
  entityResolutionSourceKey?: string;
  cluster?: ClusterConfig;
  troubleshooting?: TroubleshootingConfig;
}

export type DatabaseDialect = 'sqlite' | 'mysql' | 'mariadb' | 'mssql';

export interface IDatabaseOptions {
  dialect: Exclude<DatabaseDialect, 'sqlite'>;
  host?: string;
  port?: number;
  dialectOptions?: Record<string, unknown>;
}

export interface ISqliteOptions {
  dialect: 'sqlite';
  storage: string;
}

export interface IDatabaseConfig {
  name: string;
  username?: string;
  password?: string;
  connectionRetries?: number;
  transactionTimeout?: number;
  options: IDatabaseOptions | ISqliteOptions;
  allowFutureStoreVersion?: boolean;
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

export interface MetricsConfig {
  enabled?: boolean;
  listenPort?: number;
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

export interface WebhooksConfig {
  enabled: boolean;
  deliveryFrequency?: string;
  cleanupFrequency?: string;
  deliveryRetentionDelayMs?: number;
}

export enum UILayout {
  REGULAR = 'regular',
  SIMPLE = 'simple',
  NONE = 'none'
}

export type SelectedDataSourceConfig =
  | IDataSourceConfig<INeo4jConfig, INeo4jSearchConfig>
  | IDataSourceConfig<INeo4jConfig, InternalIndexConfig>
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
  user?: string;
  password?: string;
  databaseName?: string;
  alternativeNodeId?: string;
  alternativeEdgeId?: string;
  allowVirtualEntities?: boolean;
  timestampPropertyName?: string;
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
  analyzer?: string;
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
  incrementalIndexing?: boolean;
  incrementalIndexingCron?: string;
  forceReindex?: boolean;
  skipEdgeIndexing?: boolean;
}

export interface IAzureSearchConfig extends IVendorConfig {
  url: string;
  apiKey: string;
  nodeIndexName: string;
  edgeIndexName?: string;
}

export interface IAlertsConfig {
  enabled?: boolean;
  maxMatchesLimit?: number;
  maxRuntimeLimit?: number;
  enableDataPreprocessing?: boolean;
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
  indexingChunkSize?: number;
  layoutWorkers?: number;
  defaultFuzziness?: number;
  extraCertificateAuthorities?: string;
  obfuscation?: boolean;
  edgesBetweenSupernodes?: boolean;
  itemTypeCountLimit?: number;
  dataSourceConnectionTimeout?: number;
  dataSourceAutoReconnectInterval?: number;
  flags?: GenericObject;
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

export interface IAccessConfig {
  floatingLicenses?: number;
  authRequired?: boolean;
  disableLocalAuth?: boolean;
  enableCustomGroups?: boolean;
  enablePropertyKeyAccessRights?: boolean;
  guestMode?: boolean;
  dataEdition?: boolean;
  widget?: boolean;
  visualizationExport: boolean;
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
  identityProviderCertificate?: string;
  identityProviderCertificateValue?: string;
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
  nodeGrouping?: NodeGroupingConfig;
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

export interface IAbstractMailerConfig {
  type: string;
}

export type MailerType = 'smtp';

export interface IMailerConfig extends IAbstractMailerConfig {
  type: MailerType;
  auth?: ISMTPAuthConfig;
  host: string;
  port: number;
  ssl: boolean;
  allowSelfSigned?: boolean;
}

export interface ISMTPAuthConfig {
  user: string;
  password: string;
}

export interface IEmailNotificationsConfig {
  // Alert notifications.
  alertNotifications: boolean;
  newCasesDigestNotificationFrequency: string;
  caseAssignmentNotificationFrequency: string;
  caseMentionNotificationFrequency: string;

  // Visualization notifications.
  visualizationNotifications: boolean;
  visualizationMentionNotificationFrequency: string;

  // Entity resolution notifications.
  entityResolutionLicenseNotifications: boolean;
  entityResolutionLicenseCheckFrequency: string;
  entityResolutionIngestionSuccessNotifications: boolean;
  entityResolutionIngestionFailureNotifications: boolean;

  // Email configuration.
  mailer: IMailerConfig;
  fromEmail: string;
}
export interface EntityResolutionConfig {
  enabled: boolean;
  url: string;
  chunkSize?: number;
  expandLimitPerNode?: number;
  serviceApiKey?: string;
}

export type ClusterMode = 'primary' | 'secondary';

export interface ClusterConfig {
  enabled: boolean;
  mode?: ClusterMode;
  maxDriftMs?: number;
}

export interface TroubleshootingConfig {
  enableReport: boolean;
  enableFullErrors: boolean;
}

export interface NodeGroupingConfig {
  displayCollapsedByDefault?: boolean;
}
