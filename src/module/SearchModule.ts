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
  ISearchFullItems, IEdge, IFullNode } from '../../index';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';

export class SearchModule extends Module {

  constructor ( fetcher:Fetcher ) {
    super(fetcher);
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<ISearchItemList>>}
   */
  public fullNodes (
    data:{
      q:string;
      strictEdges?:boolean;
      fuzziness?:number;
      size?:number;
      from?:number;
      filter?:string;
      full?:boolean;
      withDigest?:boolean;
      withDegree?:boolean;
    },
    dataSourceKey?:string
  ):Promise<Array<IFullNode>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/nodes/full',
        method: 'GET',
        query : data,
        dataSource : dataSourceKey
      }
    );
  }

  /**
   * Search for edges based on a query string and optional parameters. Return a list of full Nodes.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<Array<ISearchItemList>>}
   */
  public fullEdges (
    data:{
      q:string;
      strictEdges?:boolean;
      fuzziness?:number;
      size?:number;
      from?:number;
      filter?:string;
      full?:boolean;
      withDigest?:true;
    },
    dataSourceKey?:string
  ):Promise<Array<IEdge>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/edges/full',
        method: 'GET',
        query : data,
        dataSource: dataSourceKey
      }
    );
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return formatted results for
   * the Linkurious client.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<ISearchFullItems>}
   */
  public nodes (
    data:{
      q:string;
      strictEdges?:boolean;
      fuzziness?:number;
      size?:number;
      from?:number;
      filter?:string;
      full?:boolean;
      withDigest?:true;
    },
    dataSourceKey?:string
  ):Promise<ISearchFullItems> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/nodes',
        method: 'GET',
        query : data,
        dataSource : dataSourceKey
      }
    );
  }

  /**
   * Search for edges based on a query string and optional parameters. Return formatted results for
   * the Linkurious client.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<ISearchFullItems>}
   */
  public edges (
    data:{
      q:string;
      strictEdges?:boolean;
      fuzziness?:number;
      size?:number;
      from?:number;
      filter?:string;
      full?:boolean;
      withDigest?:true;
    },
    dataSourceKey?:string
  ):Promise<ISearchFullItems> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/edges',
        method: 'GET',
        query : data,
        dataSource : dataSourceKey
      }
    );
  }

  /**
   * get the list of users
   *
   * @param {Object}data
   * @return {Promise<any>}
   */
  public getUsers ( data:{
    startsWith?:string,
    contains?:string,
    groupId?:number,
    offset?:number,
    limit?:number
  }):Promise<any> {
    return this.fetch({
      url : '/users',
      method : 'GET',
      query: data
    });
  }
}
