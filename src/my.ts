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

export default class My {

  private fetcher:i.Fetcher;

  constructor(fetcherInst:i.Fetcher){
    this.fetcher = <i.Fetcher>fetcherInst;
  }

  /**
   * Check if the user is authenticated.
   *
   * @returns {Promise<boolean>}
   */
  public IsAuth():Promise<boolean> {
    return this.fetcher.fetch('GET', '/auth/authenticated')
      .then(() => true);
  }

  /**
   * Check if the user is authenticated as an admin.
   *
   * @returns {Promise<boolean>}
   */
  public IsAdmin():Promise<boolean> {
    return this.fetcher.fetch('GET', '/auth/admin')
      .then(() => true);
  }

  /**
   * Delete a saved Graph Query owned by the current user
   *
   * @param graphQueryId : number
   * @returns {Promise<string>}
   */
  public deleteGraphQuery(graphQueryId:number):Promise<string> {
    return this.fetcher.fetch('DELETE', '/{dataSource}/graph/my/rawQuery/' + graphQueryId)
      .then(() => 'graph query ' + graphQueryId + ' deleted');
  }

  /**
   * Returns a saved Graph Query owned by the current user
   *
   * @param graphQueryId : number
   * @returns {Promise<Query.model>}
   */
  public getGraphQuery(graphQueryId:number):Promise<i.Query.model> {
    return this.fetcher.fetch('GET', '/{dataSource}/graph/my/rawQuery/' + graphQueryId);
  }

  /**
   * Returns all saved Graph Queries owned by the current user
   *
   * @returns {Promise<Array<Query.model>>}
   */
  public getAllGraphQueries():Promise<Array<i.Query.model>> {
    return this.fetcher.fetch('GET', '/{dataSource}/graph/my/rawQuery/all');
  }

  /**
   * Save and Returns the created GraphQuery
   * @param data : Query.form.create
   * @returns {Promise<Query.model>}
   */
  public saveGraphQuery(data:i.Query.form.create):Promise<i.Query.model> {
    return this.fetcher.fetch('POST', '/{dataSource}/graph/my/rawQuery', data);
  }

  /**
   * Update a graph query owned but the current user
   * @param graphQueryId : number
   * @param data : Query.form.update
   * @returns {Promise<Query.model>}
   */
  public updateGraphQuery(graphQueryId:number, data:i.Query.form.update):Promise<i.Query.model> {
    return this.fetcher.fetch('PATCH', '/{dataSource}/graph/my/rawQuery' + graphQueryId, data);
  }

}