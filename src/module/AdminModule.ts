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

import * as Request from '../Query';
import Fetcher from '../http/fetcher';
import {
  IDeletedDataSource,
  IFullDataSource,
  IFullUser,
  IGroup,
  ISimpleGroup,
  IGroupRights,
  IAccessRight,
  IIndexationStatus,
  IIndexationCallback,
  IClientState
} from '../interfaces';
import Utils from '../http/utils';
import LinkuriousError from './../LinkuriousError';
import {Logger} from './../log/Logger';
import Module from './Module';
import {IDataSourceRelative} from "../http/IFetchConfig";

export default class AdminModule extends Module {
  private _logger:Logger;
  private _clientState:IClientState;

  constructor(fetcher:Fetcher, logger:Logger, clientState:IClientState) {
    super(fetcher)

    this._logger      = <Logger>logger;
    this._clientState = <IClientState>clientState;
  }

  /**
   * Connect a disconnected data-source
   *
   * @param dataSourceIndex:number
   * @returns {Promise<boolean>}
   */
  public connectDataSource(data?:IDataSourceRelative):Promise<boolean> {
    return this.fetch({
      url       : '/admin/source/{dataSourceIndex}/connect',
      method    : 'POST',
      dataSource: data
    }).then(() => true);
  }

  /**
   * Create a new data-source configuration (contains a graph database configuration and an index configuration).
   *
   * @param data:Interface.Form.dataSource.create
   * @returns {Promise<boolean>}
   */
  public createDataSourceConfig(data:Request.ICreateDataSource):Promise<boolean> {
    return this.fetch({
      url   : '/admin/sources/config',
      method: 'POST',
      body  : data
    }).then(() => true);
  }

  /**
   * Delete a data-source configuration that has currently no connected data-source.
   *
   * @param dataSourceIndex:number
   * @returns {Promise<boolean>}
   */
  public deleteDataSourceConfig(data?:IDataSourceRelative):Promise<boolean> {
    return this.fetch({
      url       : '/admin/sources/config/{dataSourceIndex}',
      method    : 'DELETE',
      dataSource: data
    }).then(() => true);
  }

