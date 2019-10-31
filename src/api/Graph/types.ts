/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {LkEdge, LkNode} from '../graphItemTypes';
import {IDataSourceParams} from '../commonTypes';
import {EntityType} from '../GraphSchema';

export interface IGetDigestParams extends IDataSourceParams {
  ids: string[] | number[];
  withDigest?: boolean;
  withDegree?: boolean;
}

export interface IGetAdjacentNodesParams extends IDataSourceParams {
  ids: string[] | number[];
  edgesTo?: string[] | number[];
  nodeCategories?: string[];
  edgeTypes?: string[];
  limit?: number;
  limitType?: string;
  withDigest?: boolean;
  withDegree?: boolean;
}

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

export interface GraphSearchResponse {
  type: EntityType;
  totalHits?: number;
  moreResults?: boolean;
  results: LkNode[] | LkEdge[];
}

export interface ISearchFullParams extends IAdvancedSearchParams {
  edgesTo?: string[];
  withDigest?: boolean;
  withDegree?: boolean;
  withAccess?: boolean;
}
