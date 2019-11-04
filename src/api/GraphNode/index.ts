/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CreateNodeResponse,
  GetNodeCountResponse,
  GetNodeResponse,
  ICreateNodeParams,
  IDeleteNodeParams,
  IGetNodeCountParams,
  IGetNodeParams,
  IUpdateNodeParams,
  UpdateNodeResponse
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class GraphNodeAPI extends Request {
  /**
   * Get a node of the graph.
   * A subgraph made of the single node is returned.
   */
  public getNode(params: IGetNodeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND).request<
      GetNodeResponse
    >({
      url: '/:sourceKey/graph/nodes/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Add a node to the graph.
   */
  public createNode(params: ICreateNodeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      CreateNodeResponse
    >({
      url: '/:sourceKey/graph/nodes',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a subset of properties and categories of a node.
   * Keep every other property and category of the node unchanged.
   */
  public updateNode(params: IUpdateNodeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      UpdateNodeResponse
    >({
      url: '/:sourceKey/graph/nodes/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a node and its adjacent edges from the graph.
   */
  public deleteNode(params: IDeleteNodeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/:sourceKey/graph/nodes/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the number of nodes in the graph.
   */
  public getNodeCount(params?: IGetNodeCountParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      GetNodeCountResponse
    >({
      url: '/:sourceKey/graph/nodes/count',
      method: 'GET',
      params: params
    });
  }
}
