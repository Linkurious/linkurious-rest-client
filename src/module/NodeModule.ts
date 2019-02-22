/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
 *
 * File:
 * Description :
 */

'use strict';

import {
  ItemId,
  IDigest,
  IProperty,
  IItemType,
  IOgmaNode,
  IOgmaEdge,
  TypeAccessRight,
  INode,
  IEdge,
} from '../../index';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
import { VisualizationParser } from './VisualizationParser';
import { Success } from '../response/success';
import { Rejection } from '../response/errors';

export class NodeModule extends Module {
  constructor(fetcher: Fetcher) {
    super(fetcher);
  }

  /**
   * Number of nodes in the graph.
   *
   * @returns {Promise<number>}
   */
  public count(dataSourceKey?: string): Promise<Success<number> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/nodes/count',
      method: 'GET',
      dataSource: dataSourceKey,
    })
      .then((response: { count: number }) => new Success(response.count))
      .catch((error) => new Rejection(error));
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
      categories?: Array<string>;
    },
    dataSourceKey?: string
  ): Promise<Success<IOgmaNode> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/nodes',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: INode) => new Success(VisualizationParser.parseNode(response)))
      .catch((error) => new Rejection(error));
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
  ): Promise<Success<void> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/nodes/{id}',
      method: 'DELETE',
      body: data,
      dataSource: dataSourceKey,
    })
      .then(() => new Success(undefined))
      .catch((error) => new Rejection(error));
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
  ): Promise<Success<{ nodes: Array<IOgmaNode>; edges: Array<IOgmaEdge> }> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/nodes/{id}',
      method: 'POST',
      body: params,
    })
      .then(
        (response: { nodes: Array<INode>; edges: Array<IEdge> }) =>
          new Success({
            nodes: response.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
            edges: response.edges.map((e: IEdge) => VisualizationParser.parseEdge(e)),
          })
      )
      .catch((error) => new Rejection(error));
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
      ids: Array<ItemId>;
      edgesTo?: Array<ItemId>;
      nodeCategories?: Array<string>;
      edgeTypes?: Array<string>;
      limit?: number;
      limitType?: string;
      withDigest?: boolean;
      withDegree?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<{ nodes: Array<IOgmaNode>; edges: Array<IOgmaEdge> }> | Rejection> {
    let body: any = {
      ids: data.ids,
      edgesTo: data.edgesTo,
      nodeCategories: data.nodeCategories,
      edgeTypes: data.edgeTypes,
      limit: data.limit,
      limitType: data.limitType,
    };
    let query: any = {
      withDigest: data.withDigest,
      withDegree: data.withDegree,
    };
    return this.fetch({
      url: '/{dataSourceKey}/graph/nodes/expand',
      method: 'POST',
      body: body,
      query: query,
      dataSource: dataSourceKey,
    })
      .then(
        (response: { nodes: Array<INode>; edges: Array<IEdge> }) =>
          new Success({
            nodes: response.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
            edges: response.edges.map((e: IEdge) => VisualizationParser.parseEdge(e)),
          })
      )
      .catch((error) => new Rejection(error));
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
      ids: Array<ItemId>;
      withDigest?: boolean;
      withDegree?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<{ digest: Array<IDigest>; degree: number }> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/neighborhood/statistics',
      method: 'POST',
      body: {
        ids: data.ids,
      },
      query: {
        withDigest: data.withDigest,
        withDegree: data.withDegree,
      },
      dataSource: dataSourceKey,
    })
      .then((response: { digest: Array<IDigest>; degree: number }) => new Success(response))
      .catch((error) => new Rejection(error));
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
      deletedProperties?: Array<string>;
      addedCategories?: Array<string>;
      deletedCategories?: Array<string>;
      readAt: string;
    },
    dataSourceKey?: string
  ): Promise<Success<IOgmaNode> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/nodes/{id}',
      method: 'PATCH',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: INode) => new Success(VisualizationParser.parseNode(response)))
      .catch((error) => new Rejection(error));
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
  ): Promise<Success<Array<IProperty>> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/schema/nodeTypes/properties',
      method: 'GET',
      query: params,
      dataSource: dataSourceKey,
    })
      .then((response: { properties: Array<IProperty> }) => new Success(response.properties))
      .catch((error) => new Rejection(error));
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
  ): Promise<Success<{ any: { access: TypeAccessRight }; results: Array<IItemType> }> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/schema/nodeTypes',
      method: 'GET',
      query: params,
      dataSource: dataSourceKey,
    })
      .then((response: { any: { access: TypeAccessRight }; results: Array<IItemType> }) => new Success(response))
      .catch((error) => new Rejection(error));
  }
}
