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

import { IGraphQuery, IFullUser } from '../../index';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';

export class MyModule extends Module {

  constructor ( fetcher:Fetcher ) {
    super(fetcher);
  }

  /**
   * get authenticated user infos
   *
   * @returns {Promise<IFullUser>}
   */
  public infos ():Promise<IFullUser> {
    return this.fetch(
      {
        url   : '/auth/me',
        method: 'GET'
      }
    );
  }

  /**
   * Check if the user is authenticated.
   *
   * @returns {Promise<boolean>}
   */
  public IsAuth ():Promise<boolean> {
    return this.fetch(
      {
        url   : '/auth/authenticated',
        method: 'GET'
      }
    );
  }

  /**
   * Delete a saved Graph Query owned by the current user
   *
   * @param {any} data
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public deleteGraphQuery (
    data:{
      id:number
    },
    dataSourceKey?:string
  ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/my/rawQuery/{id}',
        method: 'DELETE',
        body  : data,
        dataSource : dataSourceKey
      }
    );
  }

  /**
   * Returns a saved GraphModule Query owned by the current user
   *
   * @param {any} data
   * @param {string}dataSourceKey
   * @returns {Promise<IGraphQuery>}
   */
  public getGraphQuery (
    data:{
      id:number
    },
    dataSourceKey?:string
  ):Promise<IGraphQuery> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/my/rawQuery/{id}',
        method: 'GET',
        query : data,
        dataSource : dataSourceKey
      }
    );
  }

  /**
   * Returns all saved GraphModule Queries owned by the current user
   *
   * @returns {Promise<Array<IGraphQuery>>}
   */
  public getAllGraphQueries (dataSourceKey?:string):Promise<Array<IGraphQuery>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/my/rawQuery/all',
        method: 'GET',
        dataSource: dataSourceKey
      }
    );
  }

  /**
   * Save and Returns the created GraphQuery
   * @param {ICreateGraphQuery} data
   * @param {string}dataSourceKey
   * @returns {Promise<IGraphQuery>}
   */
  public saveGraphQuery (
    data:{
      dialect:string;
      content:string;
      name?:string;
    },
    dataSourceKey?:string
  ):Promise<IGraphQuery> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/my/rawQuery',
        method: 'POST',
        body  : data,
        dataSource : dataSourceKey
      }
    );
  }

  /**
   * Update a graph query owned but the current user
   *
   * @param {IUpdateGraphQuery} data
   * @param {string}dataSourceKey
   * @returns {Promise<IGraphQuery>}
   */
  public updateGraphQuery (
    data:{
      id:number;
      name?:string;
      content?:string;
    },
    dataSourceKey?:string
  ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/graph/my/rawQuery/{id}',
        method: 'PATCH',
        body  : {id: data.id, properties : data},
        dataSource : dataSourceKey
      }
    );
  }
}
