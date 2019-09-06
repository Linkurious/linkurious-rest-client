/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-05-30.
 */

// TODO TS2019

import {
  DataSourceUnavailable,
  Forbidden,
  IEdge,
  INode,
  InvalidParameter,
  IOgmaEdge,
  IOgmaNode,
  ItemId,
  LkNodeStatistics,
  NotFound,
  Success,
  Unauthorized
} from '../../index';
import {ErrorListener} from '../errorListener';
import {Fetcher} from '../http/fetcher';
import {
  ICreateNodeParams,
  ICreateNodeResponse,
  IUpdateNodeParams,
  IUpdateNodeResponse
} from '../models/Graph';
import {Transformer} from '../transformer';

import {Module} from './Module';
import {VisualizationParser} from './VisualizationParser';

export class NodeModule extends Module {
  constructor(fetcher: Fetcher, transformer: Transformer, errorListener: ErrorListener) {
    super(fetcher, transformer, errorListener);
  }

  // TODO TS2019 refactor above here

  public async createNode(
    options: ICreateNodeParams
  ): Promise<
    | Success<ICreateNodeResponse>
    | DataSourceUnavailable
    | Unauthorized
    | Forbidden
    | InvalidParameter
  > {
    return this.request({
      url: '/{sourceKey}/graph/nodes',
      method: 'POST',
      path: {
        sourceKey: options.sourceKey
      },
      body: options
    });
  }

  public async updateNode(
    options: IUpdateNodeParams
  ): Promise<
    | Success<IUpdateNodeResponse>
    | DataSourceUnavailable
    | Unauthorized
    | Forbidden
    | NotFound
    | InvalidParameter
  > {
    return this.request({
      url: '/{sourceKey}/graph/nodes/{id}',
      method: 'PATCH',
      path: {
        sourceKey: options.sourceKey,
        id: options.id
      },
      body: options
    });
  }

  // TODO TS2019 refactor under here

  /**
   * Number of nodes in the graph.
   *
   * @returns {Promise<number>}
   */
  public count(dataSourceKey?: string): Promise<number> {
    return this.fetch({
      url: '/{sourceKey}/graph/nodes/count',
      method: 'GET',
      path: {sourceKey: dataSourceKey}
    }).then((res: any) => res.count);
  }

  /**
   * Add a node in the graph.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<INode>}
   */
  public create(
    data: {
      properties?: any;
      categories?: string[];
    },
    dataSourceKey?: string
  ): Promise<any> {
    return this.fetch({
      url: '/{sourceKey}/graph/nodes',
      method: 'POST',
      body: data,
      path: {sourceKey: dataSourceKey}
    }).then((node: any) => VisualizationParser.parseNode(node));
  }

  /**
   * Delete the node and its adjacent edges from the graph.
   *
   * @param {Object}data
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   *
   */
  public deleteOne(
    data: {
      id: number | string;
    },
    dataSourceKey?: string
  ): Promise<any> {
    return this.fetch({
      url: '/{sourceKey}/graph/nodes/{id}',
      method: 'DELETE',
      body: data,
      path: {sourceKey: dataSourceKey}
    });
  }

  /**
   * Get a node from the graph.
   *
   * @param {Object} [params]
   * @param {string}dataSourceKey
   * @returns {Promise<INode>}
   */
  public getOne(
    params?: {
      id: string | number;
      edgesTo?: Array<string | number>;
      withDigest?: boolean;
      withDegree?: boolean;
    },
    dataSourceKey?: string
  ): Promise<{nodes: IOgmaNode[]; edges: IOgmaEdge[]}> {
    return this.fetch({
      url: '/{sourceKey}/graph/nodes/{id}',
      method: 'POST',
      body: params
    }).then((response: {nodes: INode[]; edges: IEdge[]}) => {
      return {
        nodes: response.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
        edges: response.edges.map((e: IEdge) => VisualizationParser.parseEdge(e))
      };
    });
  }

  /**
   * Get all adjacent nodes and edges for one or many source nodes (ids). The result is an array of
   * nodes containing the sources nodes (ids) and their neighbors. Edges between sources nodes and
   * neighbors - as well as edges between neighbors themselves - are returned in each node's edges
   * field. If visible_nodes was specified, edges between source nodes or their neighbors and
   * visible nodes are also included.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<INode>>}
   */
  public expand(
    data: {
      ids: ItemId[];
      edgesTo?: ItemId[];
      nodeCategories?: string[];
      edgeTypes?: string[];
      limit?: number;
      limitType?: string;
      withDigest?: boolean;
      withDegree?: boolean;
    },
    dataSourceKey?: string
  ): Promise<{nodes: IOgmaNode[]; edges: IOgmaEdge[]}> {
    const body: any = {
      ids: data.ids,
      edgesTo: data.edgesTo,
      nodeCategories: data.nodeCategories,
      edgeTypes: data.edgeTypes,
      limit: data.limit,
      limitType: data.limitType
    };
    const query: any = {
      withDigest: data.withDigest,
      withDegree: data.withDegree
    };
    return this.fetch({
      url: '/{sourceKey}/graph/nodes/expand',
      method: 'POST',
      body: body,
      query: query,
      path: {sourceKey: dataSourceKey}
    }).then((result: {nodes: INode[]; edges: IEdge[]}) => {
      return {
        nodes: result.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
        edges: result.edges.map((e: IEdge) => VisualizationParser.parseEdge(e))
      };
    });
  }

  /**
   * Get node-categories and edge-types of neighbors
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IDigest>>}
   */
  public getNeighborsCategories(
    data: {
      ids: ItemId[];
      withDigest?: boolean;
      withDegree?: boolean;
    },
    dataSourceKey?: string
  ): Promise<LkNodeStatistics> {
    return this.fetch({
      url: '/{sourceKey}/graph/neighborhood/statistics',
      method: 'POST',
      body: {
        ids: data.ids
      },
      query: {
        withDigest: data.withDigest,
        withDegree: data.withDegree
      },
      path: {sourceKey: dataSourceKey}
    });
  }

  /**
   * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<INode>}
   */
  public update(
    data: {
      id: string | number;
      properties?: any;
      deletedProperties?: string[];
      addedCategories?: string[];
      deletedCategories?: string[];
      readAt: string;
    },
    dataSourceKey?: string
  ): Promise<IOgmaNode> {
    return this.fetch({
      url: '/{sourceKey}/graph/nodes/{id}',
      method: 'PATCH',
      body: data,
      path: {sourceKey: dataSourceKey}
    }).then((response: INode) => VisualizationParser.parseNode(response));
  }
}
