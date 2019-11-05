/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  ICreatePropertyParams,
  CreatePropertyResponse,
  ICreateTypeParams,
  CreateTypeResponse,
  IGetNonIndexedPropertiesParams,
  IGetNonIndexedPropertiesResponse,
  IGetSamplingStatusParams,
  GetSamplingStatusResponse,
  IGetSimpleSchemaParams,
  GetSimpleSchemaResponse,
  IGetTypesParams,
  GetTypesResponse,
  IGetTypesWithAccessParams,
  GetTypesWithAccessResponse,
  ISetNonIndexedPropertiesParams,
  IStartSchemaSamplingParams,
  IStopSchemaSamplingParams,
  IUpdatePropertyParams,
  IUpdateSchemaSettingsParams,
  IUpdateTypeParams
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class GraphSchemaAPI extends Request {
  public async startSchemaSampling(params: IStartSchemaSamplingParams) {
    return this.handle(DATA_SOURCE_UNAVAILABLE).request({
      url: '/admin/:sourceKey/schema/sampling/start',
      method: 'POST',
      params: params
    });
  }

  public async getSamplingStatus(params?: IGetSamplingStatusParams) {
    return this.handle(DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<GetSamplingStatusResponse>({
      url: '/:sourceKey/schema/sampling/status',
      method: 'GET',
      params: params
    });
  }

  public async stopSchemaSampling(params?: IStopSchemaSamplingParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request({
      url: '/admin/:sourceKey/schema/sampling/stop',
      method: 'POST',
      params: params
    });
  }

  public async createType(params: ICreateTypeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      CreateTypeResponse
    >({
      url: '/admin/:sourceKey/graph/schema/:entityType/types',
      method: 'POST',
      params: params
    });
  }

  public async updateType(params: IUpdateTypeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/graph/schema/:entityType/types',
      method: 'PATCH',
      params: params
    });
  }

  public async createProperty(params: ICreatePropertyParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      CreatePropertyResponse
    >({
      url: '/admin/:sourceKey/graph/schema/:entityType/properties',
      method: 'POST',
      params: params
    });
  }

  public async updateProperty(params: IUpdatePropertyParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/graph/schema/:entityType/properties',
      method: 'PATCH',
      params: params
    });
  }

  public async updateSchemaSettings(params: IUpdateSchemaSettingsParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request({
      url: '/admin/:sourceKey/graph/schema/settings',
      method: 'PATCH',
      params: params
    });
  }

  public async getTypes(params: IGetTypesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request<GetTypesResponse>({
      url: '/admin/:sourceKey/graph/schema/:entityType/types',
      method: 'GET',
      params: params
    });
  }

  public async getTypesWithAccess(params: IGetTypesWithAccessParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      GetTypesWithAccessResponse
    >({
      url: '/:sourceKey/graph/schema/:entityType/types',
      method: 'GET',
      params: params
    });
  }

  public async getSimpleSchema(params?: IGetSimpleSchemaParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      GetSimpleSchemaResponse
    >({
      url: '/:sourceKey/graph/schema/simple',
      method: 'GET',
      params: params
    });
  }

  public getNonIndexedEdgeProperties(params?: IGetNonIndexedPropertiesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request<
      IGetNonIndexedPropertiesResponse
    >({
      url: '/admin/source/:sourceKey/noIndex/edgeProperties',
      method: 'GET',
      params: params
    });
  }

  public getNonIndexedNodeProperties(params?: IGetNonIndexedPropertiesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request<
      IGetNonIndexedPropertiesResponse
    >({
      url: '/admin/source/:sourceKey/noIndex/nodeProperties',
      method: 'GET',
      params: params
    });
  }

  public setNotIndexedEdgeProperties(params: ISetNonIndexedPropertiesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request({
      url: '/admin/source/:sourceKey/noIndex/edgeProperties',
      method: 'PUT',
      params: params
    });
  }

  public setNotIndexedNodeProperties(params: ISetNonIndexedPropertiesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request({
      url: '/admin/source/:sourceKey/noIndex/nodeProperties',
      method: 'PUT',
      params: params
    });
  }
}
