/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {IDataSourceParams, IGetSubGraphParams} from '../commonTypes';
import {LkEdge, LkNode} from '../graphItemTypes';
import {EntityType} from '../GraphSchema';

export enum IndexationStatus {
  ONGOING = 'ongoing',
  DONE = 'done',
  NEEDED = 'needed'
}

// TODO SERVER, make indexingProgress and indexingStatus camelCase
export interface GetIndexationStatusResponse {
  indexing: IndexationStatus;
  indexingProgress?: string;
  indexingStatus: string;
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
  filter?: Array<[string, string]>;
}

export interface SearchResponse {
  type: EntityType;
  totalHits?: number;
  moreResults?: boolean;
  results: Array<LkNode | LkEdge>;
}

export interface ISearchFullParams extends IGetSubGraphParams, ISearchParams {}
