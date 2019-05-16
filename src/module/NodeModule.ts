/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
 *
 * File:
 * Description :
 */

import {
  IDigest,
  IEdge,
  IItemType,
  INode,
  IOgmaEdge,
  IOgmaNode,
  IProperty,
  ItemId,
  TypeAccessRight
} from '../../index';
import {ErrorListener} from '../errorListener';
import {Fetcher} from '../http/fetcher';
import {Transformer} from '../transformer';
import {Module} from './Module';
import {VisualizationParser} from './VisualizationParser';

export class NodeModule extends Module {
  constructor(fetcher: Fetcher, transformer: Transformer, errorListener: ErrorListener) {
    super(fetcher, transformer, errorListener);
  }

  /**
   * Number of nodes in the graph.
   *
   * @returns {Promise<number>}
   */
  public count(dataSourceKey?: string): Promise<number> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/nodes/count',
      method: 'GET',
      dataSource: dataSourceKey
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
      url: '/{dataSourceKey}/graph/nodes',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey
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
      url: '/{dataSourceKey}/graph/nodes/{id}',
      method: 'DELETE',
      body: data,
      dataSource: dataSourceKey
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
      url: '/{dataSourceKey}/graph/nodes/{id}',
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
      url: '/{dataSourceKey}/graph/nodes/expand',
      method: 'POST',
      body: body,
      query: query,
      dataSource: dataSourceKey
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
  ): Promise<IDigest[]> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/neighborhood/statistics',
      method: 'POST',
      body: {
        ids: data.ids
      },
      query: {
        withDigest: data.withDigest,
        withDegree: data.withDegree
      },
      dataSource: dataSourceKey
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
      url: '/{dataSourceKey}/graph/nodes/{id}',
      method: 'PATCH',
      body: data,
      dataSource: dataSourceKey
    }).then((response: INode) => VisualizationParser.parseNode(response));
  }

  /**
   * List all node-type properties (aggregated from all nodeTypes)
   *
   * @param {Object} [params]
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IProperty>>}
   */
  public getProperties(
    params?: {
      includeType?: string;
      omitNoindex?: boolean;
    },
    dataSourceKey?: string
  ): Promise<IProperty[]> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/schema/nodeTypes/properties',
      method: 'GET',
      query: params,
      dataSource: dataSourceKey
    }).then((res: any) => res.properties);
  }

  /**
   * List node-types indexed by Linkurious
   *
   * @param {Object} [params]
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IItemType>>}
   */
  public getTypes(
    params?: {
      includeType?: boolean;
    },
    dataSourceKey?: string
  ): Promise<{any: {access: TypeAccessRight}; results: IItemType[]}> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/schema/nodeTypes',
      method: 'GET',
      query: params,
      dataSource: dataSourceKey
    });
  }
}
