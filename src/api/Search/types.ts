/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {IDataSourceParams, IGetSubGraphParams} from '../commonTypes';
import {LkEdge, LkNode, LkSubGraph} from '../graphItemTypes';
import {EntityType} from '../GraphSchema';

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
