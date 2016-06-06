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

import * as Query from '../Query';
import {INode} from '../interfaces';
import Utils from '../http/utils';
import Module from './Module';
import Fetcher from '../http/fetcher';

export default class GraphModule extends Module {
  constructor(fetcher:Fetcher) {
    super(fetcher);
  }

  /**
   * Get the edit-versions for nodes and edges.
   *
   * @param {IGetItemVersions} data
   * @returns {Promise}
   */
  public getItemsVersions(data:Query.IGetItemVersions):Promise<any> {
    return this.fetch({
      url       : '/{dataSourceKey}/graph/versions',
      method    : 'POST',
      body      : data,
      dataSource: {dataSourceKey: data.dataSourceKey}
    });
  }

  /**
   * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
   *
   * @param {IGetShortestPaths} nodesConfig
   * @returns {Promise<Array<INode>>}
   */
  public getShortestPaths(nodesConfig:Query.IGetShortestPaths):Promise<Array<INode>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/shortestPaths',
      method: 'GET',
      query : nodesConfig
    });
  }

  /**
   * Returns an array of LkNode[] matching the sent query.
   *
   * @param {ISendQuery} data
   * @returns {Promise<Array<INode>>}
   */
  public getNodeList(data:Query.ISendQuery):Promise<Array<INode>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/rawQuery',
      method: 'POST',
      body  : Utils.fixSnakeCase(data)
    });
  }
}
