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

import {
  ISearchFullItems, IUser, ISearchEdgesInDirectory, ISearchNodesInDirectory, IEdge, IFullNode,
  IQuerySearchItemList, IGetUserList, IGetDirectory
} from '../../index';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';

export class SearchModule extends Module {

  constructor ( fetcher:Fetcher ) {
    super(fetcher);
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param {ISearchItemList} params
   * @returns {Promise<Array<ISearchItemList>>}
   */
  public fullNodes ( params:IQuerySearchItemList ):Promise<Array<IFullNode>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/nodes/full',
        method: 'GET',
        query : params
      }
    );
  }

  /**
   * Search for edges based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param {ISearchItemList} params
   * @returns {Promise<Array<ISearchItemList>>}
   */
  public fullEdges ( params:IQuerySearchItemList ):Promise<Array<IEdge>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/edges/full',
        method: 'GET',
        query : params
      }
    );
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return formatted results for
   * the Linkurious client.
   *
   * @param {ISearchItemList} params
   * @returns {Promise<ISearchFullItems>}
   */
  public nodes ( params:IQuerySearchItemList ):Promise<ISearchFullItems> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/nodes',
        method: 'GET',
        query : params
      }
    );
  }

  /**
   * Search for edges based on a query string and optional parameters. Return formatted results for
   * the Linkurious client.
   *
   * @param {ISearchItemList} params
   * @returns {Promise<ISearchFullItems>}
   */
  public edges ( params:IQuerySearchItemList ):Promise<ISearchFullItems> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/edges',
        method: 'GET',
        query : params
      }
    );
  }

  /**
   * Find a list of users matching a filter (on username or email)
   *
   * @param {IGetUserList} data
   * @returns {Promise<Array<IUser>>}
   */
  public users ( data:IGetUserList ):Promise<Array<IUser>> {
    return this.fetch(
      {
        url   : '/findUsers',
        method: 'GET',
        query : data
      }
    ).then(( response:any ) => response.results);
  }

  /**
   * get a list of nodes for directory.
   *
   * @param {IGetDirectory} data
   * @returns {Promise<ISearchNodesInDirectory>}
   */
  public NodesInDirectory ( data:IGetDirectory ):Promise<ISearchNodesInDirectory> {

    let body:any = data;
    body.type = 'nodes';

    return this.fetch(
      {
        url   : '/{dataSourceKey}/directory',
        method: 'POST',
        body  : body
      }
    );
  }

  /**
   * get a list of edges for directory.
   *
   * @param {IGetDirectory} data
   * @returns {Promise<ISearchEdgesInDirectory>}
   */
  public EdgesInDirectory ( data:IGetDirectory ):Promise<ISearchEdgesInDirectory> {

    let body:any = data;
    body.type = 'edges';

    return this.fetch(
      {
        url   : '/{dataSourceKey}/directory',
        method: 'POST',
        body  : body
      }
    );
  }
}
