/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * Created on 2016-10-03.
 */

// TODO TS2019

import {
  Forbidden,
  IAlert,
  IMatch,
  IMatchAction,
  IMatchResults,
  Success,
  Unauthorized
} from '../../index';
import {
  ICreateAlertFolderParams,
  ICreateAlertFolderResponse,
  IDeleteAlertFolderParams,
  IGetAlertTreeParams,
  IGetAlertTreeResponse,
  IUpdateAlertFolderParams
} from '../models/Alert';
import {Module} from './Module';

export class AlertModule extends Module {
  public async createAlertFolder(
    options: ICreateAlertFolderParams
  ): Promise<Success<ICreateAlertFolderResponse> | Unauthorized | Forbidden> {
    return this.request({
      url: '/admin/{sourceKey}/alerts/folder',
      method: 'POST',
      body: options,
      path: {
        sourceKey: options.sourceKey
      },
      mock: true,
      mockValue: {
        id: 1,
        sourceKey: '1234',
        title: options.title,
        parent: -1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    });
  }

  public async updateAlertFolder(
    options: IUpdateAlertFolderParams
  ): Promise<Success<void> | Unauthorized | Forbidden> {
    return this.request({
      url: '/admin/{sourceKey}/alerts/folder/{id}',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        id: options.id
      },
      mock: true
    });
  }

  public async deleteAlertFolder(
    options: IDeleteAlertFolderParams
  ): Promise<Success<void> | Unauthorized | Forbidden> {
    return this.request({
      url: '/admin/{sourceKey}/alerts/folder/{id}',
      method: 'DELETE',
      path: {
        sourceKey: options.sourceKey,
        id: options.id
      },
      mock: true
    });
  }

  public async getAlertTree(
    options: IGetAlertTreeParams
  ): Promise<Success<IGetAlertTreeResponse> | Unauthorized | Forbidden> {
    return this.request<IGetAlertTreeResponse>({
      url: '/admin/{sourceKey}/alerts/tree',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey
      },
      mock: true,
      mockValue: {
        id: -1,
        title: 'root',
        type: 'folder',
        children: [
          {
            id: 1,
            title: 'folder 1',
            type: 'folder',
            children: [
              {
                id: 1,
                title: 'alert in folder 1',
                type: 'alert',
                columns: [],
                lastRun: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              {
                id: 2,
                title: 'alert in folder 1 bis',
                type: 'alert',
                columns: [],
                lastRun: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ]
          },
          {
            id: 2,
            title: 'folder 2',
            type: 'folder',
            children: [
              {
                id: 3,
                title: 'alert in folder 2',
                type: 'alert',
                columns: [],
                lastRun: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            ]
          },
          {
            id: 4,
            title: 'alert in root',
            type: 'alert',
            columns: [],
            lastRun: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      }
    });
  }

  // TODO TS2019 refactor under here

  /**
   * get list of alerts
   *
   * @param {string} dataSourceKey
   * @returns {Promise<IAlert>}
   */
  public getAlerts(dataSourceKey?: string): Promise<IAlert[]> {
    return this.fetch({
      url: '/{dataSourceKey}/alerts',
      method: 'GET',
      dataSource: dataSourceKey
    });
  }

  /**
   * get an alert
   *
   * @param {Object} data
   * @param {number}dataSourceKey
   * @returns {Promise<IMatch>}
   */
  public getAlert(data: {id: number}, dataSourceKey?: string): Promise<IMatch> {
    return this.fetch({
      url: '/{dataSourceKey}/alerts/{id}',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey
    });
  }

  /**
   * get matches for an alert
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IMatchResults>}
   */
  public getMatches(
    data: {
      id: number;
      offset?: number;
      limit?: number;
      sort_direction?: 'asc' | 'desc';
      sort_by?: string;
      status?: 'unconfirmed' | 'confirmed' | 'dismissed';
    },
    dataSourceKey?: string
  ): Promise<IMatchResults> {
    return this.fetch({
      url: '/{dataSourceKey}/alerts/{id}/matches',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey
    });
  }

  /**
   * Do an action on a match
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public addActionToMatch(
    data: {
      alertId: number;
      action: string;
      matchId: number;
    },
    dataSourceKey?: string
  ): Promise<boolean> {
    return this.fetch({
      url: `/{dataSourceKey}/alerts/${data.alertId}/matches/${data.matchId}/action`,
      method: 'POST',
      body: {action: data.action},
      dataSource: dataSourceKey
    });
  }

  /**
   * get a match
   *
   * @param {Object}data
   * @param {string}dataSourceKey
   * @returns {Promise<IMatch>}
   */
  public getMatch(
    data: {
      alertId: number;
      matchId: number;
    },
    dataSourceKey?: string
  ): Promise<IMatch> {
    return this.fetch({
      url: `/{dataSourceKey}/alerts/${data.alertId}/matches/${data.matchId}`,
      method: 'GET',
      dataSource: dataSourceKey
    });
  }

  /**
   * get all actions for a match
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<IMatchAction>}
   */
  public getMatchActions(
    data: {
      alertId: number;
      matchId: number;
    },
    dataSourceKey?: string
  ): Promise<IMatchAction[]> {
    return this.fetch({
      url: `/{dataSourceKey}/alerts/${data.alertId}/matches/${data.matchId}/actions`,
      method: 'GET',
      dataSource: dataSourceKey
    });
  }
}
