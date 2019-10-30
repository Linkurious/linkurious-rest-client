/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */
import { IDataSourceParams } from '../commonTypes';
import { EntityType } from '../GraphSchema/types';
import { LkEdge, LkNode } from '../..';

export interface ISimpleSearchParams extends IDataSourceParams {
  type: EntityType;
  q: string;
  fuzziness?: number;
  size?: number;
  from?: number;
}

export interface IAdvancedSearchParams extends ISimpleSearchParams {
  filter?: Array<[string, string]>;
  categoriesOrTypes?: string[];
}

export interface ISearchResponse {
  type: EntityType;
  totalHits?: number;
  moreResults?: boolean;
  results: LkNode[] | LkEdge[];
}

export interface ISearchUsersParams {
    startsWith?: string;
    contains?: string;
    groupId?: number;
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: string;
}

export interface ISearchFullParams extends IAdvancedSearchParams {
  edgesTo?: string[];
  withDigest?: boolean;
  withDegree?: boolean;
  withAccess?: boolean;
}

export interface ISearchFullResponse {
  nodes: LkNode[]
  edges: LkEdge[]
}

export interface IStartIndexationParams extends IDataSourceParams {}

export interface IGetIndexationStatusParams extends IDataSourceParams {}

export enum IndexationStatus {
  ONGOING = 'ongoing',
  DONE = 'done',
  NEEDED = 'needed'
}

export interface IGetIndexationStatusResponse {
  indexing: IndexationStatus;
  indexing_progress?: string;
  indexing_status: string;
  node_count?: number;
  edge_count?: number;
  index_size?: number;
  indexed_source: string;
}
