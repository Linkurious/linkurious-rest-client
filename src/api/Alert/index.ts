/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {
  ConnectionRefusedError,
  DataSourceUnavailableError,
  FeatureDisabledError,
  ForbiddenError,
  LkErrorKey,
  NotFoundError,
  UnauthorizedError,
  Response
} from '../../http/response';
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
  GetMatchesResponse,
  IGetMatchActionsResponse
} from './types';

export * from './types';

const {
  FEATURE_DISABLED,
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  FORBIDDEN,
  NOT_FOUND,
  BAD_GRAPH_REQUEST,
  GRAPH_REQUEST_TIMEOUT,
  CONSTRAINT_VIOLATION,
  FOLDER_DELETION_FAILED,
  ALREADY_EXISTS
} = LkErrorKey;

export class AlertAPI extends Request {
  /**
   * Create a new alert. If `matchTTL` is set to 0, unconfirmed matches
   * will disappear when they stop matching the alert query.
   */
  public createAlert(this: Request<Alert>, params: ICreateAlertParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/admin/:sourceKey/alerts',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update the alert selected by id.
   * Updating an alert query will results in all the previous detected matches deleted.
   */
  public updateAlert(this: Request<Alert>, params: IUpdateAlertParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/admin/:sourceKey/alerts/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete the alert by id and all its matches.
   */
  public deleteAlert(params: IDeleteAlertParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/admin/:sourceKey/alerts/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Create an alert folder.
   */
  public createAlertFolder(this: Request<AlertFolder>, params: ICreateAlertFolderParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, ALREADY_EXISTS],
      url: '/admin/:sourceKey/alerts/folder',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an alert folder.
   */
  public updateAlertFolder(this: Request<AlertFolder>, params: IUpdateAlertFolderParams) {
    return this.request({
      errors: [
        FEATURE_DISABLED,
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        ALREADY_EXISTS
      ],
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete an alert folder.
   */
  public deleteAlertFolder(params: IDeleteAlertFolderParams) {
    return this.request({
      errors: [
        FEATURE_DISABLED,
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        NOT_FOUND,
        FOLDER_DELETION_FAILED
      ],
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the alerts and the alert folders in a tree structure.
   */
  public getAlertTree(this: Request<AlertTree>, params?: IDataSourceParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/:sourceKey/alerts/tree',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get an alert by id.
   */
  public getAlert(this: Request<Alert>, params: IGetAlertParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:id',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get a match by id.
   */
  public getMatch(this: Request<Match>, params: IGetMatchParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/matches/:matchId',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the matches of an alert.
   */
  public getMatches(this: Request<GetMatchesResponse>, params: IGetMatchesParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/matches',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get all the actions of a match ordered by creation date. Recent ones first.
   * The offset defaults to 0 and the limit defaults to 10.
   */
  public getMatchActions(this: Request<IGetMatchActionsResponse>, params: IGetMatchActionsParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/matches/:matchId/actions',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the last created action of a match if any.
   */
  public async getLastMatchAction(
    params: Pick<IGetMatchActionsParams, 'alertId' | 'matchId' | 'sourceKey'>
  ): Promise<
    | Response<MatchAction | null>
    | Response<FeatureDisabledError>
    | Response<UnauthorizedError>
    | Response<DataSourceUnavailableError>
    | Response<ForbiddenError>
    | Response<NotFoundError>
    | Response<ConnectionRefusedError>
  > {
    const matchActions = await this.getMatchActions({
      ...params,
      offset: 0,
      limit: 1
    });
    if (!matchActions.isSuccess()) {
      return matchActions;
    }
    return new Response({
      status: matchActions.status,
      header: matchActions.header,
      body: matchActions.body[0] as MatchAction | null
    });
  }

  /**
   * Do an action (open, dismiss, confirm, unconfirm) on a match.
   */
  public doMatchAction(this: Request<MatchAction>, params: IDoMatchActionParams) {
    return this.request({
      errors: [FEATURE_DISABLED, UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/alerts/:alertId/matches/:matchId/action',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the nodes and edges matching the given graph query.
   * An array of subgraphs, one for each subgraph matching the graph query, is returned.
   */
  public alertPreview(this: Request<AlertPreview>, params: IAlertPreviewParams) {
    return this.request({
      errors: [
        FEATURE_DISABLED,
        UNAUTHORIZED,
        DATA_SOURCE_UNAVAILABLE,
        FORBIDDEN,
        BAD_GRAPH_REQUEST,
        GRAPH_REQUEST_TIMEOUT,
        CONSTRAINT_VIOLATION
      ],
      url: '/:sourceKey/graph/alertPreview',
      method: 'POST',
      params: params
    });
  }
}
