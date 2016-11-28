/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-10-03.
 *
 * File:
 * Description :
 */
'use strict';
import { Module } from './Module';
import {
  IMatch,
  IMatchAction,
  IAlert,
  IMatchResults,
  IDataSourceRelative, IQueryAlert, IFilteredAlert, IAddActionMatch
} from '../../index';
import { Fetcher } from '../http/fetcher';

export class AlertModule extends Module {

  /**
   *
   * @param {Fetcher} fetcher
   */
  constructor ( fetcher:Fetcher ) {
    super(fetcher);
  }

  /**
   * get list of alerts
   * @param {IDataSourceRelative} data
   * @returns {Promise<IAlert>}
   */
  public getAlerts ( data:IDataSourceRelative ):Promise<Array<IAlert>> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/alerts',
        method: 'GET',
        query : this.setDataSourceKey(data.dataSourceKey)
      }
    );
  }

  /**
   * get an alert
   * @param {IAlert} data
   * @returns {Promise<IMatch>}
   */
  public getAlert ( data:IQueryAlert ):Promise<IMatch> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/alerts/{id}',
        method: 'GET',
        query : data
      }
    );
  }

  /**
   * get matches for an alert
   * @param {IFilteredAlert} data
   * @returns {Promise<IMatchResults>}
   */
  public getMatches ( data:IFilteredAlert ):Promise<IMatchResults> {
    return this.fetch(
      {
        url   : '/{dataSourceKey}/alerts/{id}/matches',
        method: 'GET',
        query : data
      }
    );
  }

  /**
   * Do an action on a match
   * @param {IAddActionMatch} data
   * @returns {Promise<boolean>}
   */
  public addActionToMatch ( data:IAddActionMatch ):Promise<boolean> {
    let body:any = {
      dataSource: data.dataSourceKey,
      id        : data.id,
      action    : data.action
    };

    return this.fetch(
      {
        url   : `/{dataSourceKey}/alerts/{id}/matches/${data.matchId}/action`,
        method: 'POST',
        body  : body
      }
    ).then(() => true);
  }

  /**
   * get a match
   * @param {IMatch} data
   * @returns {Promise<IMatch>}
   */
  public getMatch ( data:IMatch ):Promise<IMatch> {
    return this.fetch(
      {
        url   : `/{dataSourceKey}/alerts/{id}/matches/${data.matchId}`,
        method: 'GET',
        body  : data
      }
    );
  }

  /**
   * get all actions for a match
   * @param {IMatch} data
   * @returns {Promise<IMatchAction>}
   */
  public getMatchActions ( data:IMatch ):Promise<Array<IMatchAction>> {
    return this.fetch(
      {
        url   : `/{dataSourceKey}/alerts/{id}/matches/${data.matchId}/actions`,
        method: 'GET',
        body  : data
      }
    );
  }
}
