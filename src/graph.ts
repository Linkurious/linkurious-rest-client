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

import * as i from './interfaces';
import {Utils} from './Utils';

export default class Graph {

  private fetcher;

  constructor(fetcherInst) {
    this.fetcher = fetcherInst;
  }

  /**
   * Get the edit-versions for nodes and edges.
   *
   * @param nodesAndEdgesVersions : Schema.lists
   * @returns {Promise}
   */
  public getItemsVersions(nodesAndEdgesVersions:i.Schema.lists):Promise<any> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/versions',
      method: 'POST',
      body  : nodesAndEdgesVersions
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
   *
   * @param nodesConfig : Graph.request.shortestPath
   * @returns {Promise}
   */
  public getShortestPaths(nodesConfig:i.Graph.request.shortestPath):Promise<Array<i.Node.model>> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/shortestPaths',
      method: 'GET',
      query : Utils.fixSnakeCase(nodesConfig)
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Returns an array of LkNode[] matching the sent query.
   *
   * @param data:RequestGraphWithQueryInterface
   * @returns {Promise}
   */
  public getNodeList(data:i.Query.form.request):Promise<Array<i.Node.model>> {
    let fetchConfig = {
      url   : '/{dataSource}/graph/rawQuery',
      method: 'POST',
      body  : Utils.fixSnakeCase(data)
    };

    return this.fetcher.fetch(fetchConfig);
  }
}