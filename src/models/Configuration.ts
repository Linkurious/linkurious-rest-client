/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-30.
 */
export interface ConfigurationParams<T> {
  path?: string;
  configuration: T;
  sourceIndex?: number;
  reset?: boolean;
}

export interface ResetConfigParams extends ConfigurationParams<undefined> {
  reset: true;
}

export interface DataSourceConfigParams extends ConfigurationParams<DataSourceConfig> {
  sourceIndex: number;
  path: 'dataSource'
}

export interface DataSourceConfig<G = GraphVendorConfig, I = IndexVendorConfig> {
  deleted?: boolean;
  name?: string;
  manualSourceKey?: string;
  readonly?: boolean;
  graphdb: G;
  index: I;
}

export type InternalIndexConfig = ElasticSearchConfig | ElasticSearch2Config;

export interface VendorConfig {
  vendor: string;
}

export interface GraphVendorConfig extends VendorConfig {
  url: string;
  user?: string;
  password?: string;
  latitudeProperty?: string;
  longitudeProperty?: string;
  allowSelfSigned?: boolean;
  alternativeNodeId?: string;
  alternativeEdgeId?: string;
}

export interface CosmosDbConfig extends GraphVendorConfig {
  database: string;
  collection: string;
  primaryKey: string;
  '.NET SDK URI'?: string;
  user: undefined;
  password: undefined;
}

export interface GremlinSessionConfig extends GraphVendorConfig {
  maxStale?: number;
  sessionPool?: number;
}

export interface JanusGraphConfig extends GremlinSessionConfig {
  graphAlias?: string;
  traversalSourceAlias?: string;
  configurationPath?: string;
  configuration?: object;
  disableIndexExistCheck?: boolean;
}

export interface JanusGraphForComposeConfig extends JanusGraphConfig {
  graphName: string;
  create?: boolean;
  graphAlias: undefined;
  traversalSourceAlias: undefined;
  configurationPath: undefined;
  configuration: undefined;
}

export interface Neo4jConfig extends GraphVendorConfig {
  proxy?: string;
  writeURL?: string;
}

export interface IndexVendorConfig extends VendorConfig {
  skipEdgeIndexation: boolean;
  indexName?: string;
}

export interface AzureSearchConfig extends IndexVendorConfig {
  url: string;
  apiKey: string;
  nodeIndexName: string;
  edgeIndexName?: string;
}

export interface ElasticSearchConfig extends IndexVendorConfig {
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

export interface ElasticSearch2Config extends IndexVendorConfig {
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

export interface JanusGraphSearchConfig extends IndexVendorConfig {
  create?: boolean;
  nodeIndexName?: string;
  edgeIndexName?: string;
}

export interface Neo2esConfig extends VendorConfig {
  simplifiedSearch?: boolean;
}

export interface Neo4jSearchConfig extends IndexVendorConfig {
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
