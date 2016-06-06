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
import {
  ISearchItemList,
  ISearchFullItems,
  IUser,
  ISearchEdgesInDirectory,
  ISearchNodesInDirectory
} from '../interfaces';
import Module from './Module';
import Fetcher from '../http/fetcher';

export default class SearchModule extends Module {

  constructor(fetcher:Fetcher) {
    super(fetcher);
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<Array<Node.model>>}
   */
  public fullNodes(params:Query.ISearchItemList):Promise<Array<ISearchItemList>> {
    return this.fetch({
      url   : '/{dataSourceKey}/search/nodes/full',
      method: 'GET',
      query : params
    });
  }

  /**
   * Search for edges based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<Array<Node.model>>}
   */
  public fullEdges(params:Query.ISearchItemList):Promise<Array<ISearchItemList>> {
    return this.fetch({
      url   : '/{dataSourceKey}/search/edges/full',
      method: 'GET',
      query : params
    });
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return formatted results for the Linkurious client.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<itemsList>}
   */
  public nodes(params:Query.ISearchItemList):Promise<ISearchFullItems> {
    return this.fetch({
      url   : '/{dataSourceKey}/search/nodes',
      method: 'GET',
      query : params
    });
  }

  /**
   * Search for edges based on a query string and optional parameters. Return formatted results for the Linkurious client.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<itemsList>}
   */
  public edges(params:Query.ISearchItemList):Promise<ISearchFullItems> {
    return this.fetch({
      url   : '/{dataSourceKey}/search/edges',
      method: 'GET',
      query : params
    });
  }

  /**
   * Find a list of users matching a filter (on username or email)
   *
   * @param data : User.request.list
   * @returns {Promise<Array<User.model>>}
   */
  public users(data:Query.IGetUserList):Promise<Array<IUser>> {
    return this.fetch({
      url   : '/findUsers',
      method: 'GET',
      query : data
    });
  }

  /**
   * get a list of nodes for directory.
   *
   * @param data:Interface.RequestDirectory
   * @returns {Promise<Directory.list>}
   */
  public NodesInDirectory(data:Query.IGetDirectory):Promise<ISearchNodesInDirectory> {

    let body:any = data;
    body['type'] = 'nodes';

    return this.fetch({
      url   : '/{dataSourceKey}/directory',
      method: 'POST',
      body  : body
    });
  }

  /**
   * get a list of edges for directory.
   *
   * @param data:Interface.RequestDirectory
   * @returns {Promise<Directory.list>}
   */
  public EdgesInDirectory(data:Query.IGetDirectory):Promise<ISearchEdgesInDirectory> {

    let body:any = data;
    body['type'] = 'edges';

    return this.fetch({
      url   : '/{dataSourceKey}/directory',
      method: 'POST',
      body  : body
    });
  }
}
