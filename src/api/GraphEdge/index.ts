/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CreateEdgeResponse,
  GetEdgeCountResponse,
  GetEdgeResponse,
  ICreateEdgeParams,
  IDeleteEdgeParams,
  IGetEdgeCountParams,
  IGetEdgeParams,
  IUpdateEdgeParams,
  UpdateEdgeResponse
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class GraphEdgeAPI extends Request {
  /**
   * Get an edge of the graph.
   * A subgraph made of the edge and its extremities is returned.
   */
  public getEdge(params: IGetEdgeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND).request<
      GetEdgeResponse
    >({
      url: '/:sourceKey/graph/edges/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Add an edge to the graph.
   */
  public createEdge(params: ICreateEdgeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      CreateEdgeResponse
    >({
      url: '/:sourceKey/graph/edges',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a subset of properties of an edge. Keep every other property of the edge unchanged.
   * It's not possible to update the type of an edge.
   */
  public updateEdge(params: IUpdateEdgeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      UpdateEdgeResponse
    >({
      url: '/:sourceKey/graph/edges/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete an edge from the graph.
   */
  public deleteEdge(params: IDeleteEdgeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/:sourceKey/graph/edges/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the number of edges in the graph.
   */
  public getEdgeCount(params?: IGetEdgeCountParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      GetEdgeCountResponse
    >({
      url: '/:sourceKey/graph/edges/count',
      method: 'GET',
      params: params
    });
  }
}
