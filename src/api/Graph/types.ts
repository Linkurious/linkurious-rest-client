/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams} from '../commonTypes';
import {LkEdge, LkNode, LkNodeStatistics, LkSubGraph} from '../graphItemTypes';
import {GraphInputType, GraphQueryDialect, GraphQueryType, TemplateField} from '../GraphQuery';
import {EntityType} from '../GraphSchema';
import {ColumnType} from '../Alerts';

export interface IGetSubGraphParams extends IDataSourceParams {
  edgesTo?: string[];
  withDigest?: boolean;
  withDegree?: boolean;
}

export interface ISearchParams extends IDataSourceParams {
  type: EntityType;
  q: string;
  fuzziness?: number;
  size?: number;
  from?: number;
  categoriesOrTypes?: string[];
  filter?: Array<[string, string]>;
}

export interface SearchResponse {
  type: EntityType;
  totalHits?: number;
  moreResults?: boolean;
  results: LkNode[] | LkEdge[];
}

export interface ISearchFullParams extends IGetSubGraphParams, ISearchParams {}

export type SearchFullResponse = LkSubGraph;

export interface ICheckQueryParams extends IDataSourceParams {
  query: string;
  dialect?: GraphQueryDialect;
}

export interface CheckQueryResponse {
  write: boolean;
  type: GraphQueryType;
  graphInput?: GraphInputType;
  templateFields?: TemplateField[];
}

export interface IRunQueryParams extends IDataSourceParams {
  dialect?: GraphQueryDialect;
  limit?: number;
  timeout?: number;
  templateData?: GenericObject;
}

export interface IRunQueryByContentParams extends IGetSubGraphParams, IRunQueryParams {
  query: string;
}

export interface RunQueryResponse extends LkSubGraph {
  truncatedByLimit: boolean;
  truncatedByAccess: boolean;
}

export type RunQueryByContentResponse = RunQueryResponse;

export interface IRunQueryByIdParams extends IGetSubGraphParams, IRunQueryParams {
  id: number;
}

export type RunQueryByIdResponse = RunQueryResponse;

export interface IAlertPreviewParams extends IDataSourceParams {
  query: string;
  dialect?: GraphQueryDialect;
  columns?: Array<{columnName: string; columnTitle?: string; type: ColumnType}>;
  limit?: number;
  timeout?: number;
}

// TODO make server return the array directly
export type AlertPreviewResponse = Array<{
  nodes: LkNode[];
  edges: LkEdge[];
  columns: Array<string | number>;
}>;

export interface IGetStatisticsParams extends IDataSourceParams {
  ids: string[];
  withDigest?: boolean;
  withDegree?: boolean;
}

export type GetStatisticsResponse = LkNodeStatistics;

export interface IGetAdjacentNodesParams extends IGetSubGraphParams {
  ids: string[];
  limit?: number;
  limitType?: 'id' | 'highestDegree' | 'lowestDegree';
  nodeCategories?: string[];
  edgeTypes?: string[];
}

export type GetAdjacentNodesResponse = LkSubGraph;
