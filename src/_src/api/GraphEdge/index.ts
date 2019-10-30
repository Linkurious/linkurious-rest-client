/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CreateEdgeResponse,
  GetEdgeCountResponse,
  GetEdgeResponse,
  ICreateEdgeParams,
  IDeleteEdgeParams,
  IGetEdgeCountParams,
  IGetEdgeParams,
  IUpdateEdgeParams,
  UpdateEdgeResponse
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class GraphEdgeAPI extends Request {
  public getEdge(params: IGetEdgeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND).request<GetEdgeResponse>({
      url: '/:sourceKey/graph/edges/:id',
      method: 'GET',
      params: params
    });
  }

  public createEdge(params: ICreateEdgeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      CreateEdgeResponse
    >({
      url: '/:sourceKey/graph/edges',
      method: 'POST',
      params: params
    });
  }

  public updateEdge(params: IUpdateEdgeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      UpdateEdgeResponse
    >({
      url: '/:sourceKey/graph/edges/:id',
      method: 'PATCH',
      params: params
    });
  }

  public deleteEdge(params: IDeleteEdgeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<void>({
      url: '/:sourceKey/graph/edges/:id',
      method: 'DELETE',
      params: params
    });
  }

  public getEdgeCount(params?: IGetEdgeCountParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE).request<GetEdgeCountResponse>({
      url: '/:sourceKey/graph/edges/count',
      method: 'GET',
      params: params
    });
  }
}
