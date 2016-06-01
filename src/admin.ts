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

  constructor(linkuriousInst){
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
      url : '/admin/source/' + sourceIndex + '/connect',
      method : 'POST'
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
      url : '/admin/sources/config',
      method : 'POST',
      data : data
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
      url : '/admin/sources/config/' + sourceIndex,
      method : 'DELETE'
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
      url : '/admin/sources/data/' + data.sourceKey,
      method : 'DELETE',
      data : Utils.fixSnakeCase(mergeOptions)
    };

    return this.fetcher.fetch(fetchConfig);
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   *
   * @returns {Promise<Array<Source.adminModel>>}
   */
  public getDataSourcesList():Promise<Array<i.Source.adminModel>> {
    return this.fetcher.fetch('GET', '/admin/sources');
  }

  /**
   * Get the list of edge-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenEdgeProperties(dataSource?:string):Promise<Array<string>> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetcher.fetch('GET', '/admin/source/' + dataSource + '/hidden/edgeProperties');
  }

  /**
   * Get the list of node-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenNodeProperties(dataSource?:string):Promise<Array<string>> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetcher.fetch('GET', '/admin/source/' + dataSource + '/hidden/nodeProperties');
  }

  /**
   * Get the list of edge-properties that re not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedEdgeProperties(dataSource?:string):Promise<Array<string>> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetcher.fetch('GET', '/admin/source/' + dataSource + '/noIndex/edgeProperties');
  }

  /**
   * Get the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedNodeProperties(dataSource?:string):Promise<Array<string>> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetcher.fetch('GET', '/admin/source/' + dataSource + '/noIndex/nodeProperties');
  }

  /**
   * Set the list of edge-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenEdgeProperties(data:i.Source.form.setProperties, dataSource?:string):Promise<boolean> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetcher.fetch('PUT', '/admin/source/' + dataSource + '/hidden/edgeProperties', data);
  }

  /**
   * Set the list of node-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenNodeProperties(data:i.Source.form.setProperties, dataSource?:string):Promise<boolean> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetcher.fetch('PUT', '/admin/source/' + dataSource + '/hidden/nodeProperties', data)
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
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetcher.fetch('PUT', '/admin/source/' + dataSource + '/noIndex/edgeProperties', data)
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
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetcher.fetch('PUT', '/admin/source/' + dataSource + '/noIndex/nodeProperties', data)
      .then(() => true);
  }

  /**
   * Add a new user to the application.
   *
   * @param data:User.form.create
   * @returns {Promise<User.model>}
   */
  public createUser(data:i.User.form.create):Promise<i.User.model> {
    return this.fetcher.fetch('POST', '/admin/users', data);
  }

  /**
   * Deletes a user in the application.
   *
   * @param userId:number
   * @returns {Promise<string>}
   */
  public deleteUser(userId:number):Promise<string> {
    return this.fetcher.fetch('DELETE', '/admin/users/' + userId)
      .then(() => 'User ' + userId + ' deleted');
  }

  /**
   * Adds a new group to the application.
   * @param data:Group.form.create
   * @returns {Promise<Group.model>}
   */
  public createGroup(data:i.Group.form.create):Promise<i.Group.model> {
    return this.fetcher.fetch('POST', 'admin/groups', data);
  }

  /**
   * Deletes a group in the application.
   *
   * @param groupId:number
   * @returns {Promise<string>}
   */
  public deleteGroup(groupId:number):Promise<string> {
    return this.fetcher.fetch('DELETE', '/admin/groups/' + groupId)
      .then(() => 'group ' + groupId + 'deleted');
  }

  /**
   * List a group already defined in the database.
   *
   * @param groupId:number
   * @returns {Promise<Group.model>}
   */
  public getGroup(groupId:number):Promise<i.Group.model> {
    return this.fetcher.fetch('GET', '/admin/groups/' + groupId);
  }

  /**
   * List all the groups already defined in the database.
   *
   * @param dataSource:string
   * @returns {Promise<Array<Group.model>>}
   */
  public getGroups(dataSource?:string):Promise<Array<i.Group.model>> {
    // todo: handle these details in the fetcher, send the optional explicit dataSource to the fetcher
    if (!dataSource) {
      dataSource = '{dataSource}';
    }

    return this.fetcher.fetch('GET', '/admin/' + dataSource + '/groups');
  }

  public getSimpleGroups():Promise<Array<i.Group.model>> {
    return this.fetcher('GET', '/admin/groups');
  }

  /**
   * Get possible targetType, type and action names.
   *
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<Group.sourceAccessRights>}
   */
  public getGroupsRights(dataSource ?:string):Promise<i.Group.sourceAccessRights> {
    // todo: see getGroupsList
    if (!dataSource) {
      dataSource = '{dataSource}';
    }

    return this.fetcher.fetch('GET', '/admin/' + dataSource + '/groups/rights_info');
  }
  
  /**
   * Bulk-set rights for a whole targetType on one or many groups.
   *
   * @param data:Group.form.batchRights
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<boolean>}
   */
  public updateBatchGroupsRights(data:i.Group.form.batchRights, dataSource?:string):Promise<boolean> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }

    return this.fetcher.fetch('PUT', '/admin/' + dataSource + '/groups/group_rights', data)
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
    if (!dataSource) {
      dataSource = '{dataSource}';
    }

    return this.fetcher.fetch('PUT', '/admin/' + dataSource + 'groups/' + groupId + '/group_rights', data);
  }

  /**
   * Patches users in the application. Beware, if all the groups for a given user are deleted, the user is added to the default group.
   *
   * @param data:User.form.batch
   * @returns {Promise<boolean>}
   */
  public updateBatchUser(data:i.User.form.batch):Promise<boolean> {
    return this.fetcher.fetch('PATCH', '/admin/users', data)
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
    return this.fetcher.fetch('PATCH', '/admin/users/' + userId, data);
  }

  /**
   * Sets the configuration of the application
   *
   * @param data:Interface.Form.config.update
   * @returns {Promise<string>}
   */
  public updateConfig(data:i.App.form.update):Promise<string> {
    return this.fetcher.fetch('POST', '/config', data);
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @returns {Promise<boolean>}
   */
  public startIndexation():Promise<boolean> {
    return this.fetcher.fetch('GET', '/{dataSource}/search/reindex')
      .then(() => true);
  }

}