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

export default class Search {

  private fetcher;

  constructor(fetcherInst) {
    this.fetcher = fetcherInst;
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<Array<Node.model>>}
   */
  public fullNodes(params:i.Schema.request.itemsList):Promise<Array<i.Node.model>> {
    let fetchConfig = {
      url   : '/{dataSource}/search/nodes/full',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Search for edges based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<Array<Node.model>>}
   */
  public fullEdges(params:i.Schema.request.itemsList):Promise<Array<i.Node.model>> {
    let fetchConfig = {
      url   : '/{dataSource}/search/edges/full',
      method: 'GET',
      query : Utils.fixSnakeCase(params)
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return formatted results for the Linkurious client.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<itemsList>}
   */
  public nodes(params:i.Schema.request.itemsList):Promise<i.Schema.itemsList> {
    let fetchConfig = {
      url   : '/{dataSource}/search/nodes',
      method: 'GET',
      query : params
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Search for edges based on a query string and optional parameters. Return formatted results for the Linkurious client.
   *
   * @param params:i.Schema.request.itemsList
   * @returns {Promise<itemsList>}
   */
  public edges(params:i.Schema.request.itemsList):Promise<i.Schema.itemsList> {
    let fetchConfig = {
      url   : '/{dataSource}/search/edges',
      method: 'GET',
      query : params
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Find a list of users matching a filter (on username or email)
   *
   * @param data : User.request.list
   * @returns {Promise<Array<User.model>>}
   */
  public users(data:i.User.request.list):Promise<Array<i.User.model>> {
    let fetchConfig = {
      url   : '/findUsers',
      method: 'GET',
      query : Utils.fixSnakeCase(data)
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * get a list of items for directory.
   *
   * @param data:Interface.RequestDirectory
   * @returns {Promise<Directory.list>}
   */
  public directory(data:i.Directory.request.list):Promise<i.Directory.list> {
    let fetchConfig = {
      url   : '/{dataSource}/directory',
      method: 'POST',
      body  : data
    };
    
    return this.fetcher.fetch(fetchConfig);
  }
}