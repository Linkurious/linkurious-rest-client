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

export interface GetIndexationStatusResponse {
  indexing: IndexationStatus;
  indexingProgress?: string;
  indexingStatus: string;
  nodeCount?: number;
  edgeCount?: number;
  indexSize?: number;
  indexedSource: string;
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
  totalHits?: number; // one among totalHits and moreResults is defined
  moreResults?: boolean;
  results: Array<LkNode | LkEdge>;
}

export interface ISearchFullParams extends IGetSubGraphParams, ISearchParams {}
