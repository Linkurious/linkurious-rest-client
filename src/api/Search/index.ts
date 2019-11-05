/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {LkSubGraph} from '../graphItemTypes';
import {IDataSourceParams} from '../commonTypes';

import {
  GetIndexationStatusResponse,
  ISearchFullParams,
  ISearchParams,
  SearchResponse
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN} = LkErrorKey;

export class SearchAPI extends Request {
  /**
   * Start the indexation.
   * The API doesn't wait for the indexation to finish.
   */
  public startIndexation(params: IDataSourceParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request({
      url: '/:sourceKey/search/index',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get the indexation status for a given data-source.
   */
  public getIndexationStatus(params: IDataSourceParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, GUEST_DISABLED).request<
      GetIndexationStatusResponse
    >({
      url: '/:sourceKey/search/status',
      method: 'GET',
      params: params
    });
  }

  /**
   * Perform a search of nodes or edges based on a search query, a fuzziness value and filters.
   * The list of items that matched the search query is returned.
   */
  public search(params: ISearchParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      SearchResponse
    >({
      url: '/:sourceKey/search/:type',
      method: 'POST',
      params: params
    });
  }

  /**
   * Perform a search of nodes or edges based on a search query, a fuzziness value and filters.
   * A subgraph made of the items that matched the search query and the edges between them is returned.
   */
  public searchFull(params: ISearchFullParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<LkSubGraph>({
      url: '/:sourceKey/search/:type/full',
      method: 'POST',
      params: params
    });
  }
}
