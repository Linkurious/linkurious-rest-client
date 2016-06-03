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

import * as Request from '../Query';
import {INode} from '../interfaces';
import Utils from '../http/utils';
import Module from './Module';
import Fetcher from '../http/fetcher';

export default class GraphModule extends Module {
  constructor(fetcher: Fetcher) {
    super(fetcher);
  }

  /**
   * Get the edit-versions for nodes and edges.
   *
   * @param nodesAndEdgesVersions : Schema.lists
   * @returns {Promise}
   */
  public getItemsVersions(data:Request.IGetItemVersions):Promise<any> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/versions',
      method: 'POST',
      body  : data,
      dataSource:{dataSourceKey:data.dataSourceKey}
    });
  }

  /**
   * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
   *
   * @param nodesConfig : Graph.request.shortestPath
   * @returns {Promise}
   */
  public getShortestPaths(nodesConfig:Request.IGetShortestPaths):Promise<Array<INode>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/shortestPaths',
      method: 'GET',
      query : nodesConfig
    });
  }

  /**
   * Returns an array of LkNode[] matching the sent query.
   *
   * @param data:RequestGraphWithQueryInterface
   * @returns {Promise}
   */
  public getNodeList(data:Request.ISendQuery):Promise<Array<INode>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/rawQuery',
      method: 'POST',
      body  : Utils.fixSnakeCase(data)
    });
  }
}
