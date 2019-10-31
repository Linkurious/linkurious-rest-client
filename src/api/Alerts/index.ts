/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CreateAlertFolderResponse,
  CreateAlertResponse,
  GetAlertResponse,
  GetAlertTreeResponse,
  GetMatchActionsResponse,
  GetMatchesResponse,
  GetMatchResponse,
  ICreateAlertFolderParams,
  ICreateAlertParams,
  IDeleteAlertFolderParams,
  IDeleteAlertParams,
  IDoMatchActionParams,
  IGetAlertParams,
  IGetAlertTreeParams,
  IGetMatchActionsParams,
  IGetMatchesParams,
  IGetMatchParams,
  IUpdateAlertFolderParams,
  IUpdateAlertParams,
  UpdateAlertFolderResponse,
  UpdateAlertResponse
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class AlertsAPI extends Request {
  public createAlert(params: ICreateAlertParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      CreateAlertResponse
    >({
      url: '/admin/:sourceKey/alerts',
      method: 'POST',
      params: params
    });
  }

  public updateAlert(params: IUpdateAlertParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      UpdateAlertResponse
    >({
      url: '/admin/:sourceKey/alerts/:id',
      method: 'PATCH',
      params: params
    });
  }

  public deleteAlert(params: IDeleteAlertParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/alerts/:id',
      method: 'DELETE',
      params: params
    });
  }

  public createAlertFolder(params: ICreateAlertFolderParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      CreateAlertFolderResponse
    >({
      url: '/admin/:sourceKey/alerts/folder',
      method: 'POST',
      params: params
    });
  }

  public updateAlertFolder(params: IUpdateAlertFolderParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      UpdateAlertFolderResponse
    >({
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'PATCH',
      params: params
    });
  }

  public deleteAlertFolder(params: IDeleteAlertFolderParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'DELETE',
      params: params
    });
  }

  public getAlertTree(params?: IGetAlertTreeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      GetAlertTreeResponse
    >({
      url: '/:sourceKey/alerts/tree',
      method: 'GET',
      params: params
    });
  }

  public getAlert(params: IGetAlertParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      GetAlertResponse
    >({
      url: '/:sourceKey/alerts/:id',
      method: 'GET',
      params: params
    });
  }

  public getMatch(params: IGetMatchParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      GetMatchResponse
    >({
      url: '/:sourceKey/alerts/:alertId/matches/:matchId',
      method: 'GET',
      params: params
    });
  }

  public getMatches(params: IGetMatchesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      GetMatchesResponse
    >({
      url: '/:sourceKey/alerts/:alertId/matches',
      method: 'GET',
      params: params
    });
  }

  public GetMatchActions(params: IGetMatchActionsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      GetMatchActionsResponse
    >({
      url: '/:sourceKey/alerts/:alertId/matches/:matchId/actions',
      method: 'GET',
      params: params
    });
  }

  public doMatchAction(params: IDoMatchActionParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/:sourceKey/alerts/:alertId/matches/:matchId/action',
      method: 'POST',
      params: params
    });
  }
}
