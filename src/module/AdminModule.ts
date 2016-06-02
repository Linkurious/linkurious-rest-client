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

import {DataSource, App, User, Group} from '../interfaces';
import Utils from '../http/utils';
import Module from './Module';

export default class AdminModule extends Module {

  constructor(fetcher) {
    super(fetcher)
  }

  /**
   * Connect a disconnected data-source
   *
   * @param sourceIndex:number
   * @returns {Promise<boolean>}
   */
  public connectDataSource(sourceIndex:number):Promise<boolean> {
    return this.fetch({
      url   : '/admin/source/' + sourceIndex + '/connect',
      method: 'POST'
    }).then(() => true);
  }

  /**
   * Create a new data-source configuration (contains a graph database configuration and an index configuration).
   *
   * @param data:Interface.Form.dataSource.create
   * @returns {Promise<boolean>}
   */
  public createDataSourceConfig(data:DataSource.form.create):Promise<boolean> {
    return this.fetch({
      url   : '/admin/sources/config',
      method: 'POST',
      body  : data
    }).then(() => true);
  }

  /**
   * Delete a data-source configuration that has currently no connected data-source.
   *
   * @param sourceIndex:number
   * @returns {Promise<boolean>}
   */
  public deleteDataSourceConfig(sourceIndex:number):Promise<boolean> {
    return this.fetch({
      url   : '/admin/sources/config/' + sourceIndex,
      method: 'DELETE'
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
  public deleteFullDataSource(data:DataSource.form.Delete):Promise<DataSource.deletedDatas> {
    let mergeOptions = (data.mergeInto) ? {mergeInto: data.mergeInto} : null;

    return this.fetch({
      url   : '/admin/sources/data/' + data.sourceKey,
      method: 'DELETE',
      body  : Utils.fixSnakeCase(mergeOptions)
    });
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   *
   * @returns {Promise<Array<DataSource.adminModel>>}
   */
  public getDataSourcesList():Promise<Array<DataSource.adminModel>> {
    return this.fetch({
      url   : '/admin/sources',
      method: 'GET'
    });
  }

  /**
   * Get the list of edge-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenEdgeProperties(dataSource?:string):Promise<Array<string>> {
    return this.fetch({
      url       : '/admin/source/{dataSource}/hidden/edgeProperties',
      method    : 'GET',
      dataSource: dataSource
    });
  }

  /**
   * Get the list of node-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenNodeProperties(dataSource?:string):Promise<Array<string>> {
    return this.fetch({
      url       : '/admin/source/{dataSource}/hidden/nodeProperties',
      method    : 'GET',
      dataSource: dataSource
    });
  }

  /**
   * Get the list of edge-properties that re not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedEdgeProperties(dataSource?:string):Promise<Array<string>> {
    return this.fetch({
      url       : '/admin/source/dataSource/noIndex/edgeProperties',
      method    : 'GET',
      dataSource: dataSource
    });
  }

  /**
   * Get the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedNodeProperties(dataSource?:string):Promise<Array<string>> {
    return this.fetch({
      url       : '/admin/source/{dataSource}/noIndex/nodeProperties',
      method    : 'GET',
      dataSource: dataSource
    });
  }

  /**
   * Set the list of edge-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenEdgeProperties(data:DataSource.form.setProperties, dataSource?:string):Promise<boolean> {
    return this.fetch({
      url       : '/admin/source/{dataSource}/hidden/edgeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    });
  }

  /**
   * Set the list of node-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenNodeProperties(data:DataSource.form.setProperties, dataSource?:string):Promise<boolean> {
    return this.fetch({
      url       : '/admin/source/{dataSource}/hidden/nodeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    }).then(() => true);
  }

  /**
   * Set the list of edge-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setNotIndexedEdgeProperties(data:DataSource.form.setProperties, dataSource?:string):Promise<boolean> {
    return this.fetch({
      url       : '/admin/source/{dataSource}/noIndex/edgeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    }).then(() => true);
  }

  /**
   * Set the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setNotIndexedNodeProperties(data:DataSource.form.setProperties, dataSource?:string):Promise<boolean> {
    return this.fetch({
      url       : '/admin/source/{dataSource}/noIndex/nodeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    }).then(() => true);
  }

  /**
   * Add a new user to the application.
   *
   * @param data:User.form.create
   * @returns {Promise<User.model>}
   */
  public createUser(data:User.form.create):Promise<User.model> {
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
      url   : '/admin/users/' + userId,
      method: 'DELETE'
    }).then(() => true);
  }

  /**
   * Adds a new group to the application.
   * @param data:Group.form.create
   * @returns {Promise<Group.model>}
   */
  public createGroup(data:Group.form.create):Promise<Group.model> {
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
      url   : '/admin/groups/' + groupId,
      method: 'DELETE'
    }).then(() => true);
  }

  /**
   * List a group already defined in the database.
   *
   * @param groupId:number
   * @returns {Promise<Group.model>}
   */
  public getGroup(groupId:number):Promise<Group.model> {
    return this.fetch({
      url   : '/admin/groups/' + groupId,
      method: 'GET'
    });
  }

  /**
   * List all the groups already defined in the database.
   *
   * @param dataSource:string
   * @returns {Promise<Array<Group.model>>}
   */
  public getGroups(dataSource?:string):Promise<Array<Group.model>> {
    return this.fetch({
      url       : '/admin/{dataSource}/groups',
      method    : 'GET',
      dataSource: dataSource
    });
  }

  public getSimpleGroups():Promise<Array<Group.model>> {
    return this.fetch({
      url   : '/admin/groups',
      method: 'GET'
    });
  }

  /**
   * Get possible targetType, type and action names.
   *
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<Group.sourceAccessRights>}
   */
  public getGroupsRights(dataSource ?:string):Promise<Group.sourceAccessRights> {
    return this.fetch({
      url       : '/admin/{dataSource}/groups/rights_info',
      method    : 'GET',
      dataSource: dataSource
    });
  }

  /**
   * Bulk-set rights for a whole targetType on one or many groups.
   *
   * @param data:Group.form.batchRights
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<boolean>}
   */
  public updateBatchGroupsRights(data:Group.form.batchRights, dataSource?:string):Promise<boolean> {
    return this.fetch({
      url       : '/admin/{dataSource}/groups/group_rights',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    }).then(() => true);
  }

  /**
   * Overrides a given right with the one specified.
   *
   * @param data:Group.form.updateRights
   * @param groupId:number
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<Group.accessRights>}
   */
  public updateGroupRights(data:Group.form.updateRights, groupId:number, dataSource?:string):Promise< Group.accessRights> {
    return this.fetch({
      url       : '/admin/{dataSource}/groups/' + groupId + '/group_rights',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    });
  }

  /**
   * Patches users in the application. Beware, if all the groups for a given user are deleted, the user is added to the default group.
   *
   * @param data:User.form.batch
   * @returns {Promise<boolean>}
   */
  public updateBatchUser(data:User.form.batch):Promise<boolean> {
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
  public updateUser(data:User.form.update, userId:number):Promise<User.model> {
    return this.fetch({
      url   : '/admin/users/' + userId,
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
  public updateConfig(data:App.form.update):Promise<string> {
    return this.fetch({
      url   : '/config',
      method: 'POST',
      body  : data
    });
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @returns {Promise<boolean>}
   */
  public startIndexation():Promise<boolean> {
    return this.fetch({
      url   : '/{dataSource}/search/reindex',
      method: 'GET'
    }).then(() => true);
  }

}