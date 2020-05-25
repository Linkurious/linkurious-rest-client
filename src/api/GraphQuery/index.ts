/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CheckQueryResponse,
  GraphQuery,
  ICheckQueryParams,
  ICreateQueryParams,
  IDeleteQueryParams,
  IGetQueriesParams,
  IGetQueryParams,
  IRunQueryByContentParams,
  IRunQueryByIdParams,
  IUpdateQueryParams,
  RunQueryResponse
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  NOT_FOUND,
  BAD_GRAPH_REQUEST,
  GRAPH_REQUEST_TIMEOUT,
  CONSTRAINT_VIOLATION,
  MALFORMED_QUERY_TEMPLATE
} = LkErrorKey;

export class GraphQueryAPI extends Request {
  /**
   * Get a graph query owned by the current user or shared with it.
   */
  public getQuery(this: Request<GraphQuery>, params: IGetQueryParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/graph/query/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the graph queries owned by the current user or shared with it.
   */
  public getQueries(this: Request<GraphQuery[]>, params: IGetQueriesParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN],
      url: '/:sourceKey/graph/query',
      method: 'GET',
      params: params
    });
  }

  /**
   * Create a graph query for the current user.
   */
  public createQuery(this: Request<GraphQuery>, params: ICreateQueryParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, MALFORMED_QUERY_TEMPLATE],
      url: '/:sourceKey/graph/query',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a graph query owned by the current user.
   */
  public updateQuery(this: Request<GraphQuery>, params: IUpdateQueryParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        MALFORMED_QUERY_TEMPLATE
      ],
      url: '/:sourceKey/graph/query/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a graph query owned by the current user.
   */
  public deleteQuery(params: IDeleteQueryParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/graph/query/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Check that the given graph query is syntactically correct. Parse the query if it's a template.
   */
  public checkQuery(this: Request<CheckQueryResponse>, params: ICheckQueryParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        BAD_GRAPH_REQUEST,
        GRAPH_REQUEST_TIMEOUT,
        CONSTRAINT_VIOLATION,
        MALFORMED_QUERY_TEMPLATE
      ],
      url: '/:sourceKey/graph/check/query',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given graph query.
   * A subgraph made of all the nodes and the edges from each subgraph matching the graph query is returned.
   */
  public runQuery(this: Request<RunQueryResponse>, params: IRunQueryByContentParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        BAD_GRAPH_REQUEST,
        GRAPH_REQUEST_TIMEOUT,
        CONSTRAINT_VIOLATION,
        MALFORMED_QUERY_TEMPLATE
      ],
      url: '/:sourceKey/graph/run/query',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given saved graph query by id.
   * A subgraph made of all the nodes and the edges from each subgraph matching the graph query is returned.
   */
  public runQueryById(this: Request<RunQueryResponse>, params: IRunQueryByIdParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        GUEST_DISABLED,
        FORBIDDEN,
        NOT_FOUND,
        BAD_GRAPH_REQUEST,
        GRAPH_REQUEST_TIMEOUT,
        CONSTRAINT_VIOLATION
      ],
      url: '/:sourceKey/graph/run/query/:id',
      method: 'POST',
      params: params
    });
  }
}
