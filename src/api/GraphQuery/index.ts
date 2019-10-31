/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  ICheckGraphQueryParams,
  CheckGraphQueryResponse,
  ICreateGraphQueryParams,
  IDeleteGraphQueryParams,
  IGetGraphQueriesParams,
  IGetGraphQueryParams,
  GraphQueryResponse,
  IUpdateGraphQueryParams
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  BAD_GRAPH_REQUEST,
  CONSTRAINT_VIOLATION,
  GRAPH_REQUEST_TIMEOUT,
  GRAPH_UNREACHABLE
} = LkErrorKey;

export class GraphQueryAPI extends Request {
  /**
   * Returns a saved GraphModule Query owned by the current user.
   */
  public getQuery(params: IGetGraphQueryParams) {
    return this.handle(
      UNAUTHORIZED,
      GUEST_DISABLED,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT,
      DATA_SOURCE_UNAVAILABLE,
      GRAPH_UNREACHABLE
    ).request<GraphQueryResponse>({
      url: '/:sourceKey/graph/query/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Returns all saved GraphModule Queries owned by the current user.
   */
  public getQueries(params: IGetGraphQueriesParams) {
    return this.handle(
      UNAUTHORIZED,
      FORBIDDEN,
      GUEST_DISABLED,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT,
      DATA_SOURCE_UNAVAILABLE,
      GRAPH_UNREACHABLE
    ).request<GraphQueryResponse[]>({
      url: '/:sourceKey/graph/query',
      method: 'GET',
      params: params
    });
  }

  /**
   * Save and Returns the created GraphQuery.
   */
  public createQuery(params: ICreateGraphQueryParams) {
    return this.handle(
      UNAUTHORIZED,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT,
      DATA_SOURCE_UNAVAILABLE,
      GRAPH_UNREACHABLE
    ).request<GraphQueryResponse>({
      url: '/:sourceKey/graph/query',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a graph query owned but the current user.
   */
  // TODO RC-refactoring update should return the item
  public updateGraphQuery(params: IUpdateGraphQueryParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND, DATA_SOURCE_UNAVAILABLE).request({
      url: '/:sourceKey/graph/query/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a query.
   */
  public deleteQuery(params: IDeleteGraphQueryParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND, DATA_SOURCE_UNAVAILABLE).request({
      url: '/:sourceKey/graph/query/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Return resolve if the current query is valid.
   */
  public checkQuery(params: ICheckGraphQueryParams) {
    return this.handle(
      UNAUTHORIZED,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT,
      DATA_SOURCE_UNAVAILABLE,
      GRAPH_UNREACHABLE
    ).request<CheckGraphQueryResponse>({
      url: '/:sourceKey/graph/check/query',
      method: 'POST',
      params: params
    });
  }
}
