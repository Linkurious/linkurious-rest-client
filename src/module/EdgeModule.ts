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
import { IEdge, ItemId, IOgmaEdge, IOgmaNode, INode } from '../../index';
import { Fetcher } from '../http/fetcher';
import { VisualizationParser } from './VisualizationParser';
import { Transformer } from '../transformer';
import { ErrorListener } from '../errorListener';

class Mock {
  static wrap(type: string, value?: unknown, status?: string) {
    return {
      type: type,
      status: status,
      value: value,
    };
  }

  static date(value: unknown) {
    if (typeof value === 'number') {
      return Mock.wrap('date', value);
    }

    return Mock.wrap('auto', value, 'conflict');
  }

  static datetime(value: unknown) {
    if (typeof value === 'number') {
      return Mock.wrap('datetime', value);
    }

    return Mock.wrap('auto', value, 'conflict');
  }

  static missing(type: string) {
    return Mock.wrap(type, undefined, 'missing');
  }

  static mockProperties<T extends { data: T }>(item: T): T {
    if (typeof item.data === 'object') {
      const data = item.data || {};
      for (let key of Object.keys(data)) {
        switch (key) {
          case 'date':
            // @ts-ignore
            data[key] = Mock.date(data[key]);
        }
      }
    }
    return item;
  }
}

export class EdgeModule extends Module {
  constructor(fetcher: Fetcher, transformer: Transformer, errorListener: ErrorListener) {
    super(fetcher, transformer, errorListener);
  }

  /**
   * return the number of edges in the graph.
   *
   * @param {string}dataSourceKey
   * @returns {Promise<number>}
   */
  public count(dataSourceKey?: string): Promise<number> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/edges/count',
      method: 'GET',
      dataSource: dataSourceKey,
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
      url: '/{dataSourceKey}/graph/edges',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
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
      deletedProperties?: Array<string>;
      readAt: string;
    },
    dataSourceKey?: string
  ): Promise<IOgmaEdge> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/edges/{id}',
      method: 'PATCH',
      body: data,
      dataSource: dataSourceKey,
    }).then((edge: IEdge) => VisualizationParser.parseEdge(edge));
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
  ): Promise<any> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/edges/{id}',
      method: 'DELETE',
      body: data,
      dataSource: dataSourceKey,
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
  ): Promise<{ nodes: Array<IOgmaNode>; edges: Array<IOgmaEdge> }> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/edges/{id}',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    }).then((response: any) => {
      return {
        nodes: response.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
        edges: response.edges.map((e: IEdge) => VisualizationParser.parseEdge(e)),
      };
    });
  }
}
