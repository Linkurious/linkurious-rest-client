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
import {Utils} from './utils';

export default class Search {

  private fetcher:i.Fetcher;

  constructor(fetcherInst:i.Fetcher){
    this.fetcher = <i.Fetcher>fetcherInst;
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return list of node object.
   *
   * @param item:Interface.Item
   * @param params:Interface.RequestSearchItems
   * @returns {Promise<Array<Node.model>>}
   */
  public items(item:i.Item, params:i.Schema.request.itemsList):Promise<Array<i.Node.model>> {
    return this.fetcher.fetch('GET', '/{dataSource}/search/' + item + '/full', Utils.fixCase(params));
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return list of formatted nodes.
   *
   * @param item:Interface.Item
   * @param params:Interface.RequestSearchItems
   * @returns {Promise<Schema.itemsList>}
   */
  public formattedItems(item:i.Item, params:i.Schema.request.itemsList):Promise<i.Schema.itemsList> {
    return this.fetcher.fetch('GET', '/{dataSource}/search/' + item, params);
  }

  /**
   * Find a list of users matching a filter (on username or email)
   *
   * @param data : User.request.list
   * @returns {Promise<Array<User.model>>}
   */
  public users(data:i.User.request.list):Promise<Array<i.User.model>> {
    return this.fetcher.fetch('GET', '/findUsers', Utils.fixCase(data));
  }

  /**
   * get a list of items for directory.
   *
   * @param data:Interface.RequestDirectory
   * @returns {Promise<Directory.list>}
   */
  public directory(data:i.Directory.request.list):Promise<i.Directory.list> {
    return this.fetcher.fetch('POST', '/{dataSource}/directory', data);
  }
}