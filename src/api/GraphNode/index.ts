/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {LkNode, LkNodeStatistics, LkSubGraph} from '../graphItemTypes';
import {IDataSourceParams} from '../commonTypes';

import {
  ICreateNodeParams,
  IDeleteNodeParams,
  IGetNodeParams,
  IUpdateNodeParams,
  IGetAdjacentNodesParams,
  IGetStatisticsParams
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
      LkSubGraph
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
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<LkNode>({
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
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<LkNode>(
      {
        url: '/:sourceKey/graph/nodes/:id',
        method: 'PATCH',
        params: params
      }
    );
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
  public getNodeCount(params?: IDataSourceParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<number>({
      url: '/:sourceKey/graph/nodes/count',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the digest (the number of adjacent nodes and edges grouped by node categories and edge types)
   * and/or the degree of a given subset of nodes.
   * You can't get aggregated statistics of a subset of nodes containing one or more supernodes.
   * To get the statistics of a supernode invoke the API with only its node ID.
   */
  public getStatistics(params: IGetStatisticsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND).request<
      LkNodeStatistics
    >({
      url: '/:sourceKey/graph/neighborhood/statistics',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the adjacent nodes and edges to one or more source nodes.
   * A subgraph made of the items that matched the expand query and the edges between them is returned.
   */
  public getAdjacentNodes(params: IGetAdjacentNodesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND).request<
      LkSubGraph
    >({
      url: '/:sourceKey/graph/nodes/expand',
      method: 'POST',
      params: params
    });
  }
}
