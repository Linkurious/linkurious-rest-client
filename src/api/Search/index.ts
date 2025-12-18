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
  AutoCompletePropertyParams,
  GetIndexationStatusResponse,
  ISearchFullParams,
  ISearchParams,
  PropertyAutoCompleteResponse,
  SearchResponse,
  StartIndexationParams,
  UpdateIndexParams
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  ILLEGAL_SOURCE_STATE,
  SOURCE_ACTION_NEEDED,
  MALFORMED_SEARCH_SYNTAX,
  MISSING_SEARCH_ENTITIES,
  SEARCH_DISABLED
} = LkErrorKey;

export class SearchAPI extends Request {
  /**
   * Start indexing for a given data-source.
   *
   * - If the search index does not exist yet, it is created and fully populated.
   *
   * - If incremental indexing is configured AND the search index is consistent with the schema,
   * it is incrementally synchronized.
   *
   * - Otherwise, the search index is deleted and fully re-created.
   *
   * This endpoint responds without waiting for the indexing process to finish. This process run in
   * the background and may take a long time.
   *
   * If waitForCompletion flag is set to true, the request will wait until the indexing process completes before responding.
   */
  public startIndexation(params?: StartIndexationParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        ILLEGAL_SOURCE_STATE,
        SOURCE_ACTION_NEEDED
      ],
      url: '/:sourceKey/search/index',
      method: 'POST',
      params: params
    });
  }

  /**
   * Assert the search index of a given data-source exists (without comprehensively checking its
   * content). Then:
   *
   * - If incremental indexing is configured, incrementally synchronize this index. This
   * synchronization is guaranteed to be incremental: in particular, if the index is not consistent
   * with the schema, a full index re-creation will not be triggered.
   *
   * - Otherwise, simply set the data-source state to READY. In other words, assume it has been
   * fully indexed by external means.
   *
   * This endpoint responds without waiting for the underlying operations to finish. In particular,
   * if an incremental index synchronization is started, it may run for a long time in the
   * background.
   *
   * If waitForCompletion flag is set to true, the request will wait until the indexing process completes before responding.
   */
  public updateIndex(params?: UpdateIndexParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        ILLEGAL_SOURCE_STATE,
        SOURCE_ACTION_NEEDED
      ],
      url: '/:sourceKey/search/index',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete the content of the search index for a given data-source, and set the state of this
   * data-source to NEED_INDEX.
   */
  public deleteIndex(params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, ILLEGAL_SOURCE_STATE],
      url: '/:sourceKey/search/index',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the indexation status for a given data-source.
   */
  public getIndexationStatus(
    this: Request<GetIndexationStatusResponse>,
    params?: IDataSourceParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED],
      url: '/:sourceKey/search/status',
      method: 'GET',
      params: params
    });
  }

  /**
   * Perform a search of nodes or edges based on a search query, a fuzziness value and filters.
   * The list of items that matched the search query is returned.
   */
  public search(this: Request<SearchResponse>, params: ISearchParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        GUEST_DISABLED,
        MALFORMED_SEARCH_SYNTAX,
        MISSING_SEARCH_ENTITIES,
        SEARCH_DISABLED
      ],
      url: '/:sourceKey/search/:type',
      method: 'POST',
      params: params
    });
  }

  /**
   * Perform a search of nodes or edges based on a search query, a fuzziness value and filters.
   * A subgraph made of the items that matched the search query and the edges between them is returned.
   */
  public searchFull(this: Request<LkSubGraph>, params: ISearchFullParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        GUEST_DISABLED,
        MALFORMED_SEARCH_SYNTAX,
        SEARCH_DISABLED
      ],
      url: '/:sourceKey/search/:type/full',
      method: 'POST',
      params: params
    });
  }

  /**
   * Autocomplete a specific text property using a given value prefix.
   * If `params.itemTypes` is defined, will only look for property values within the given
   * node-categories (or edge-types).
   */
  public autoCompleteProperty(
    this: Request<PropertyAutoCompleteResponse>,
    params: AutoCompletePropertyParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, SEARCH_DISABLED],
      url: '/:sourceKey/search/:type/autocomplete',
      method: 'GET',
      params: params
    });
  }
}
