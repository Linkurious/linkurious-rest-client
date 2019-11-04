/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  AlertPreviewResponse,
  CheckQueryResponse,
  GetAdjacentNodesResponse,
  GetStatisticsResponse,
  IAlertPreviewParams,
  ICheckQueryParams,
  IGetAdjacentNodesParams,
  IGetStatisticsParams,
  IRunQueryByContentParams,
  IRunQueryByIdParams,
  ISearchFullParams,
  ISearchParams,
  RunQueryByContentResponse,
  RunQueryByIdResponse,
  SearchFullResponse,
  SearchResponse
} from './types';

export * from './types';

// TODO make sure data-source unavailable is thrown instead of graph_unreachable
const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  NOT_FOUND,
  BAD_GRAPH_REQUEST,
  GRAPH_REQUEST_TIMEOUT,
  CONSTRAINT_VIOLATION
} = LkErrorKey;

export class GraphAPI extends Request {
  public search(params: ISearchParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      SearchResponse
    >({
      url: '/:sourceKey/search/:type',
      method: 'POST',
      params: params
    });
  }

  public searchFull(params: ISearchFullParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      SearchFullResponse
    >({
      url: '/:sourceKey/search/:type/full',
      method: 'POST',
      params: params
    });
  }

  public checkQuery(params: ICheckQueryParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<CheckQueryResponse>({
      url: '/:sourceKey/graph/check/query',
      method: 'POST',
      params: params
    });
  }

  public runQuery(params: IRunQueryByContentParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<RunQueryByContentResponse>({
      url: '/:sourceKey/graph/run/query',
      method: 'POST',
      params: params
    });
  }

  public runQueryById(params: IRunQueryByIdParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      GUEST_DISABLED,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<RunQueryByIdResponse>({
      url: '/:sourceKey/graph/run/query/:id',
      method: 'POST',
      params: params
    });
  }

  public alertPreview(params: IAlertPreviewParams) {
    return this.handle(
      UNAUTHORIZED,
      DATA_SOURCE_UNAVAILABLE,
      FORBIDDEN,
      BAD_GRAPH_REQUEST,
      CONSTRAINT_VIOLATION,
      GRAPH_REQUEST_TIMEOUT
    ).request<AlertPreviewResponse>({
      url: '/:sourceKey/graph/alertPreview',
      method: 'POST',
      params: params
    });
  }

  public getStatistics(params: IGetStatisticsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND).request<
      GetStatisticsResponse
    >({
      url: '/:sourceKey/graph/neighborhood/statistics',
      method: 'POST',
      params: params
    });
  }

  public getAdjacentNodes(params: IGetAdjacentNodesParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, NOT_FOUND).request<
      GetAdjacentNodesResponse
    >({
      url: '/:sourceKey/graph/nodes/expand',
      method: 'POST',
      params: params
    });
  }
}
