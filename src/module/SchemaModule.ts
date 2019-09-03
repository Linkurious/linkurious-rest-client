/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

// TS2019-DONE

import {DataSourceUnavailable, Forbidden, NotFound, Unauthorized} from '../response/errors';
import {Success} from '../response/success';
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
} from '../models/Schema';

import {Module} from './Module';

export class SchemaModule extends Module {
  public async startSchemaSampling(
    options: IStartSchemaSamplingParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/schema/sampling/start',
      method: 'POST',
      body: options,
      path: {
        sourceKey: options.sourceKey
      }
    });
  }

  public async getSamplingStatus(
    options?: IGetSamplingStatusParams
  ): Promise<
    Success<IGetSamplingStatusResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/{sourceKey}/schema/sampling/status',
      method: 'GET',
      path: {
        sourceKey: options && options.sourceKey
      }
    });
  }

  public async stopSchemaSampling(
    options?: IStopSchemaSamplingParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/schema/sampling/stop',
      method: 'POST',
      path: {
        sourceKey: options && options.sourceKey
      }
    });
  }

  public async createType(
    options: ICreateTypeParams
  ): Promise<Success<ICreateTypeResponse> | Unauthorized | Forbidden> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/types',
      method: 'POST',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      }
    });
  }

  public async updateType(
    options: IUpdateTypeParams
  ): Promise<Success<void> | Unauthorized | Forbidden | NotFound> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/types',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      }
    });
  }

  public async createProperty(
    options: ICreatePropertyParams
  ): Promise<Success<ICreatePropertyResponse> | Unauthorized | Forbidden | NotFound> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/properties',
      method: 'POST',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      }
    });
  }

  public async updateProperty(
    options: IUpdatePropertyParams
  ): Promise<Success<void> | Unauthorized | Forbidden | NotFound> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/properties',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      }
    });
  }

  public async updateSchemaSettings(
    options: IUpdateSchemaSettingsParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/settings',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey
      }
    });
  }

  public async getTypes(
    options: IGetTypesParams
  ): Promise<Success<IGetTypesResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/{entityType}/types',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      }
    });
  }

  public async getTypesWithAccess(
    options: IGetTypesWithAccessParams
  ): Promise<
    Success<IGetTypesWithAccessResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/{sourceKey}/graph/schema/{entityType}/types',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      }
    });
  }

  public async getSimpleSchema(
    options?: IGetSimpleSchemaParams
  ): Promise<Success<IGetSimpleSchemaResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/{sourceKey}/graph/schema/simple',
      method: 'GET',
      path: {
        sourceKey: options && options.sourceKey
      }
    });
  }

  public getNonIndexedEdgeProperties(
    options?: IGetNonIndexedPropertiesParams
  ): Promise<
    Success<IGetNonIndexedPropertiesResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/admin/source/{sourceKey}/noIndex/edgeProperties',
      method: 'GET',
      path: {
        sourceKey: options && options.sourceKey
      }
    });
  }

  public getNonIndexedNodeProperties(
    options?: IGetNonIndexedPropertiesParams
  ): Promise<
    Success<IGetNonIndexedPropertiesResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/admin/source/{sourceKey}/noIndex/nodeProperties',
      method: 'GET',
      path: {
        sourceKey: options && options.sourceKey
      }
    });
  }

  public setNotIndexedEdgeProperties(
    options: ISetNonIndexedPropertiesParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/source/{sourceKey}/noIndex/edgeProperties',
      method: 'PUT',
      body: options,
      path: {
        sourceKey: options && options.sourceKey
      }
    });
  }

  public setNotIndexedNodeProperties(
    options: ISetNonIndexedPropertiesParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/source/{sourceKey}/noIndex/nodeProperties',
      method: 'PUT',
      body: options,
      path: {
        sourceKey: options && options.sourceKey
      }
    });
  }
}
