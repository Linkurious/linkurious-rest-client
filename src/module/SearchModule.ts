/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
 *
 * File:
 * Description :
 */

import {IEdge, IFullNode, INode, IOgmaEdge, IOgmaNode} from '../../index';
import {ErrorListener} from '../errorListener';
import {Fetcher} from '../http/fetcher';
import {Transformer} from '../transformer';
import {Module} from './Module';
import {VisualizationParser} from './VisualizationParser';

export class SearchModule extends Module {
  constructor(fetcher: Fetcher, transformer: Transformer, errorListener: ErrorListener) {
    super(fetcher, transformer, errorListener);
  }

  /**
   * Search for items without any filters
   *
   * @param {any} data
   * @param {string} dataSourceKey
   * @returns Promise<{any}>}
   */
  public simple(
    data: {
      type: 'nodes' | 'edges';
      q: string;
      fuzziness?: number;
      size?: number;
      from?: number;
    },
    dataSourceKey?: string
  ): Promise<{
    type: string;
    totalHits?: number;
    moreResults?: boolean;
    results: Array<IOgmaNode | IOgmaEdge>;
  }> {
    const dataToSend: {q: string; fuzziness?: number; size?: number; from?: number} = {
      q: data.q,
      fuzziness: data.fuzziness,
      size: data.size,
      from: data.from
    };
    return this.fetch({
      url: '/{dataSourceKey}/search/' + data.type,
      method: 'GET',
      query: dataToSend,
      dataSource: dataSourceKey
    }).then((response: any) => {
      return {
        type: response.type,
        totalHits: response.totalHits,
        moreResults: response.moreResults,
        results:
          response.results.length > 0 &&
          response.results[0].target !== undefined &&
          response.results[0].source !== undefined
            ? response.results.map((e: IEdge) => VisualizationParser.parseEdge(e))
            : response.results.map((n: INode) => VisualizationParser.parseNode(n))
      };
    });
  }

  /**
   * Search for items with filters
   *
   * @param {any} data
   * @param {string} dataSourceKey
   * @returns {Promise<any>}
   */
  public advanced(
    data: {
      type: 'nodes' | 'edges';
      q: string;
      fuzziness?: number;
      size?: number;
      from?: number;
      filter?: Array<[string, string]>;
      categoriesOrTypes?: string[];
    },
    dataSourceKey?: string
  ): Promise<{
    type: string;
    totalHits?: number;
    moreResults?: boolean;
    results: Array<IOgmaNode | IOgmaEdge>;
  }> {
    const dataToSend: {
      q: string;
      fuzziness?: number;
      size?: number;
      from?: number;
      filter?: Array<[string, string]>;
      categoriesOrTypes?: string[];
    } = {
      q: data.q,
      fuzziness: data.fuzziness,
      size: data.size,
      from: data.from,
      filter: data.filter,
      categoriesOrTypes: data.categoriesOrTypes
    };
    return this.fetch({
      url: '/{dataSourceKey}/search/' + data.type,
      method: 'POST',
      body: dataToSend,
      dataSource: dataSourceKey
    }).then((response: any) => {
      return {
        type: response.type,
        totalHits: response.totalHits,
        moreResults: response.moreResults,
        results:
          response.results.length > 0 &&
          response.results[0].target !== undefined &&
          response.results[0].source !== undefined
            ? response.results.map((e: IEdge) => VisualizationParser.parseEdge(e))
            : response.results.map((n: INode) => VisualizationParser.parseNode(n))
      };
    });
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<ISearchItemList>>}
   */
  public full(
    data: {
      type: 'nodes' | 'edges';
      q: string;
      fuzziness?: number;
      size?: number;
      from?: number;
      filter?: Array<[string, string]>;
      categoriesOrTypes?: string[];
      edgesTo?: string[];
      withDigest?: boolean;
      withDegree?: boolean;
      withAccess?: boolean;
    },
    dataSourceKey?: string
  ): Promise<{nodes: IOgmaNode[]; edges: IOgmaEdge[]}> {
    const dataToSend: {
      q: string;
      fuzziness?: number;
      size?: number;
      from?: number;
      filter?: Array<[string, string]>;
      categoriesOrTypes?: string[];
      edgesTo?: string[];
      withAccess?: boolean;
      withDegree?: boolean;
      withDigest?: boolean;
    } = {
      q: data.q,
      fuzziness: data.fuzziness,
      size: data.size,
      from: data.from,
      filter: data.filter,
      categoriesOrTypes: data.categoriesOrTypes,
      edgesTo: data.edgesTo,
      withAccess: data.withAccess,
      withDegree: data.withDegree,
      withDigest: data.withDigest
    };
    return this.fetch({
      url: '/{dataSourceKey}/search/' + data.type + '/full',
      method: 'POST',
      body: dataToSend,
      dataSource: dataSourceKey
    }).then((response: {nodes: INode[]; edges: IEdge[]}) => {
      return {
        nodes: response.nodes.map((n: INode) => VisualizationParser.parseNode(n)),
        edges: response.edges.map((e: IEdge) => VisualizationParser.parseEdge(e))
      };
    });
  }

  /**
   * Search for edges based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<ISearchItemList>>}
   */
  public fullEdges(
    data: {
      q: string;
      fuzziness?: number;
      size?: number;
      from?: number;
      edges_to?: string[];
      with_digest?: boolean;
      with_degree?: boolean;
      with_access?: boolean;
    },
    dataSourceKey?: string
  ): Promise<{nodes: IOgmaNode[]; edges: IOgmaEdge[]}> {
    return this.fetch({
      url: '/{dataSourceKey}/search/edges/full',
      method: 'POST',
      query: data,
      dataSource: dataSourceKey
    }).then((response: IFullNode[]) => {
      return VisualizationParser.splitResponse(response);
    });
  }

  /**
   * get the list of users
   *
   * @param {Object}data
   * @return {Promise<any>}
   */
  public getUsers(data: {
    startsWith?: string;
    contains?: string;
    groupId?: number;
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<any> {
    return this.fetch({
      url: '/users',
      method: 'GET',
      query: data
    });
  }
}
