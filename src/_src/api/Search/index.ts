/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */
import { LkErrorKey } from '../../http/response';
import { Request } from '../../http/request';
import {
  ISearchFullParams,
  ISearchFullResponse,
  IAdvancedSearchParams,
  ISearchResponse,
  ISimpleSearchParams
} from './types';

const {INVALID_PARAMETER, UNAUTHORIZED,} = LkErrorKey;


export class SearchApi extends Request {
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
