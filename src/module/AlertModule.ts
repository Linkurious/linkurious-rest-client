/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-10-03.
 */

// TODO TS2019

import {
  DataSourceUnavailable,
  Forbidden,
  IMatch,
  IMatchAction,
  IMatchResults,
  NotFound,
  Success,
  Unauthorized
} from '../../index';
import {
  ICreateAlertFolderParams,
  ICreateAlertFolderResponse,
  IDeleteAlertFolderParams,
  IGetAlertParams,
  IGetAlertResponse,
  IGetAlertTreeParams,
  IGetAlertTreeResponse,
  IUpdateAlertFolderParams
} from '../models/Alert';
import {Module} from './Module';

export class AlertModule extends Module {
  public async createAlertFolder(
    options: ICreateAlertFolderParams
  ): Promise<
    Success<ICreateAlertFolderResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/admin/{sourceKey}/alerts/folder',
      method: 'POST',
      body: options,
      path: {
        sourceKey: options.sourceKey
      }
    });
  }

  public async updateAlertFolder(
    options: IUpdateAlertFolderParams
  ): Promise<Success<void> | Unauthorized | Forbidden | NotFound | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/alerts/folder/{id}',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        id: options.id
      }
    });
  }

  public async deleteAlertFolder(
    options: IDeleteAlertFolderParams
  ): Promise<Success<void> | Unauthorized | Forbidden | NotFound | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/alerts/folder/{id}',
      method: 'DELETE',
      path: {
        sourceKey: options.sourceKey,
        id: options.id
      }
    });
  }

  public async getAlertTree(
    options: IGetAlertTreeParams
  ): Promise<Success<IGetAlertTreeResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request<IGetAlertTreeResponse>({
      url: '/{sourceKey}/alerts/tree',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey
      }
    });
  }

  public async getAlert(
    options: IGetAlertParams
  ): Promise<Success<IGetAlertResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request<IGetAlertResponse>({
      url: '/{sourceKey}/alerts/{id}',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey,
        id: options.id
      }
    });
  }

  // TODO TS2019 refactor under here

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
      url: '/{sourceKey}/alerts/{id}/matches',
      method: 'GET',
      query: data,
      path: {sourceKey: dataSourceKey}
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
      url: `/{sourceKey}/alerts/${data.alertId}/matches/${data.matchId}/action`,
      method: 'POST',
      body: {action: data.action},
      path: {sourceKey: dataSourceKey}
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
      url: `/{sourceKey}/alerts/${data.alertId}/matches/${data.matchId}`,
      method: 'GET',
      path: {sourceKey: dataSourceKey}
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
      url: `/{sourceKey}/alerts/${data.alertId}/matches/${data.matchId}/actions`,
      method: 'GET',
      path: {sourceKey: dataSourceKey}
    });
  }
}
