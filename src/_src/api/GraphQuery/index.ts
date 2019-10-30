/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */
import { Request } from '../../http/request';
import { LkErrorKey } from '../../http/response';
import {
  IAlertPreviewParams, IAlertPreviewResponse,
  ICheckGraphQueryParams, ICheckGraphQueryResponse, ICreateGraphQueryParams, IDeleteGraphQueryParams,
  IGetGraphQueriesParams,
  IGetGraphQueryParams,
  IGraphQueryResponse, IRunGraphQueryByContentParams, IRunGraphQueryByIdParams,
  IRunGraphQueryResponse, IUpdateGraphQueryParams
} from './types';

const {INVALID_PARAMETER, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, BAD_GRAPH_REQUEST, CONSTRAINT_VIOLATION, GRAPH_REQUEST_TIMEOUT, GRAPH_UNREACHABLE} = LkErrorKey;

export class GraphQueryApi extends Request {
  /**
   * Returns a saved GraphModule Query owned by the current user.
   */
  public getGraphQuery(params: IGetGraphQueryParams){
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        GUEST_DISABLED,
        FORBIDDEN,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<IGraphQueryResponse>({
        url: '/:sourceKey/graph/query/:id',
        method: 'GET',
        params: params
      })
  }

  /**
   * Returns all saved GraphModule Queries owned by the current user.
   */
  public getAllGraphQueries(params: IGetGraphQueriesParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        GUEST_DISABLED,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<IGraphQueryResponse[]>({
        url: '/:sourceKey/graph/query',
        method: 'GET',
        params: params,
        query: {type: params.type}
      }
    );
  }

  /**IRunGraphQueryParams
   * Run a static or template query
   */
  public run(params: IRunGraphQueryByContentParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<IRunGraphQueryResponse>({
        url: '/:sourceKey/graph/run/query',
        method: 'POST',
        params: params,
        query: {
          withDigest: params.withDigest,
          withDegree: params.withDegree,
          withAccess: params.withAccess
        }
      }
    );
  }

  /**
   * Run a static or template query.
   */
  public runById(params: IRunGraphQueryByIdParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        GUEST_DISABLED,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<IRunGraphQueryResponse>({
        url: '/:sourceKey/graph/run/query/:id',
        method: 'POST',
        params: params,
        query: {
          withDegree: params.withDegree,
          withAccess: params.withAccess,
          withDigest: params.withDigest
        }
      }
    );
  }

  /**
   * Return resolve if the current query is valid.
   */
  public check(params: ICheckGraphQueryParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<ICheckGraphQueryResponse>({
        url: '/:sourceKey/graph/check/query',
        method: 'POST',
        params: params
      }
    );
  }

  /**
   * Preview the result of a query.
   */
  public preview(params: IAlertPreviewParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        GUEST_DISABLED,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<IAlertPreviewResponse>({
        url: '/:sourceKey/graph/alertPreview',
        method: 'POST',
        params: params
      }
    );
  }

  /**
   * Save and Returns the created GraphQuery.
   */
  public saveGraphQuery(params: ICreateGraphQueryParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        BAD_GRAPH_REQUEST,
        CONSTRAINT_VIOLATION,
        GRAPH_REQUEST_TIMEOUT,
        DATA_SOURCE_UNAVAILABLE,
        GRAPH_UNREACHABLE
      )
      .request<IGraphQueryResponse>({
        url: '/:sourceKey/graph/query',
        method: 'POST',
        params: params
      }
    );
  }

  /**
   * Update a graph query owned but the current user.
   */
  public updateGraphQuery(params: IUpdateGraphQueryParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND,
        DATA_SOURCE_UNAVAILABLE,
      )
      .request({
        url: '/:sourceKey/graph/query/:id',
        method: 'PATCH',
        params: params
      });
  }

  /**
   * Delete a query.
   */
  public delete(params: IDeleteGraphQueryParams) {
    return this
      .handle(
        INVALID_PARAMETER,
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND,
        DATA_SOURCE_UNAVAILABLE,
      )
      .request({
        url: '/:sourceKey/graph/query/:id',
        method: 'DELETE',
        params: params
      }
    );
  }
}
