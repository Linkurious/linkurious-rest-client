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

import { Module } from './Module';
import { IEdge, ItemId, IProperty, IItemType, IOgmaEdge, TypeAccessRight, IOgmaNode, INode } from '../../index';
import { Fetcher } from '../http/fetcher';
import { VisualizationParser } from './VisualizationParser';
import { Success } from '../response/success';
import { Rejection } from '../response/errors';

export class EdgeModule extends Module {
  constructor(fetcher: Fetcher) {
    super(fetcher);
  }

  /**
   * return the number of edges in the graph.
   *
   * @param {string}dataSourceKey
   * @returns {Promise<number>}
   */
  public count(dataSourceKey?: string): Promise<Success<number> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/edges/count',
      method: 'GET',
      dataSource: dataSourceKey,
    })
      .then((response: { count: number }) => new Success(response.count))
      .catch((error) => new Rejection(error));
  }

  /**
   * Add an edge in the graph.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IEdge>}
   */
  public create(
    data: {
      source: string | number;
      target: string | number;
      type: string;
      properties: any;
    },
    dataSourceKey?: string
  ): Promise<Success<IOgmaEdge> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/edges',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: IEdge) => new Success(VisualizationParser.parseEdge(response)))
      .catch((error) => new Rejection(error));
  }

  /**
   * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
   * the edge unchanged.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IEdge>}
   */
  public update(
    data: {
      id: string | number;
      type?: string;
      properties?: any;
      deletedProperties?: Array<string>;
      readAt: string;
    },
    dataSourceKey?: string
  ): Promise<Success<IOgmaEdge> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/edges/{id}',
      method: 'PATCH',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: IEdge) => new Success(VisualizationParser.parseEdge(response)))
      .catch((error) => new Rejection(error));
  }

  /**
   * Delete a edge from the graph.
   *
   * @param {Object} data,
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public deleteOne(
    data: {
      id: string | number;
    },
    dataSourceKey?: string
  ): Promise<Success<void> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/edges/{id}',
      method: 'DELETE',
      body: data,
      dataSource: dataSourceKey,
    })
      .then(() => new Success<void>())
      .catch((error) => new Rejection(error));
  }

  /**
   * Get an edge of the graph.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IEdge>}
   */
  public getOne(
    data: {
      id: ItemId;
      edgesTo?: Array<string | number>;
      withDigest?: boolean;
      withDegree?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<{ nodes: Array<IOgmaNode>; edges: Array<IOgmaEdge> }> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/edges/{id}',
      method: 'POST',
      body: data,
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
   * List all edgeType properties (aggregated from all edgeTypes)
   *
   * @param {Object} [data]
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IProperty>>}
   */
  public getProperties(
    data?: {
      includeType?: string;
      omitNoindex?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<Array<IProperty>> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/schema/edgeTypes/properties',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: { properties: Array<IProperty> }) => new Success(response.properties))
      .catch((error) => new Rejection(error));
  }

  /**
   * List edge-types indexed by linkurious
   *
   * @param {Object} [data]
   * @param {string}dataSourceKey
   * @returns {Promise<Array<IItemType>>}
   */
  public getTypes(
    data?: {
      includeType?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<{ any: { access: TypeAccessRight }; results: Array<IItemType> }> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/schema/edgeTypes',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: { any: { access: TypeAccessRight }; results: Array<IItemType> }) => new Success(response))
      .catch((error) => new Rejection(error));
  }
}
