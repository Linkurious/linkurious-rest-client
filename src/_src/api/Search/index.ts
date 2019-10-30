/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */
import { LkErrorKey } from '../../http/response';
import { Request } from '../../http/request';
import { IGetIndexationStatusParams, IGetIndexationStatusResponse, IStartIndexationParams } from './types';
import {
  ISearchFullParams,
  ISearchFullResponse,
  IAdvancedSearchParams,
  ISearchResponse,
  ISimpleSearchParams
} from './types';

const {INVALID_PARAMETER, UNAUTHORIZED, FORBIDDEN, NOT_FOUND} = LkErrorKey;


export class SearchApi extends Request {
  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @breakingChange admin startIndexation method signature changed to the new params/response format
   */
  public startIndexation(params: IStartIndexationParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request({
          url: '/:sourceKey/search/index',
          method: 'POST'
        }
      );
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @breakingChange admin getIndexationStatus method signature changed to the new params/response format
   */
  public getIndexationStatus(params: IGetIndexationStatusParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request<IGetIndexationStatusResponse>({
          url: '/:sourceKey/search/status',
          method: 'GET',
          params: params
        }
      );
  }

  /**
   * Search for items without any filters.
   */
  public simple(params: ISimpleSearchParams) {
    return this
      .handle(INVALID_PARAMETER, UNAUTHORIZED)
      .request<ISearchResponse>({
        url: '/:sourceKey/search/:type',
        method: 'POST',
        params: params
    });
  }

  /**
   * Search for items with filters.
   */
  public advanced(params: IAdvancedSearchParams) {
    return this
      .handle(INVALID_PARAMETER, UNAUTHORIZED)
      .request<ISearchResponse>({
        url: '/:sourceKey/search/:type',
        method: 'POST',
        params: params
      }
    );
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
   */
  public full(params: ISearchFullParams) {
    return this
      .handle(INVALID_PARAMETER, UNAUTHORIZED)
      .request<ISearchFullResponse>({
          url: '/:sourceKey/search/:type/full',
          method: 'POST',
          params: params
        }
      );
  }
}
