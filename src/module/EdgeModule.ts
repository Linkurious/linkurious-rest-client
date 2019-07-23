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
  NotFound,
  Success,
  Unauthorized
} from '../../index';
import {ErrorListener} from '../errorListener';
import {Fetcher} from '../http/fetcher';
import {
  ICreateEdgeParams,
  ICreateEdgeResponse,
  IUpdateEdgeParams,
  IUpdateEdgeResponse
} from '../models/Graph';
import {Transformer} from '../transformer';
import {Module} from './Module';
import {VisualizationParser} from './VisualizationParser';

export class EdgeModule extends Module {
  constructor(fetcher: Fetcher, transformer: Transformer, errorListener: ErrorListener) {
    super(fetcher, transformer, errorListener);
  }

  // TODO TS2019 refactor above here

  public async createEdge(
    options: ICreateEdgeParams
  ): Promise<
    | Success<ICreateEdgeResponse>
    | DataSourceUnavailable
    | Unauthorized
    | Forbidden
    | InvalidParameter
  > {
    return this.request({
      url: '/{sourceKey}/graph/edges',
      method: 'POST',
      path: {
        sourceKey: options.sourceKey
      },
      body: options
    });
  }

  public async updateEdge(
    options: IUpdateEdgeParams
  ): Promise<
    | Success<IUpdateEdgeResponse>
    | DataSourceUnavailable
    | Unauthorized
    | Forbidden
    | NotFound
    | InvalidParameter
  > {
    return this.request({
      url: '/{sourceKey}/graph/edges/{id}',
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
   * return the number of edges in the graph.
   *
   * @param {string}dataSourceKey
   * @returns {Promise<number>}
   */
  public count(dataSourceKey?: string): Promise<number> {
    return this.fetch({
      url: '/{sourceKey}/graph/edges/count',
      method: 'GET',
      path: {sourceKey: dataSourceKey}
    }).then((res: any) => res.count);
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
  ): Promise<IOgmaEdge> {
    return this.fetch({
      url: '/{sourceKey}/graph/edges',
      method: 'POST',
      body: data,
      path: {sourceKey: dataSourceKey}
    }).then((edge: IEdge) => VisualizationParser.parseEdge(edge));
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
      deletedProperties?: string[];
      readAt: number;
    },
    dataSourceKey?: string
  ): Promise<IOgmaEdge> {
    return this.fetch({
      url: '/{sourceKey}/graph/edges/{id}',
      method: 'PATCH',
      body: data,
      path: {sourceKey: dataSourceKey}
    }).then((edge: IEdge) => VisualizationParser.parseEdge(edge));
  }

  /**
   * Delete an edge from the graph.
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
  ): Promise<any> {
    return this.fetch({
      url: '/{sourceKey}/graph/edges/{id}',
      method: 'DELETE',
      body: data,
      path: {sourceKey: dataSourceKey}
    });
  }

  /**
   * Get an edge of the graph.
   */
  public getOne(
    data: {
      id: ItemId;
      edgesTo?: Array<string | number>;
      withDigest?: boolean;
      withDegree?: boolean;
    },
    dataSourceKey?: string
  ): Promise<{nodes: IOgmaNode[]; edges: IOgmaEdge[]}> {
    return this.fetch({
      url: '/{sourceKey}/graph/edges/{id}',
      method: 'POST',
      body: data,
      path: {sourceKey: dataSourceKey}
    }).then((response: any) => {
      return {
        nodes: response.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
        edges: response.edges.map((e: IEdge) => VisualizationParser.parseEdge(e))
      };
    });
  }
}
