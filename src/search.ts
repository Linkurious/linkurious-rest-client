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
import Utils from './Utils';
import Module from "./Module";

export default class Search extends Module {

  constructor(fetcher) {
    super(fetcher);
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<Array<Node.model>>}
   */
  public fullNodes(params:i.Schema.request.itemsList):Promise<Array<i.Node.model>> {
    return this.fetch({
      url   : '/{dataSource}/search/nodes/full',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    });
  }

  /**
   * Search for edges based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<Array<Node.model>>}
   */
  public fullEdges(params:i.Schema.request.itemsList):Promise<Array<i.Node.model>> {
    return this.fetch({
      url   : '/{dataSource}/search/edges/full',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    });
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return formatted results for the Linkurious client.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<itemsList>}
   */
  public nodes(params:i.Schema.request.itemsList):Promise<i.Schema.itemsList> {
    return this.fetch({
      url   : '/{dataSource}/search/nodes',
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
  public edges(params:i.Schema.request.itemsList):Promise<i.Schema.itemsList> {
    return this.fetch({
      url   : '/{dataSource}/search/edges',
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
  public users(data:i.User.request.list):Promise<Array<i.User.model>> {
    return this.fetch({
      url   : '/findUsers',
      method: 'GET',
      query : Utils.fixSnakeCase(data)
    });
  }

  /**
   * get a list of items for directory.
   *
   * @param data:Interface.RequestDirectory
   * @returns {Promise<Directory.list>}
   */
  public directory(data:i.Directory.request.list):Promise<i.Directory.list> {
    return this.fetch({
      url   : '/{dataSource}/directory',
      method: 'POST',
      body  : data
    });
  }
}