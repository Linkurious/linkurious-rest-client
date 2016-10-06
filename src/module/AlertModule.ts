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
import {Module} from './Module';
import {IFullAlert, IMatchAction, IAlert, IMatchesResults} from '../interfaces';
import {Fetcher} from '../http/fetcher';
import * as Query from '../Query';
import {IDataSourceRelative} from '../../dist-es6/src/interfaces';

export class AlertModule extends Module {

  /**
   *
   * @param {Fetcher} fetcher
   */
  constructor(fetcher:Fetcher) {
    super(fetcher);
  }

  /**
   * get list of alerts
   * @param {IDataSourceRelative} data
   * @returns {Promise<IAlert>}
   */
  public getAlerts(data:IDataSourceRelative):Promise<Array<IAlert>> {
    return this.fetch({
      url : '/{dataSourceKey}/alerts',
      method : 'GET',
      query : this.setDataSourceKey(data.dataSourceKey)
    });
  }

  /**
   * get an alert
   * @param {IAlert} data
   * @returns {Promise<IFullAlert>}
   */
  public getAlert(data:Query.IAlert):Promise<IFullAlert> {
    return this.fetch({
      url : '/{dataSourceKey}/alerts/{id}',
      method : 'GET',
      query : data
    });
  }

  /**
   * get matches for an alert
   * @param {IFilteredAlert} data
   * @returns {Promise<IMatchesResults>}
   */
  public getMatches(data:Query.IFilteredAlert):Promise<IMatchesResults> {
    return this.fetch({
      url : '/{dataSourceKey}/alerts/{id}/matches',
      method : 'GET',
      query : data
    });
  }

  /**
   * Do an action on a match
   * @param {IAddActionMatch} data
   * @returns {Promise<boolean>}
   */
  public addActionToMatch(data:Query.IAddActionMatch):Promise<boolean> {
    let body:any = {
      dataSource : data.dataSourceKey,
      id : data.id,
      action : data.action
    };

    return this.fetch({
      url : `/{dataSourceKey}/alerts/{id}/matches/${data.matchId}/action`,
      method : 'POST',
      body : body
    }).then(() => true);
  }

  /**
   * get a match
   * @param {IMatch} data
   * @returns {Promise<IFullAlert>}
   */
  public getMatch(data:Query.IMatch):Promise<IFullAlert> {
    return this.fetch({
      url : `/{dataSourceKey}/alerts/{id}/matches/${data.matchId}`,
      method : 'GET',
      body : data
    });
  }

  /**
   * get all actions for a match
   * @param {IMatch} data
   * @returns {Promise<IMatchAction>}
   */
  public getMatchActions(data:Query.IMatch):Promise<Array<IMatchAction>> {
    return this.fetch({
      url : `/{dataSourceKey}/alerts/{id}/matches/${data.matchId}/actions`,
      method : 'GET',
      body : data
    });
  }
}
