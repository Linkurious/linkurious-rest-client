/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {IDataSourceParams} from '../commonTypes';

import {
  AlertTree,
  ICreateAlertFolderParams,
  ICreateAlertParams,
  IDeleteAlertFolderParams,
  IDeleteAlertParams,
  IDoMatchActionParams,
  IGetAlertParams,
  IGetMatchActionsParams,
  IGetMatchesParams,
  IGetMatchParams,
  IUpdateAlertFolderParams,
  IUpdateAlertParams,
  AlertPreview,
  IAlertPreviewParams,
  Alert,
  AlertFolder,
  MatchAction,
  Match,
  GetMatchesResponse
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  FORBIDDEN,
  NOT_FOUND,
  BAD_GRAPH_REQUEST,
  GRAPH_REQUEST_TIMEOUT,
  CONSTRAINT_VIOLATION
} = LkErrorKey;

export class AlertAPI extends Request {
  /**
   * Create a new alert. If `matchTTL` is set to 0, unconfirmed matches
   * will disappear when they stop matching the alert query.
   */
  public createAlert(params: ICreateAlertParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<Alert>({
      url: '/admin/:sourceKey/alerts',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update the alert selected by id.
   * Updating an alert query will results in all the previous detected matches deleted.
   */
  public updateAlert(params: IUpdateAlertParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<Alert>({
      url: '/admin/:sourceKey/alerts/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete the alert by id and all its matches.
   */
  public deleteAlert(params: IDeleteAlertParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/alerts/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Create an alert folder.
   */
  public createAlertFolder(params: ICreateAlertFolderParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<AlertFolder>({
      url: '/admin/:sourceKey/alerts/folder',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an alert folder.
   */
  public updateAlertFolder(params: IUpdateAlertFolderParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      AlertFolder
    >({
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete an alert folder.
   */
  public deleteAlertFolder(params: IDeleteAlertFolderParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the alerts and the alert folders in a tree structure.
   */
  public getAlertTree(params?: IDataSourceParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<AlertTree>({
      url: '/:sourceKey/alerts/tree',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get an alert by id.
   */
  public getAlert(params: IGetAlertParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<Alert>({
      url: '/:sourceKey/alerts/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get a match by id.
   */
  public getMatch(params: IGetMatchParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<Match>({
      url: '/:sourceKey/alerts/:alertId/matches/:matchId',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the matches of an alert.
   */
  public getMatches(params: IGetMatchesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      GetMatchesResponse
    >({
      url: '/:sourceKey/alerts/:alertId/matches',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the actions of a match ordered by creation date.
   */
  public getMatchActions(params: IGetMatchActionsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      MatchAction[]
    >({
      url: '/:sourceKey/alerts/:alertId/matches/:matchId/actions',
      method: 'GET',
      params: params
    });
  }

  /**
   * Do an action (open, dismiss, confirm, unconfirm) on a match.
   */
  public doMatchAction(params: IDoMatchActionParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/:sourceKey/alerts/:alertId/matches/:matchId/action',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given graph query.
   * An array of subgraphs, one for each subgraph matching the graph query, is returned.
   */
  public alertPreview(params: IAlertPreviewParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      GRAPH_REQUEST_TIMEOUT,
      CONSTRAINT_VIOLATION
    ).request<AlertPreview>({
      url: '/:sourceKey/graph/alertPreview',
      method: 'POST',
      params: params
    });
  }
}