  /**
   * Delete all data of data-source (visualizations, access-rights, widgets, full-text indexes).
   * Optionally merge visualizations and widgets into another data-source instead of deleting them.
   * Warning: when merging into another data-source, visualizations may break if node and edge IDs
   * are not the same in to target data-source.
   *
   * @param data:Interface.RequestDeleteDatas
   * @returns {Promise<DataSource.deletedDatas>}
   */
  public deleteFullDataSource(data:Request.IDeleteDataSource):Promise<IDeletedDataSource> {
    let mergeOptions = (data.mergeInto) ? {mergeInto: data.mergeInto} : null;

    return this.fetch({
      url       : '/admin/sources/data/{dataSourceKey}',
      method    : 'DELETE',
      body      : Utils.fixSnakeCase(mergeOptions),
      dataSource: {dataSourceKey: data.dataSourceKey}
    });
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   *
   * @returns {Promise<Array<DataSource.adminModel>>}
   */
  public getDataSourcesList():Promise<Array<IFullDataSource>> {
    return this.fetch({
      url   : '/admin/sources',
      method: 'GET'
    });
  }

  /**
   * Get the list of edge-properties hidden for the given data-source.
   *
   * @param dataSourceKey:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenEdgeProperties(data?:IDataSourceRelative):Promise<Array<string>> {
    return this.fetch({
      url       : '/admin/source/{dataSourceKey}/hidden/edgeProperties',
      method    : 'GET',
      dataSource: data
    });
  }

  /**
   * Get the list of node-properties hidden for the given data-source.
   *
   * @param dataSourceKey:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenNodeProperties(data?:IDataSourceRelative):Promise<Array<string>> {
    return this.fetch({
      url       : '/admin/source/{dataSourceKey}/hidden/nodeProperties',
      method    : 'GET',
      dataSource: data
    });
  }

  /**
   * Get the list of edge-properties that re not indexed for the given data-source.
   *
   * @param dataSourceKey:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedEdgeProperties(data?:IDataSourceRelative):Promise<Array<string>> {
    return this.fetch({
      url       : '/admin/source/{dataSourceKey}/noIndex/edgeProperties',
      method    : 'GET',
      dataSource: data
    });
  }

  /**
   * Get the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSourceKey:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedNodeProperties(data?:IDataSourceRelative):Promise<Array<string>> {
    return this.fetch({
      url       : '/admin/source/{dataSourceKey}/noIndex/nodeProperties',
      method    : 'GET',
      dataSource: data
    });
  }

  /**
   * Set the list of edge-properties that are hidden for the given data-source.
   *
   * @param dataSourceKey:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenEdgeProperties(data:Request.ISetDataSourceProperties):Promise<boolean> {
    return this.fetch({
      url       : '/admin/source/{dataSourceKey}/hidden/edgeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: {dataSourceKey: data.dataSourceKey}
    });
  }

  /**
   * Set the list of node-properties that are hidden for the given data-source.
   *
   * @param dataSourceKey:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenNodeProperties(data:Request.ISetDataSourceProperties):Promise<boolean> {
    return this.fetch({
      url       : '/admin/source/{dataSourceKey}/hidden/nodeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: {dataSourceKey: data.dataSourceKey}
    }).then(() => true);
  }

  /**
   * Set the list of edge-properties that are not indexed for the given data-source.
   *
   * @param dataSourceKey:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setNotIndexedEdgeProperties(data:Request.ISetDataSourceProperties):Promise<boolean> {
    return this.fetch({
      url       : '/admin/source/{dataSourceKey}/noIndex/edgeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: {dataSourceKey: data.dataSourceKey}
    }).then(() => true);
  }

  /**
   * Set the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSourceKey:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setNotIndexedNodeProperties(data:Request.ISetDataSourceProperties):Promise<boolean> {
    return this.fetch({
      url       : '/admin/source/{dataSourceKey}/noIndex/nodeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: {dataSourceKey: data.dataSourceKey}
    }).then(() => true);
  }

  /**
   * Add a new user to the application.
   *
   * @param data:User.form.create
   * @returns {Promise<User.model>}
   */
  public createUser(data:Request.ICreateUser):Promise<IFullUser> {
    return this.fetch({
      url   : '/admin/users',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Deletes a user in the application.
   *
   * @param userId:number
   * @returns {Promise<string>}
   */
  public deleteUser(userId:number):Promise<boolean> {
    return this.fetch({
      url   : '/admin/users/{id}',
      method: 'DELETE',
      body  : {id: userId}
    }).then(() => true);
  }

  /**
   * Adds a new group to the application.
   * @param data:Group.form.create
   * @returns {Promise<Group.model>}
   */
  public createGroup(data:Request.ICreateGroup):Promise<IGroup> {
    return this.fetch({
      url   : 'admin/groups',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Deletes a group in the application.
   *
   * @param groupId:number
   * @returns {Promise<string>}
   */
  public deleteGroup(groupId:number):Promise<boolean> {
    return this.fetch({
      url   : '/admin/groups/{id}',
      method: 'DELETE',
      body  : {id: groupId}
    }).then(() => true);
  }

  /**
   * List a group already defined in the database.
   *
   * @param groupId:number
   * @returns {Promise<Group.model>}
   */
  public getGroup(groupId:number):Promise<IGroup> {
    return this.fetch({
      url   : '/admin/groups/{id}',
      method: 'GET',
      query : {id: groupId}
    });
  }

  /**
   * List all the groups already defined in the database.
   *
   * @param dataSourceKey:string
   * @returns {Promise<Array<Group.model>>}
   */
  public getGroups(data:IDataSourceRelative):Promise<Array<IGroup>> {
    return this.fetch({
      url       : '/admin/{dataSourceKey}/groups',
      method    : 'GET',
      dataSource: data
    });
  }

  public getSimpleGroups():Promise<Array<ISimpleGroup>> {
    return this.fetch({
      url   : '/admin/groups',
      method: 'GET'
    });
  }

  /**
   * Get possible targetType, type and action names.
   *
   * @param dataSourceKey?:string default : take the current source key.
   * @returns {Promise<Group.sourceAccessRights>}
   */
  public getGroupsRights(data:IDataSourceRelative):Promise<IGroupRights> {
    return this.fetch({
      url       : '/admin/{dataSourceKey}/groups/rights_info',
      method    : 'GET',
      dataSource: data
    });
  }

  /**
   * Bulk-set rights for a whole targetType on one or many groups.
   *
   * @param data:Group.form.batchRights
   * @param dataSourceKey?:string default : take the current source key.
   * @returns {Promise<boolean>}
   */
  public updateBatchGroupsRights(data:Request.IUpdateBatchGroupRights):Promise<boolean> {
    return this.fetch({
      url       : '/admin/{dataSourceKey}/groups/group_rights',
      method    : 'PUT',
      body      : data,
      dataSource: {dataSourceKey: data.dataSourceKey}
    }).then(() => true);
  }

  /**
   * Overrides a given right with the one specified.
   *
   * @param data:Group.form.updateRights
   * @param groupId:number
   * @param dataSourceKey?:string default : take the current source key.
   * @returns {Promise<Group.accessRights>}
   */
  public updateGroupRights(data:Request.IUpdateGroupRights):Promise<IAccessRight> {
    return this.fetch({
      url       : '/admin/{dataSourceKey}/groups/{id}/group_rights',
      method    : 'PUT',
      body      : data,
      dataSource: {dataSourceKey: data.dataSourceKey}
    });
  }

  /**
   * Patches users in the application. Beware, if all the groups for a given user are deleted, the user is added to the default group.
   *
   * @param data:User.form.batch
   * @returns {Promise<boolean>}
   */
  public updateBatchUser(data:Request.IUpdateBatchUser):Promise<boolean> {
    return this.fetch({
      url   : '/admin/users',
      method: 'PATCH',
      body  : data
    }).then(() => true);
  }

  /**
   * Patches a user in the application
   *
   * @param data:User.form.update
   * @param userId:number
   * @returns {Promise<User.model>}
   */
  public updateUser(data:Request.IUpdateUser):Promise<IFullUser> {
    return this.fetch({
      url   : '/admin/users/{id}',
      method: 'PATCH',
      body  : data
    });
  }

  /**
   * Sets the configuration of the application
   *
   * @param data:Interface.Form.config.update
   * @returns {Promise<string>}
   */
  public updateConfig(data:Request.IUpdateAppConfig):Promise<string> {
    let query = {
      reset      : data.reset,
      sourceIndex: data.dataSourceIndex
    };

    let body = {
      path         : data.path,
      configuration: data.configuration
    };

    return this.fetch({
      url   : '/config',
      method: 'POST',
      body  : body,
      query : query
    });
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @returns {Promise<boolean>}
   */
  public startIndexation():Promise<boolean> {
    return this.fetch({
      url   : '/{dataSourceKey}/search/reindex',
      method: 'GET'
    }).then(() => true);
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @returns {Promise<IIndexationStatus>}
   */
  public getIndexationStatus():Promise<IIndexationStatus> {
    return this.fetch({
      url   : '/{dataSourceKey}/search/status',
      method: 'GET'
    }).then(r => {
      if (r.indexed_source !== this._clientState.currentSource.key && r.indexing !== 'done') {
        this._logger.error(LinkuriousError.fromClientError(
          'Indexation error',
          'Server is indexing another source.'
        ));
        return Promise.reject(r);
      }
      return r;
    });
  }

  /**
   * Launch the indexation and return true when finish. Possibility to had callback called each 300ms during indexation.
   *
   * @param timeout:number
   * @param callback:Function
   * @returns {Promise<boolean>}
   */
  public processIndexation(timeout:number, callback?:IIndexationCallback):Promise<boolean> {

    let minTimeout   = 200;
    const maxTimeout = 3000;

    if (this._logger.level === 'debug') {
      minTimeout = 50
    }

    if (timeout < minTimeout) {
      timeout = 200;
    }

    if (timeout > maxTimeout) {
      timeout = 500;
    }

    return this.startIndexation()
      .then(() => this.listenIndexation(timeout, callback))
      .then(() => true);
  }

  /**
   * return true when indexation if finished, else launch callback.
   *
   * @param timeout:number
   * @param callback:Function
   * @returns {Promise<boolean>}
   */
  private listenIndexation(timeout:number, callback?:IIndexationCallback):Promise<boolean> {
    return this.getIndexationStatus()
      .then(res => {
        if (res.indexing !== 'done') {
          if (callback) {
            callback(res);
          }

          return new Promise((resolve) => {
            setTimeout(() => {
              return resolve(this.listenIndexation(timeout, callback));
            }, timeout);
          });
        } else {
          return true;
        }
      });
  }

}
