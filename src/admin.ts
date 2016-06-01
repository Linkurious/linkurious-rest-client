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

import * as i from './interfaces';
import {Utils} from './Utils';

export default class Admin {

  private fetcher;

  constructor(linkuriousInst) {
    this.fetcher = linkuriousInst;
  }

  /**
   * Connect a disconnected data-source
   *
   * @param sourceIndex:number
   * @returns {Promise<boolean>}
   */
  public connectDataSource(sourceIndex:number):Promise<boolean> {
    let fetchConfig = {
      url   : '/admin/source/' + sourceIndex + '/connect',
      method: 'POST'
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Create a new data-source configuration (contains a graph database configuration and an index configuration).
   *
   * @param data:Interface.Form.dataSource.create
   * @returns {Promise<boolean>}
   */
  public createDataSourceConfig(data:i.Source.form.create):Promise<boolean> {
    let fetchConfig = {
      url   : '/admin/sources/config',
      method: 'POST',
      body  : data
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Delete a data-source configuration that has currently no connected data-source.
   *
   * @param sourceIndex:number
   * @returns {Promise<boolean>}
   */
  public deleteDataSourceConfig(sourceIndex:number):Promise<boolean> {
    let fetchConfig = {
      url   : '/admin/sources/config/' + sourceIndex,
      method: 'DELETE'
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Delete all data of data-source (visualizations, access-rights, widgets, full-text indexes).
   * Optionally merge visualizations and widgets into another data-source instead of deleting them.
   * Warning: when merging into another data-source, visualizations may break if node and edge IDs
   * are not the same in to target data-source.
   *
   * @param data:Interface.RequestDeleteDatas
   * @returns {Promise<Source.deletedDatas>}
   */
  public deleteFullDataSource(data:i.Source.form.Delete):Promise<i.Source.deletedDatas> {

    let mergeOptions = (data.mergeInto) ? {mergeInto: data.mergeInto} : null;

    let fetchConfig = {
      url   : '/admin/sources/data/' + data.sourceKey,
      method: 'DELETE',
      body  : Utils.fixSnakeCase(mergeOptions)
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   *
   * @returns {Promise<Array<Source.adminModel>>}
   */
  public getDataSourcesList():Promise<Array<i.Source.adminModel>> {
    let fetchConfig = {
      url   : '/admin/sources',
      method: 'GET'
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Get the list of edge-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenEdgeProperties(dataSource?:string):Promise<Array<string>> {
    let fetchConfig = {
      url       : '/admin/source/{dataSource}/hidden/edgeProperties',
      method    : 'GET',
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Get the list of node-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenNodeProperties(dataSource?:string):Promise<Array<string>> {
    let fetchConfig = {
      url       : '/admin/source/{dataSource}/hidden/nodeProperties',
      method    : 'GET',
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Get the list of edge-properties that re not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedEdgeProperties(dataSource?:string):Promise<Array<string>> {
    let fetchConfig = {
      url       : '/admin/source/dataSource/noIndex/edgeProperties',
      method    : 'GET',
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Get the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedNodeProperties(dataSource?:string):Promise<Array<string>> {
    let fetchConfig = {
      url       : '/admin/source/{dataSource}/noIndex/nodeProperties',
      method    : 'GET',
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Set the list of edge-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenEdgeProperties(data:i.Source.form.setProperties, dataSource?:string):Promise<boolean> {
    let fetchConfig = {
      url       : '/admin/source/{dataSource}/hidden/edgeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Set the list of node-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenNodeProperties(data:i.Source.form.setProperties, dataSource?:string):Promise<boolean> {
    let fetchConfig = {
      url       : '/admin/source/{dataSource}/hidden/nodeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Set the list of edge-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setNotIndexedEdgeProperties(data:i.Source.form.setProperties, dataSource?:string):Promise<boolean> {
    let fetchConfig = {
      url       : '/admin/source/{dataSource}/noIndex/edgeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Set the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setNotIndexedNodeProperties(data:i.Source.form.setProperties, dataSource?:string):Promise<boolean> {
    let fetchConfig = {
      url       : '/admin/source/{dataSource}/noIndex/nodeProperties',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Add a new user to the application.
   *
   * @param data:User.form.create
   * @returns {Promise<User.model>}
   */
  public createUser(data:i.User.form.create):Promise<i.User.model> {
    let fetchConfig = {
      url   : '/admin/users',
      method: 'POST',
      body  : data
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Deletes a user in the application.
   *
   * @param userId:number
   * @returns {Promise<string>}
   */
  public deleteUser(userId:number):Promise<boolean> {
    let fetchConfig = {
      url   : '/admin/users/' + userId,
      method: 'DELETE'
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Adds a new group to the application.
   * @param data:Group.form.create
   * @returns {Promise<Group.model>}
   */
  public createGroup(data:i.Group.form.create):Promise<i.Group.model> {
    let fetchConfig = {
      url   : 'admin/groups',
      method: 'POST',
      body  : data
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Deletes a group in the application.
   *
   * @param groupId:number
   * @returns {Promise<string>}
   */
  public deleteGroup(groupId:number):Promise<boolean> {
    let fetchConfig = {
      url   : '/admin/groups/' + groupId,
      method: 'DELETE'
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * List a group already defined in the database.
   *
   * @param groupId:number
   * @returns {Promise<Group.model>}
   */
  public getGroup(groupId:number):Promise<i.Group.model> {
    let fetchConfig = {
      url   : '/admin/groups/' + groupId,
      method: 'GET'
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * List all the groups already defined in the database.
   *
   * @param dataSource:string
   * @returns {Promise<Array<Group.model>>}
   */
  public getGroups(dataSource?:string):Promise<Array<i.Group.model>> {
    let fetchConfig = {
      url       : '/admin/{dataSource}/groups',
      method    : 'GET',
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig);
  }

  public getSimpleGroups():Promise<Array<i.Group.model>> {
    let fetchConfig = {
      url   : '/admin/groups',
      method: 'GET'
    };

    return this.fetcher(fetchConfig);
  }

  /**
   * Get possible targetType, type and action names.
   *
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<Group.sourceAccessRights>}
   */
  public getGroupsRights(dataSource ?:string):Promise<i.Group.sourceAccessRights> {
    let fetchConfig = {
      url       : '/admin/{dataSource}/groups/rights_info',
      method    : 'GET',
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Bulk-set rights for a whole targetType on one or many groups.
   *
   * @param data:Group.form.batchRights
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<boolean>}
   */
  public updateBatchGroupsRights(data:i.Group.form.batchRights, dataSource?:string):Promise<boolean> {
    let fetchConfig = {
      url       : '/admin/{dataSource}/groups/group_rights',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Overrides a given right with the one specified.
   *
   * @param data:Group.form.updateRights
   * @param groupId:number
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<Group.accessRights>}
   */
  public updateGroupRights(data:i.Group.form.updateRights, groupId:number, dataSource?:string):Promise<i.Group.accessRights> {
    let fetchConfig = {
      url       : '/admin/{dataSource}/groups/' + groupId + '/group_rights',
      method    : 'PUT',
      body      : data,
      dataSource: dataSource
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Patches users in the application. Beware, if all the groups for a given user are deleted, the user is added to the default group.
   *
   * @param data:User.form.batch
   * @returns {Promise<boolean>}
   */
  public updateBatchUser(data:i.User.form.batch):Promise<boolean> {
    let fetchConfig = {
      url   : '/admin/users',
      method: 'PATCH',
      body  : data
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

  /**
   * Patches a user in the application
   *
   * @param data:User.form.update
   * @param userId:number
   * @returns {Promise<User.model>}
   */
  public updateUser(data:i.User.form.update, userId:number):Promise<i.User.model> {
    let fetchConfig = {
      url   : '/admin/users/' + userId,
      method: 'PATCH',
      body  : data
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Sets the configuration of the application
   *
   * @param data:Interface.Form.config.update
   * @returns {Promise<string>}
   */
  public updateConfig(data:i.App.form.update):Promise<string> {
    let fetchConfig = {
      url   : '/config',
      method: 'POST',
      body  : data
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @returns {Promise<boolean>}
   */
  public startIndexation():Promise<boolean> {
    let fetchConfig = {
      url   : '/{dataSource}/search/reindex',
      method: 'GET'
    };

    return this.fetcher.fetch(fetchConfig)
      .then(() => true);
  }

}