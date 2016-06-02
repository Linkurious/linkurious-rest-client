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

import {Schema, Graph, Query, Node} from '../interfaces';
import Utils from '../http/utils';
import Module from './Module';

export default class GraphModule extends Module {
  constructor(fetcher) {
    super(fetcher);
  }

  /**
   * Get the edit-versions for nodes and edges.
   *
   * @param nodesAndEdgesVersions : Schema.lists
   * @returns {Promise}
   */
  public getItemsVersions(nodesAndEdgesVersions: Schema.lists):Promise<any> {
    return this.fetch({
      url   : '/{dataSource}/graph/versions',
      method: 'POST',
      body  : nodesAndEdgesVersions
    });
  }

  /**
   * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
   *
   * @param nodesConfig : Graph.request.shortestPath
   * @returns {Promise}
   */
  public getShortestPaths(nodesConfig: Graph.request.shortestPath):Promise<Array<Node.model>> {
    return this.fetch({
      url   : '/{dataSource}/graph/shortestPaths',
      method: 'GET',
      query : Utils.fixSnakeCase(nodesConfig)
    });
  }

  /**
   * Returns an array of LkNode[] matching the sent query.
   *
   * @param data:RequestGraphWithQueryInterface
   * @returns {Promise}
   */
  public getNodeList(data: Query.form.request):Promise<Array<Node.model>> {
    return this.fetch({
      url   : '/{dataSource}/graph/rawQuery',
      method: 'POST',
      body  : Utils.fixSnakeCase(data)
    });
  }
}
