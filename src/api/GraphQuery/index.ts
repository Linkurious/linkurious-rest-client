/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CreateQueryResponse,
  GetQueriesResponse,
  GetQueryResponse,
  ICreateQueryParams,
  IDeleteQueryParams,
  IGetQueryParams,
  IGetQueriesParams,
  IUpdateQueryParams,
  UpdateQueryResponse,
  IRunQueryByContentParams,
  RunQueryByContentResponse,
  IRunQueryByIdParams,
  RunQueryByIdResponse,
  CheckQueryResponse,
  ICheckQueryParams
} from './types';

export * from './types';

// TODO make sure data-source unavailable is thrown instead of graph_unreachable
const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  NOT_FOUND,
  BAD_GRAPH_REQUEST,
  GRAPH_REQUEST_TIMEOUT,
  CONSTRAINT_VIOLATION
} = LkErrorKey;

export class GraphQueryAPI extends Request {
  /**
   * Get a graph query owned by the current user or shared with it.
   */
  public getQuery(params: IGetQueryParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN).request<
      GetQueryResponse
    >({
      url: '/:sourceKey/graph/query/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the graph queries owned by the current user or shared with it.
   */
  public getQueries(params: IGetQueriesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN).request<
      GetQueriesResponse
    >({
      url: '/:sourceKey/graph/query',
      method: 'GET',
      params: params
    });
  }

  /**
   * Create a graph query for the current user.
   */
  public createQuery(params: ICreateQueryParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      CreateQueryResponse
    >({
      url: '/:sourceKey/graph/query',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a graph query owned by the current user.
   */
  public updateQuery(params: IUpdateQueryParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      UpdateQueryResponse
    >({
      url: '/:sourceKey/graph/query/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a graph query owned by the current user.
   */
  public deleteQuery(params: IDeleteQueryParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/:sourceKey/graph/query/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Check that the given graph query is syntactically correct. Parse the query if it's a template.
   */
  public checkQuery(params: ICheckQueryParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<CheckQueryResponse>({
      url: '/:sourceKey/graph/check/query',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given graph query.
   * A subgraph made of all the nodes and the edges from each subgraph matching the graph query is returned.
   */
  public runQuery(params: IRunQueryByContentParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<RunQueryByContentResponse>({
      url: '/:sourceKey/graph/run/query',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given saved graph query by id.
   * A subgraph made of all the nodes and the edges from each subgraph matching the graph query is returned.
   */
  public runQueryById(params: IRunQueryByIdParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      GUEST_DISABLED,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<RunQueryByIdResponse>({
      url: '/:sourceKey/graph/run/query/:id',
      method: 'POST',
      params: params
    });
  }
}
