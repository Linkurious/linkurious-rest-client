/**
 * LINKURIOUS CONFIDENTIAL
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
