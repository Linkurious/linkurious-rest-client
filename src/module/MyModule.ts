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

import {Query} from '../interfaces';
import Module from './Module';
import Fetcher from "../http/fetcher";

export default class MyModule extends Module {

  constructor(fetcher: Fetcher) {
    super(fetcher);
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
   * @param graphQueryId : number
   * @returns {Promise<string>}
   */
  public deleteGraphQuery(graphQueryId:number):Promise<string> {
    return this.fetch({
      url   : '/{dataSource}/graph/my/rawQuery/' + graphQueryId,
      method: 'DELETE'
    }).then(() => 'graph query ' + graphQueryId + ' deleted');
  }

  /**
   * Returns a saved GraphModule Query owned by the current user
   *
   * @param graphQueryId : number
   * @returns {Promise<Query.model>}
   */
  public getGraphQuery(graphQueryId:number):Promise<Query.model> {
    return this.fetch({
      url   : '/{dataSource}/graph/my/rawQuery/',
      method: 'GET'
    });
  }

  /**
   * Returns all saved GraphModule Queries owned by the current user
   *
   * @returns {Promise<Array<Query.model>>}
   */
  public getAllGraphQueries():Promise<Array<Query.model>> {
    return this.fetch({
      url   : '/{dataSource}/graph/my/rawQuery/all',
      method: 'GET'
    });
  }

  /**
   * Save and Returns the created GraphQuery
   * @param data : Query.form.create
   * @returns {Promise<Query.model>}
   */
  public saveGraphQuery(data: Query.form.create):Promise<Query.model> {
    return this.fetch({
      url   : '/{dataSource}/graph/my/rawQuery',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Update a graph query owned but the current user
   * @param graphQueryId : number
   * @param data : Query.form.update
   * @returns {Promise<Query.model>}
   */
  public updateGraphQuery(graphQueryId:number, data: Query.form.update):Promise<Query.model> {
    return this.fetch({
      url   : '/{dataSource}/graph/my/rawQuery' + graphQueryId,
      method: 'PATCH',
      body  : data
    });
  }

}
