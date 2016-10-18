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
import { IGraphQuery, IFullUser } from '../interfaces';
import {Module} from './Module';
import {Fetcher} from '../http/fetcher';

export class MyModule extends Module {

  constructor(fetcher:Fetcher) {
    super(fetcher);
  }
  /**
   * get authenticated user infos
   *
   * @returns {Promise<IFullUser>}
   */
  public infos():Promise<IFullUser> {
    return this.fetch({
      url : '/auth/me',
      method : 'GET'
    });
  }

  /**
   * Check if the user is authenticated.
   *
   * @returns {Promise<boolean>}
   */
  public IsAuth():Promise<boolean> {
    return this.fetch({
      url   : '/auth/authenticated',
      method: 'GET'
    }).then(() => true);
  }

  /**
   * Check if the user is authenticated as an admin.
   *
   * @returns {Promise<boolean>}
   */
  public IsAdmin():Promise<boolean> {
    return this.fetch({
      url   : '/auth/admin',
      method: 'GET'
    }).then(() => true);
  }

  /**
   * Delete a saved Graph Query owned by the current user
   *
   * @param {number} graphQueryId
   * @returns {Promise<boolean>}
   */
  public deleteGraphQuery(graphQueryId:number):Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/my/rawQuery/{id}',
      method: 'DELETE',
      body  : {id: graphQueryId}
    }).then(() => true);
  }

  /**
   * Returns a saved GraphModule Query owned by the current user
   *
   * @param {number} graphQueryId
   * @returns {Promise<IGraphQuery>}
   */
  public getGraphQuery(graphQueryId:number):Promise<IGraphQuery> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/my/rawQuery/{id}',
      method: 'GET',
      query : {id: graphQueryId}
    });
  }

  /**
   * Returns all saved GraphModule Queries owned by the current user
   *
   * @returns {Promise<Array<IGraphQuery>>}
   */
  public getAllGraphQueries():Promise<Array<IGraphQuery>> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/my/rawQuery/all',
      method: 'GET'
    });
  }

  /**
   * Save and Returns the created GraphQuery
   * @param {ICreateGraphQuery} data
   * @returns {Promise<IGraphQuery>}
   */
  public saveGraphQuery(data:Query.ICreateGraphQuery):Promise<IGraphQuery> {
    return this.fetch({
      url   : '/{dataSourceKey}/graph/my/rawQuery',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Update a graph query owned but the current user
   *
   * @param {IUpdateGraphQuery} data
   * @returns {Promise<IGraphQuery>}
   */
  public updateGraphQuery(data:Query.IUpdateGraphQuery):Promise<boolean> {
    let body:any = JSON.parse(JSON.stringify(data));
    body.properties = {
      name : data.name,
      content : data.content
    };
    body.name = undefined;
    body.content = undefined;

    return this.fetch({
      url   : '/{dataSourceKey}/graph/my/rawQuery/{id}',
      method: 'PATCH',
      body  : body
    });
  }
}
