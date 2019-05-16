/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-10-03.
 *
 * File:
 * Description :
 */

import {IAlert, IMatch, IMatchAction, IMatchResults} from '../../index';
import {ErrorListener} from '../errorListener';
import {Fetcher} from '../http/fetcher';
import {Transformer} from '../transformer';
import {Module} from './Module';

export class AlertModule extends Module {
  constructor(fetcher: Fetcher, transformer: Transformer, errorListener: ErrorListener) {
    super(fetcher, transformer, errorListener);
  }

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
