/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-27.
 *
 * File:
 * Description :
 */
'use strict';

import { Fetcher } from '../http/fetcher';
import {
  IDeletedDataSource,
  IFullDataSource,
  IFullUser,
  IGroup,
  IGroupRights,
  IAccessRight,
  IIndexationStatus,
  IResetDefaults,
  IIndexationCallback,
  IClientState,
  IDataSourceConfig,
  IFullAdminAlert,
  IDataSourceRelative,
  ICreateDataSource, IDeleteDataSource, ISetDataSourceProperties, ICreateUser, ICreateGroup,
  IUpdateBatchGroupRights, IUpdateGroupRights, IUpdateBatchUser, IUpdateUser,
  IUpdateAppConfig, ICreateAlert, IAlert, IUpdateAlert
} from '../../index';
import { Utils } from '../http/utils';
import { Logger } from './../log/Logger';
import { Module } from './Module';

export class AdminModule extends Module {
  private _logger:Logger;
  private _clientState:IClientState;

  constructor (
    fetcher:Fetcher,
    logger:Logger,
    clientState:IClientState
  ) {
    super(fetcher);

    this._logger = <Logger> logger;
    this._clientState = <IClientState> clientState;
  }

  /**
   * Connect a disconnected data-source
   *
   * @param {IDataSourceConfig} data
   * @returns {Promise<boolean>}
   */
  public connectDataSource ( data:IDataSourceConfig ):Promise<boolean> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceIndex}/connect',
        method    : 'POST',
        dataSource: data
      }
    ).then(() => true);
  }

  /**
   * get the list of users
   *
   * @param {any}data
   * @return {Promise<any>}
   */
  public getUsers ( data:{
    startsWith?:string,
    contains?:string,
    groupId?:string,
    offset?:number,
    limit?:number
  }):Promise<any> {
    return this.fetch({
      url : '/admin/users',
      method : 'GET',
      query: Utils.fixSnakeCase(data)
    });
  }

  /**
   * Create a new data-source configuration (contains a graph database configuration and an index configuration).
   *
   * @param {ICreateDataSource} data
   * @returns {Promise<boolean>}
   */
  public createDataSourceConfig ( data:ICreateDataSource ):Promise<any> {
    return this.fetch(
      {
        url   : '/admin/sources/config',
        method: 'POST',
        body  : data
      }
    );
  }

  /**
   * Delete a data-source configuration that has currently no connected data-source.
   *
   * @param {IDataSourceConfig} [data]
   * @returns {Promise<boolean>}
   */
  public deleteDataSourceConfig ( data?:IDataSourceConfig ):Promise<boolean> {
    return this.fetch(
      {
        url       : '/admin/sources/config/{dataSourceIndex}',
        method    : 'DELETE',
        dataSource: data
      }
    ).then(() => true);
  }

  /**
   * Delete all data of data-source (visualizations, access-rights, widgets, full-text indexes).
   * Optionally merge visualizations and widgets into another data-source instead of deleting them.
   * Warning: when merging into another data-source, visualizations may break if node and edge IDs
   * are not the same in to target data-source.
   *
   * @param {IDeleteDataSource} data
   * @returns {Promise<IDeletedDataSource>}
   */
  public deleteFullDataSource ( data:IDeleteDataSource ):Promise<IDeletedDataSource> {
    let mergeOptions:any = (data.mergeInto) ? { mergeInto: data.mergeInto } : undefined;

    return this.fetch(
      {
        url       : '/admin/sources/data/{dataSourceKey}',
        method    : 'DELETE',
        query      : Utils.fixSnakeCase(mergeOptions),
        dataSource: this.setDataSourceKey(data.sourceKey)
      }
    );
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   *
   * @returns {Promise<Array<IFullDataSource>>}
   */
  public getDataSourcesList ():Promise<Array<IFullDataSource>> {
    return this.fetch(
      {
        url   : '/admin/sources',
        method: 'GET'
      }
    );
  }

  /**
   * Get the list of edge-properties hidden for the given data-source.
   *
   * @param {IDataSourceRelative} [data]
   * @returns {Promise<Array<string>>}
   */
  public getHiddenEdgeProperties ( data?:IDataSourceRelative ):Promise<Array<string>> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceKey}/hidden/edgeProperties',
        method    : 'GET',
        dataSource: data
      }
    );
  }

  /**
   * Get the list of node-properties hidden for the given data-source.
   *
   * @param {IDataSourceRelative} [data]
   * @returns {Promise<Array<string>>}
   */
  public getHiddenNodeProperties ( data?:IDataSourceRelative ):Promise<Array<string>> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceKey}/hidden/nodeProperties',
        method    : 'GET',
        dataSource: data
      }
    );
  }

  /**
   * Get the list of edge-properties that re not indexed for the given data-source.
   *
   * @param {IDataSourceRelative} [data]
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedEdgeProperties ( data?:IDataSourceRelative ):Promise<Array<string>> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceKey}/noIndex/edgeProperties',
        method    : 'GET',
        dataSource: data
      }
    );
  }

  /**
   * Get the list of node-properties that are not indexed for the given data-source.
   *
   * @param {IDataSourceRelative} [data]
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedNodeProperties ( data?:IDataSourceRelative ):Promise<Array<string>> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceKey}/noIndex/nodeProperties',
        method    : 'GET',
        dataSource: data
      }
    );
  }

  /**
   * Set the list of edge-properties that are hidden for the given data-source.
   *
   * @param {ISetDataSourceProperties} data
   * @returns {Promise<boolean>}
   */
  public setHiddenEdgeProperties ( data:ISetDataSourceProperties ):Promise<boolean> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceKey}/hidden/edgeProperties',
        method    : 'PUT',
        body      : data,
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * Set the list of node-properties that are hidden for the given data-source.
   *
   * @param {ISetDataSourceProperties} data
   * @returns {Promise<boolean>}
   */
  public setHiddenNodeProperties ( data:ISetDataSourceProperties ):Promise<boolean> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceKey}/hidden/nodeProperties',
        method    : 'PUT',
        body      : data,
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * Set the list of edge-properties that are not indexed for the given data-source.
   *
   * @param {ISetDataSourceProperties} data
   * @returns {Promise<boolean>}
   */
  public setNotIndexedEdgeProperties ( data:ISetDataSourceProperties ):Promise<boolean> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceKey}/noIndex/edgeProperties',
        method    : 'PUT',
        body      : data,
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * Set the list of node-properties that are not indexed for the given data-source.
   *
   * @param {ISetDataSourceProperties} data
   * @returns {Promise<boolean>}
   */
  public setNotIndexedNodeProperties ( data:ISetDataSourceProperties ):Promise<boolean> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceKey}/noIndex/nodeProperties',
        method    : 'PUT',
        body      : data,
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * Add a new user to the application.
   *
   * @param {ICreateUser} data
   * @returns {Promise<IFullUser>}
   */
  public createUser ( data:ICreateUser ):Promise<IFullUser> {
    return this.fetch(
      {
        url   : '/admin/users',
        method: 'POST',
        body  : data
      }
    );
  }

  /**
   * Deletes a user in the application.
   *
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  public deleteUser ( userId:number ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/admin/users/{id}',
        method: 'DELETE',
        body  : { id: userId }
      }
    ).then(() => true);
  }

  /**
   * Adds a new group to the application.
   * @param {ICreateGroup} data
   * @returns {Promise<IGroup>}
   */
  public createGroup ( data:ICreateGroup ):Promise<IGroup> {

    let dataToSend:any = {
      name: data.name
    };

    return this.fetch(
      {
        url       : '/admin/{dataSourceKey}/groups',
        method    : 'POST',
        body      : dataToSend,
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * Deletes a group in the application.
   *
   * @param {number} groupId
   * @returns {Promise<boolean>}
   */
  public deleteGroup ( groupId:number ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/admin/groups/{id}',
        method: 'DELETE',
        body  : { id: groupId }
      }
    ).then(() => true);
  }

  /**
   * List a group already defined in the database.
   *
   * @param {number} data
   * @returns {Promise<IGroup>}
   */
  public getGroup ( data:{
    id:number,
    dataSourceKey?:string,
  } ):Promise<IGroup> {
    return this.fetch(
      {
        url       : '/admin/{dataSourceKey}/groups/{id}',
        method    : 'GET',
        query     : { id: data.id },
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * List all the groups already defined in the database and based on the dataSource.
   *
   * @param {IDataSourceRelative} data
   * @returns {Promise<Array<IGroup>>}
   */
  public getGroups ( data:{
    dataSourceKey?:string,
    withAccessRights?:boolean
  } ):Promise<Array<IGroup>> {
    return this.fetch(
      {
        url       : '/admin/{dataSourceKey}/groups',
        method    : 'GET',
        query : Utils.fixSnakeCase({withAccessRights: data.withAccessRights}),
        dataSource : this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * Get possible targetType, type and action names.
   *
   * @returns {Promise<IGroupRights>}
   */
  public getGroupsRights ():Promise<IGroupRights> {
    return this.fetch(
      {
        url       : '/admin//groups/rights_info',
        method    : 'GET'
      }
    );
  }

  /**
   * Bulk-set rights for a whole targetType on one or many groups.
   *
   * @param {IUpdateBatchGroupRights} data
   * @returns {Promise<boolean>}
   */
  public updateBatchGroupsRights ( data:IUpdateBatchGroupRights ):Promise<boolean> {
    return this.fetch(
      {
        url       : '/admin/{dataSourceKey}/groups/group_rights',
        method    : 'PUT',
        body      : data,
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    ).then(() => true);
  }

  /**
   * Overrides a given right with the one specified.
   *
   * @param {IUpdateGroupRights} data
   * @returns {Promise<IAccessRight>}
   */
  public updateGroupRights ( data:IUpdateGroupRights ):Promise<IAccessRight> {
    return this.fetch(
      {
        url       : '/admin/{dataSourceKey}/groups/{id}/group_rights',
        method    : 'PUT',
        body      : data,
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * Patches users in the application.
   * Beware, if all the groups for a given user are deleted, the user is added to the default group.
   *
   * @param {IUpdateBatchUser} data
   * @returns {Promise<boolean>}
   */
  public updateBatchUser ( data:IUpdateBatchUser ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/admin/users',
        method: 'PATCH',
        body  : data
      }
    ).then(() => true);
  }

  /**
   * Patches a user in the application
   *
   * @param {IUpdateUser} data
   * @returns {Promise<IFullUser>}
   */
  public updateUser ( data:IUpdateUser ):Promise<IFullUser> {
    return this.fetch(
      {
        url   : '/admin/users/{id}',
        method: 'PATCH',
        body  : data
      }
    );
  }

  /**
   * Sets the configuration of the application
   *
   * @param {IUpdateAppConfig} data
   * @returns {Promise<string>}
   */
  public updateConfig ( data:IUpdateAppConfig ):Promise<string> {
    let query:any = {
      reset      : data.reset,
      sourceIndex: data.dataSourceIndex
    };

    let body:any = {
      path         : data.path,
      configuration: data.configuration
    };

    return this.fetch(
      {
        url   : '/config',
        method: 'POST',
        body  : body,
        query : query
      }
    );
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @returns {Promise<boolean>}
   */
  public startIndexation ():Promise<boolean> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/reindex',
        method: 'GET'
      }
    ).then(() => true);
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @returns {Promise<IIndexationStatus>}
   */
  public getIndexationStatus ():Promise<IIndexationStatus> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/search/status',
        method: 'GET'
      }
    );
  }

  /**
   * @callback IIndexationCallback
   * @param {IIndexationStatus} responseStatus
   */

  /**
   * Launch the indexation and return true when finish. Possibility to had callback called each
   * 300ms during indexation.
   *
   * @param {number} timeout
   * @param {IIndexationCallback} [callback]
   * @returns {Promise<boolean>}
   */
  public processIndexation (
    timeout:number,
    callback?:IIndexationCallback
  ):Promise<boolean> {

    let minTimeout:number = 200;
    const maxTimeout:number = 3000;

    if ( this._logger.level === 'debug' ) {
      minTimeout = 50;
    }

    if ( timeout < minTimeout ) {
      timeout = 200;
    }

    if ( timeout > maxTimeout ) {
      timeout = 3000;
    }

    return this.listenIndexation(timeout, callback);
  }

  /**
   * Create and return new alert
   * @param {ICreateAlert} data
   * @returns {Promise<IFullAdminAlert>}
   */
  public createAlert ( data:ICreateAlert ):Promise<IFullAdminAlert> {
    return this.fetch(
      {
        url       : '/admin/{dataSourceKey}/alerts',
        method    : 'POST',
        body      : data,
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * update existing alert
   * @param {ICreateAlert} data
   * @returns {Promise<IFullAdminAlert>}
   */
  public updateAlert ( data:IUpdateAlert ):Promise<IFullAdminAlert> {
    return this.fetch(
      {
        url   : '/admin/{dataSourceKey}/alerts/{id}',
        method: 'PATCH',
        body  : data
      }
    );
  }

  /**
   * delete existing alert
   * @param {IAlert} data
   * @returns {Promise<boolean>}
   */
  public deleteAlert ( data:IAlert ):Promise<boolean> {
    return this.fetch(
      {
        url   : '/admin/{dataSourceKey}/alerts/{id}',
        method: 'DELETE',
        body  : data
      }
    ).then(() => true);
  }

  /**
   * get list of all alerts
   * @param {IDataSourceRelative} data
   * @returns {Promise<IFullAdminAlert>}
   */
  public getAlerts ( data:IDataSourceRelative ):Promise<Array<IFullAdminAlert>> {
    return this.fetch(
      {
        url       : '/admin/{dataSourceKey}/alerts',
        method    : 'GET',
        dataSource: this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * get an alert
   * @param {IAlert} data
   * @returns {Promise<IFullAdminAlert>}
   */
  public getAlert ( data:IAlert ):Promise<IFullAdminAlert> {
    return this.fetch(
      {
        url   : '/admin/{dataSourceKey}/alerts/{id}',
        method: 'GET',
        body  : data
      }
    );
  }

  /**
   * reset all default styles for a dataSource
   * @param {IDataSourceRelative} data
   * @returns {Promise<boolean>}
   */
  public resetDefaults ( data:IResetDefaults ):Promise<boolean> {
    return this.fetch(
      {
        url       : '/admin/source/{dataSourceKey}/resetDefaults',
        method    : 'POST',
        body      : data
      }
    ).then(() => true);
  }

  /**
   * check if an indexation is currently running
   *
   * @returns {Promise<any>}
   */
  public checkIndexation ():Promise<any> {
    return this.getIndexationStatus();
  }

  /**
   * @callback IIndexationCallback
   * @param {IIndexationStatus} responseStatus
   */

  /**
   * return true when indexation if finished, else launch callback.
   *
   * @param {number} timeout
   * @param {IIndexationCallback} [callback]
   * @returns {Promise<boolean>}
   */
  private listenIndexation (
    timeout:number,
    callback?:IIndexationCallback
  ):Promise<any> {
    return this.getIndexationStatus().then(
      ( res:IIndexationStatus ) => {
        if ( res.indexing !== 'done' ) {
          if ( callback ) {
            callback(res);
          }

          return new Promise(
            ( resolve:any ) => {
              return setTimeout(resolve, timeout);
            }
          ).then(() => this.listenIndexation(timeout, callback));
        } else {
          return res;
        }
      }
    );
  }
}
