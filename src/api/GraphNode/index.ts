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
  BulkCreateNodesParams,
  ICreateNodeParams,
  IDeleteNodeParams,
  IGetAdjacentNodesParams,
  IGetNodeParams,
  IGetStatisticsParams,
  IUpdateNodeParams
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  NOT_FOUND,
  EDIT_CONFLICT,
  NOT_SUPPORTED,
  INVALID_PARAMETER,
  CONSTRAINT_VIOLATION
} = LkErrorKey;

export class GraphNodeAPI extends Request {
  /**
   * Get a node of the graph.
   * A subgraph made of the single node is returned.
   */
  public getNode(this: Request<LkSubGraph>, params: IGetNodeParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND],
      url: '/:sourceKey/graph/nodes/:id',
      method: 'POST',
      params: params
    });
  }

  /**
   * Add a node to the graph.
   */
  public createNode(this: Request<LkNode>, params: ICreateNodeParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        INVALID_PARAMETER,
        CONSTRAINT_VIOLATION
      ],
      url: '/:sourceKey/graph/nodes',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update a subset of properties and categories of a node.
   * Keep every other property and category of the node unchanged.
   */
  public updateNode(this: Request<LkNode>, params: IUpdateNodeParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        EDIT_CONFLICT,
        NOT_SUPPORTED,
        INVALID_PARAMETER,
        CONSTRAINT_VIOLATION
      ],
      url: '/:sourceKey/graph/nodes/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete a node and its adjacent edges from the graph.
   */
  public deleteNode(params: IDeleteNodeParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/graph/nodes/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Add a chunk of nodes to the graph. Optionally accepts an import ID parameter. If it is
   * provided, the nodes are linked to this import (via a hidden property). Otherwise, the
   * nodes are created without any link.
   */
  public bulkCreateNodes(params: BulkCreateNodesParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        INVALID_PARAMETER,
        CONSTRAINT_VIOLATION
      ],
      url: '/:sourceKey/graph/nodes/bulk',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get the number of nodes in the graph.
   */
  public getNodeCount(this: Request<number>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED],
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
  public getStatistics(this: Request<LkNodeStatistics>, params: IGetStatisticsParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND],
      url: '/:sourceKey/graph/neighborhood/statistics',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the adjacent nodes and edges to one or more source nodes.
   * A subgraph made of the items that matched the expand query and the edges between them is returned.
   */
  public getAdjacentNodes(this: Request<LkSubGraph>, params: IGetAdjacentNodesParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND],
      url: '/:sourceKey/graph/nodes/expand',
      method: 'POST',
      params: params
    });
  }
}
