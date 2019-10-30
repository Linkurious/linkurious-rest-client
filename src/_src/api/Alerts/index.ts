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
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<void>({
      url: '/admin/:sourceKey/alerts/:id',
      method: 'DELETE',
      params: params
    });
  }

  public CreateAlertFolder(params: ICreateAlertFolderParams) {
    return this.handle().request<CreateAlertFolderResponse>({
      url: '/admin/:sourceKey/alerts/folder',
      method: 'POST',
      params: params
    });
  }

  public UpdateAlertFolder(params: IUpdateAlertFolderParams) {
    return this.handle().request<UpdateAlertFolderResponse>({
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'PATCH',
      params: params
    });
  }

  public DeleteAlertFolder(params: IDeleteAlertFolderParams) {
    return this.handle().request<void>({
      url: '/admin/:sourceKey/alerts/folder/:id',
      method: 'DELETE',
      params: params
    });
  }

  public GetAlertTree(params?: IGetAlertTreeParams) {
    return this.handle().request<GetAlertTreeResponse>({
      url: '/:sourceKey/alerts/tree',
      method: 'GET',
      params: params
    });
  }

  public GetAlert(params: IGetAlertParams) {
    return this.handle().request<GetAlertResponse>({
      url: '/:sourceKey/alerts/:id',
      method: 'GET',
      params: params
    });
  }

  public GetMatch(params: IGetMatchParams) {
    return this.handle().request<GetMatchResponse>({
      url: '/:sourceKey/alerts/:alertId/matches/:matchId',
      method: 'GET',
      params: params
    });
  }

  public GetMatches(params: IGetMatchesParams) {
    return this.handle().request<GetMatchesResponse>({
      url: '/:sourceKey/alerts/:alertId/matches',
      method: 'GET',
      params: params
    });
  }

  public GetMatchActions(params: IGetMatchActionsParams) {
    return this.handle().request<GetMatchActionsResponse>({
      url: '/:sourceKey/alerts/:alertId/matches/:matchId/actions',
      method: 'GET',
      params: params
    });
  }

  public DoMatchAction(params: IDoMatchActionParams) {
    return this.handle().request<void>({
      url: '/:sourceKey/alerts/:alertId/matches/:matchId/action',
      method: 'POST',
      params: params
    });
  }
}
