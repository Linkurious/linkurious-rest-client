/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-07-01.
 */

// TS2019-DONE

import {LkNormalizedEdge, LkNormalizedNode, LkNormalizedSubGraph} from './Entities';
import {IDataSourceParams} from './Model';
import {EntityType} from './Schema';

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

export interface ISearchParams extends IDataSourceParams {
  type: EntityType;
  q: string;
  fuzziness?: number;
  size?: number;
  from?: number;
  categoriesOrTypes?: string[];
  filter?: string[][];
}

export interface ISearchAndAddSubGraphParams extends ISearchParams {
  edgesTo?: string[];
  withDigest?: boolean;
  withDegree?: boolean;
}

export interface ISearchResponse {
  type: EntityType;
  totalHits?: number;
  moreResults?: boolean;
  results: LkNormalizedNode[] | LkNormalizedEdge[];
}

export interface ISearchAndAddSubGraphResponse extends LkNormalizedSubGraph {}
