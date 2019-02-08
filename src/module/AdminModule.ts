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
  IIndexationStatus,
  IClientState,
  IFullAdminAlert,
  ICreateDataSource,
} from '../../index';
import { Utils } from '../http/utils';
import { Logger } from './../log/Logger';
import { Module } from './Module';
import { Success } from '../response/success';
import {
  DataSourceUnavailable,
  Forbidden,
  GroupExists,
  InvalidParameter,
  NotFound,
  ServerRejection,
  Unauthorized,
} from '../response/errors';

export class AdminModule extends Module {
  private _logger: Logger;
  private _clientState: IClientState;
  private _timer: any;

  constructor(fetcher: Fetcher, logger: Logger, clientState: IClientState) {
    super(fetcher);

    this._logger = <Logger>logger;
    this._clientState = <IClientState>clientState;
  }

  /**
   * Connect a disconnected data-source
   *
   * @param {number} dataSourceIndex
   * @returns {Promise<boolean>}
   */
  public connectDataSource(dataSourceIndex?: number): Promise<any> {
    return this.fetch({
      url: '/admin/source/{dataSourceIndex}/connect',
      method: 'POST',
      dataSource: dataSourceIndex,
    });
  }

  /**
   * Create a new data-source configuration (contains a graph database configuration and an index configuration).
   *
   * @param {ICreateDataSource} data
   * @returns {Promise<boolean>}
   */
  public createDataSourceConfig(data: ICreateDataSource): Promise<any> {
    return this.fetch({
      url: '/admin/sources/config',
      method: 'POST',
      body: data,
    });
  }

  /**
   * Delete a data-source configuration that has currently no connected data-source.
   *
   * @param {number} [dataSourceIndex]
   * @returns {Promise<boolean>}
   */
  public deleteDataSourceConfig(dataSourceIndex?: number): Promise<boolean> {
    return this.fetch({
      url: '/admin/sources/config/{dataSourceIndex}',
      method: 'DELETE',
      dataSource: dataSourceIndex,
    }).then(() => true);
  }

