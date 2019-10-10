/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

// TS2019-DONE

import {DataSourceUnavailable, Forbidden, NotFound, Unauthorized} from '../response';
import {Success} from '../response';
import {
  ICreatePropertyParams,
  ICreatePropertyResponse,
  ICreateTypeParams,
  ICreateTypeResponse,
  IGetNonIndexedPropertiesParams,
  IGetNonIndexedPropertiesResponse,
  IGetSamplingStatusParams,
  IGetSamplingStatusResponse,
  IGetSimpleSchemaParams,
  IGetSimpleSchemaResponse,
  IGetTypesParams,
  IGetTypesResponse,
  IGetTypesWithAccessParams,
  IGetTypesWithAccessResponse,
  ISetNonIndexedPropertiesParams,
  IStartSchemaSamplingParams,
  IStopSchemaSamplingParams,
  IUpdatePropertyParams,
  IUpdateSchemaSettingsParams,
  IUpdateTypeParams
} from './types';

import {Module} from '../Module';

export class GraphSchemaModule extends Module {
  public async startSchemaSampling(
    params: IStartSchemaSamplingParams
  ): Promise<Success<void>> {
    return this.request({
      url: '/admin/{sourceKey}/schema/sampling/start',
      method: 'POST',
      params: params
    });
  }

  public async getSamplingStatus(
    params?: IGetSamplingStatusParams
  ): Promise<
    Success<IGetSamplingStatusResponse>
  > {
    return this.request({
      url: '/{sourceKey}/schema/sampling/status',
      method: 'GET',
      params: params
    });
  }

  public async stopSchemaSampling(
    params?: IStopSchemaSamplingParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/schema/sampling/stop',
      method: 'POST',
      params: params
    });
  }

  public async createType(
    params: ICreateTypeParams
  ): Promise<Success<ICreateTypeResponse> | Unauthorized | Forbidden> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/types',
      method: 'POST',
      params: params
    });
  }

  public async updateType(
    params: IUpdateTypeParams
  ): Promise<Success<void> | Unauthorized | Forbidden | NotFound> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/types',
      method: 'PATCH',
      params: params
    });
  }

  public async createProperty(
    params: ICreatePropertyParams
  ): Promise<Success<ICreatePropertyResponse> | Unauthorized | Forbidden | NotFound> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/properties',
      method: 'POST',
      params: params
    });
  }

  public async updateProperty(
    params: IUpdatePropertyParams
  ): Promise<Success<void> | Unauthorized | Forbidden | NotFound> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/properties',
      method: 'PATCH',
      params: params
    });
  }

  public async updateSchemaSettings(
    params: IUpdateSchemaSettingsParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/settings',
      method: 'PATCH',
      params: params
    });
  }

  public async getTypes(
    params: IGetTypesParams
  ): Promise<Success<IGetTypesResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/types',
      method: 'GET',
      params: params
    });
  }

  public async getTypesWithAccess(
    params: IGetTypesWithAccessParams
  ): Promise<
    Success<IGetTypesWithAccessResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/{sourceKey}/graph/schema/{entityType}/types',
      method: 'GET',
      params: params
    });
  }

  public async getSimpleSchema(
    params?: IGetSimpleSchemaParams
  ): Promise<Success<IGetSimpleSchemaResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/{sourceKey}/graph/schema/simple',
      method: 'GET',
      params: params
    });
  }

  public getNonIndexedEdgeProperties(
    params?: IGetNonIndexedPropertiesParams
  ): Promise<
    Success<IGetNonIndexedPropertiesResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/admin/source/{sourceKey}/noIndex/edgeProperties',
      method: 'GET',
      params: params
    });
  }

  public getNonIndexedNodeProperties(
    params?: IGetNonIndexedPropertiesParams
  ): Promise<
    Success<IGetNonIndexedPropertiesResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/admin/source/{sourceKey}/noIndex/nodeProperties',
      method: 'GET',
      params: params
    });
  }

  public setNotIndexedEdgeProperties(
    params: ISetNonIndexedPropertiesParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/source/{sourceKey}/noIndex/edgeProperties',
      method: 'PUT',
      params: params
    });
  }

  public setNotIndexedNodeProperties(
    params: ISetNonIndexedPropertiesParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/source/{sourceKey}/noIndex/nodeProperties',
      method: 'PUT',
      params: params
    });
  }
}