  /**
   * Delete all data of data-source (visualizations, access-rights, widgets, full-text indexes).
   * Optionally merge visualizations and widgets into another data-source instead of deleting them.
   * Warning: when merging into another data-source, visualizations may break if node and edge IDs
   * are not the same in to target data-source.
   *
   * @param {Object} data
   * @returns {Promise<IDeletedDataSource>}
   */
  public deleteFullDataSource(data: { dataSourceKey: string; mergeInto?: string }): Promise<IDeletedDataSource> {
    let mergeOptions: any = data.mergeInto ? { mergeInto: data.mergeInto } : undefined;

    return this.fetch({
      url: '/admin/sources/data/{dataSourceKey}',
      method: 'DELETE',
      query: Utils.fixSnakeCase(mergeOptions),
      dataSource: data.dataSourceKey,
    });
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   *
   * @returns {Promise<Array<IFullDataSource>>}
   */
  public getDataSourcesList(): Promise<Array<IFullDataSource>> {
    return this.fetch({
      url: '/admin/sources',
      method: 'GET',
    });
  }

  /**
   * Get the list of edge-properties hidden for the given data-source.
   *
   * @param {string} [dataSourceKey]
   * @returns {Promise<Array<string>>}
   */
  public getHiddenEdgeProperties(dataSourceKey?: string): Promise<Array<string>> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/hidden/edgeProperties',
      method: 'GET',
      dataSource: dataSourceKey,
    });
  }

  /**
   * Get the list of node-properties hidden for the given data-source.
   *
   * @param {string} [dataSourceKey]
   * @returns {Promise<Array<string>>}
   */
  public getHiddenNodeProperties(dataSourceKey?: string): Promise<Array<string>> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/hidden/nodeProperties',
      method: 'GET',
      dataSource: dataSourceKey,
    });
  }

  /**
   * Get the list of edge-properties that re not indexed for the given data-source.
   *
   * @param {string} [dataSourceKey]
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedEdgeProperties(dataSourceKey?: string): Promise<Array<string>> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/noIndex/edgeProperties',
      method: 'GET',
      dataSource: dataSourceKey,
    });
  }

  /**
   * Get the list of node-properties that are not indexed for the given data-source.
   *
   * @param {string} [dataSourceKey]
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedNodeProperties(dataSourceKey?: string): Promise<Array<string>> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/noIndex/nodeProperties',
      method: 'GET',
      dataSource: dataSourceKey,
    });
  }

  /**
   * Set the list of edge-properties that are hidden for the given data-source.
   *
   * @param {Object} data
   * @param {string} [dataSourceKey]
   * @returns {Promise<boolean>}
   */
  public setHiddenEdgeProperties(data: { properties: Array<string> }, dataSourceKey?: string): Promise<boolean> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/hidden/edgeProperties',
      method: 'PUT',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * Set the list of node-properties that are hidden for the given data-source.
   *
   * @param {Object} data
   * @param {string} [dataSourceKey]
   * @returns {Promise<boolean>}
   */
  public setHiddenNodeProperties(data: { properties: Array<string> }, dataSourceKey?: string): Promise<boolean> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/hidden/nodeProperties',
      method: 'PUT',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * Set the list of edge-properties that are not indexed for the given data-source.
   *
   * @param {Object} data
   * @param {string} [dataSourceKey]
   * @returns {Promise<boolean>}
   */
  public setNotIndexedEdgeProperties(data: { properties: Array<string> }, dataSourceKey?: string): Promise<boolean> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/noIndex/edgeProperties',
      method: 'PUT',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * Set the list of node-properties that are not indexed for the given data-source.
   *
   * @param {Object} data
   * @param {string} [dataSourceKey]
   * @returns {Promise<boolean>}
   */
  public setNotIndexedNodeProperties(data: { properties: Array<string> }, dataSourceKey?: string): Promise<boolean> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/noIndex/nodeProperties',
      method: 'PUT',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * Add a new user to the application.
   *
   * @param {Object} data
   * @returns {Promise<IFullUser>}
   */
  public createUser(data: {
    username: string;
    email: string;
    password: string;
    groups?: Array<string | number>;
  }): Promise<IFullUser> {
    return this.fetch({
      url: '/admin/users',
      method: 'POST',
      body: data,
    });
  }

  /**
   * Deletes a user in the application.
   *
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  public deleteUser(userId: number): Promise<boolean> {
    return this.fetch({
      url: '/admin/users/{id}',
      method: 'DELETE',
      body: { id: userId },
    }).then(() => true);
  }

  /**
   * Adds a new group to the application.
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IGroup>}
   */
  public createGroup(
    data: { name: string },
    dataSourceKey?: string
  ): Promise<Success<IGroup> | Unauthorized | DataSourceUnavailable | InvalidParameter | GroupExists | Forbidden> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/groups',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response: IGroup) => new Success(response))
      .catch(
        (error) =>
          new ServerRejection(error) as
            | Unauthorized
            | DataSourceUnavailable
            | InvalidParameter
            | GroupExists
            | Forbidden
      );
  }

  /**
   * Deletes a group in the application.
   */
  public deleteGroup(
    data: {
      id: number;
    },
    dataSourceKey?: string
  ): Promise<Success<void> | Unauthorized | InvalidParameter | NotFound | Forbidden> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/groups/{id}',
      method: 'DELETE',
      body: data,
      dataSource: dataSourceKey,
    })
      .then(() => new Success(undefined))
      .catch((error) => new ServerRejection(error) as Unauthorized | InvalidParameter | NotFound | Forbidden);
  }

  /**
   * Update a group (only name)
   */
  public updateGroup(
    data: {
      id: number;
      name: string;
    },
    dataSourceKey?: string
  ): Promise<Success<void> | Unauthorized | NotFound | Forbidden | InvalidParameter> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/groups/{id}',
      method: 'PATCH',
      body: data,
      dataSource: dataSourceKey,
    })
      .then((response) => new Success(response))
      .catch((error) => new ServerRejection(error) as Unauthorized | NotFound | Forbidden | InvalidParameter);
  }

  /**
   * Get a group already defined in the database.
   */
  public getGroup(
    data: {
      id: number;
    },
    dataSourceKey?: string
  ): Promise<Success<IGroup> | Unauthorized | InvalidParameter | Forbidden | NotFound> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/groups/{id}',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: IGroup) => new Success(response))
      .catch((error) => new ServerRejection(error) as Unauthorized | InvalidParameter | Forbidden | NotFound);
  }

  /**
   * List all the groups for the current source
   */
  public getGroups(
    data: {
      withAccessRights: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<Array<IGroup>> | Unauthorized | Forbidden> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/groups',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: Array<IGroup>) => new Success(response))
      .catch((error) => new ServerRejection(error) as Unauthorized | Forbidden);
  }

  /**
   * Get possible targetType, type and action names.
   */
  public getGroupsRights(): Promise<Success<IGroupRights> | Unauthorized | Forbidden> {
    return this.fetch({
      url: '/admin/groups/rights_info',
      method: 'GET',
    })
      .then((response: IGroupRights) => new Success(response))
      .catch((error) => new ServerRejection(error) as Unauthorized | Forbidden);
  }

  /**
   * set access rights for a group
   */
  public setGroupAccessRights(
    data: {
      id: number;
      accessRights: Array<{ type: string; targetType: string; targetName: string }>;
    },
    dataSourceKey?: string
  ): Promise<Success<void> | Unauthorized | InvalidParameter | NotFound | Forbidden> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/groups/{id}/access_rights',
      method: 'PUT',
      body: data,
      dataSource: dataSourceKey,
    })
      .then(() => new Success(undefined))
      .catch((error) => new ServerRejection(error) as Unauthorized | InvalidParameter | NotFound | Forbidden);
  }

  /**
   * Patches a user in the application
   *
   * @param {Object} data
   * @returns {Promise<IFullUser>}
   */
  public updateUser(data: {
    id: number;
    username?: string;
    email?: string;
    password?: string;
    preferences?: any;
    addedGroups?: Array<number>;
    removedGroups?: Array<number>;
  }): Promise<IFullUser> {
    return this.fetch({
      url: '/admin/users/{id}',
      method: 'PATCH',
      body: data,
    });
  }

  /**
   * Sets the configuration of the application
   *
   * @param {Object} data
   * @returns {Promise<string>}
   */
  public updateConfig(data: {
    path?: string;
    configuration?: any;
    dataSourceIndex?: number;
    reset?: boolean;
  }): Promise<string> {
    let query: any = {
      reset: data.reset,
      sourceIndex: data.dataSourceIndex,
    };

    let body: any = {
      path: data.path,
      configuration: data.configuration,
    };

    return this.fetch({
      url: '/config',
      method: 'POST',
      body: body,
      query: query,
    });
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @returns {Promise<boolean>}
   */
  public startIndexation(): Promise<boolean> {
    return this.fetch({
      url: '/{dataSourceKey}/search/reindex',
      method: 'GET',
    });
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @param {string} dataSourceKey
   * @returns {Promise<IIndexationStatus>}
   */
  public getIndexationStatus(dataSourceKey?: string): Promise<IIndexationStatus> {
    return this.fetch({
      url: '/{dataSourceKey}/search/status',
      method: 'GET',
      dataSource: dataSourceKey,
    });
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
  public processIndexation(
    timeout: number,
    callback?: (res: IIndexationStatus) => void,
    keepWhenSourceChange?: boolean
  ): Promise<boolean> {
    clearTimeout(this._timer);
    let minTimeout: number = 200;
    const maxTimeout: number = 3000;

    if (this._logger.level === 'debug') {
      minTimeout = 50;
    }

    if (timeout < minTimeout) {
      timeout = 200;
    }

    if (timeout > maxTimeout) {
      timeout = 3000;
    }

    return this.listenIndexation(this._clientState.currentSource.key, timeout, callback, keepWhenSourceChange);
  }

  /**
   * Create and return new alert
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IFullAdminAlert>}
   */
  public createAlert(
    data: {
      title?: string;
      query?: string;
      dialect?: string;
      enabled?: boolean;
      cron?: string;
      matchTTL?: number;
      scoreColumn?: string;
      scoreDirection?: string;
      maxMatches?: number;
      maxRuntime?: number;
    },
    dataSourceKey?: string
  ): Promise<IFullAdminAlert> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/alerts',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * update existing alert
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IFullAdminAlert>}
   */
  public updateAlert(
    data: {
      id: number;
      title?: string;
      query?: string;
      dialect?: string;
      enabled?: boolean;
      cron?: string;
      matchTTL?: number;
      scoreColumn?: string;
      scoreDirection?: string;
      maxMatches?: number;
      maxRuntime?: number;
    },
    dataSourceKey?: string
  ): Promise<IFullAdminAlert> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/alerts/{id}',
      method: 'PATCH',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * delete existing alert
   *
   * @param {Object} data
   * @param {string} dataSourceKey
   * @returns {Promise<boolean>}
   */
  public deleteAlert(
    data: {
      id: number;
    },
    dataSourceKey?: string
  ): Promise<boolean> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/alerts/{id}',
      method: 'DELETE',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * get list of all alerts
   *
   * @param {string} dataSourceKey
   * @returns {Promise<IFullAdminAlert>}
   */
  public getAlerts(dataSourceKey?: string): Promise<Array<IFullAdminAlert>> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/alerts',
      method: 'GET',
      dataSource: dataSourceKey,
    });
  }

  /**
   * get an alert
   *
   * @param {Object} data
   * @param {string} dataSourceKey
   * @returns {Promise<IFullAdminAlert>}
   */
  public getAlert(
    data: {
      id: number;
    },
    dataSourceKey?: string
  ): Promise<IFullAdminAlert> {
    return this.fetch({
      url: '/admin/{dataSourceKey}/alerts/{id}',
      method: 'GET',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * reset all default styles for a dataSource
   *
   * @param {Object} data
   * @param {number}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public resetDefaults(
    data: {
      design?: boolean;
      captions?: boolean;
    },
    dataSourceKey?: string
  ): Promise<void> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/resetDefaults',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * reset all default styles for a dataSource
   *
   * @param {Object} data
   * @param {number}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public setDefaults(
    data: {
      styles?: { node: Array<any>; edge: Array<any> };
      captions?: {
        node: { [key: string]: { active: boolean; displayName: boolean; properties: Array<string> } };
        edge: { [key: string]: { active: boolean; displayName: boolean; properties: Array<string> } };
      };
    },
    dataSourceKey?: string
  ): Promise<void> {
    return this.fetch({
      url: '/admin/source/{dataSourceKey}/setDefaults',
      method: 'POST',
      body: data,
      dataSource: dataSourceKey,
    });
  }

  /**
   * check if an indexation is currently running
   *
   * @returns {Promise<any>}
   */
  public checkIndexation(): Promise<any> {
    return this.getIndexationStatus();
  }

  /**
   * @callback IIndexationCallback
   * @param {IIndexationStatus} responseStatus
   */

  /**
   * return true when indexation if finished, else launch callback.
   *
   * @param {string} sourceKey
   * @param {number} timeout
   * @param {IIndexationCallback} [callback]
   * @returns {Promise<boolean>}
   */
  private listenIndexation(
    sourceKey: string,
    timeout: number,
    callback?: (res: IIndexationStatus) => void,
    keepWhenSourceChange?: boolean
  ): Promise<any> {
    if (keepWhenSourceChange) {
      return this.getIndexationStatus().then((res: IIndexationStatus) => {
        if (res.indexing !== 'done') {
          if (callback) {
            callback(res);
          }

          return new Promise((resolve: any) => {
            this._timer = setTimeout(() => {
              return resolve();
            }, timeout);
          }).then(() => this.listenIndexation(sourceKey, timeout, callback, keepWhenSourceChange));
        } else {
          return res;
        }
      });
    } else {
      if (this._clientState.currentSource.key === sourceKey) {
        return this.getIndexationStatus().then((res: IIndexationStatus) => {
          if (res.indexing !== 'done') {
            if (callback) {
              callback(res);
            }

            return new Promise((resolve: any) => {
              setTimeout(() => {
                return resolve();
              }, timeout);
            }).then(() => this.listenIndexation(sourceKey, timeout, callback, keepWhenSourceChange));
          } else {
            return res;
          }
        });
      } else {
        return Promise.resolve('source change during indexation');
      }
    }
  }
}
