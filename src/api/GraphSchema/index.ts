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
  IGetSamplingStatusParams,
  GetSamplingStatusResponse,
  IGetSimpleSchemaParams,
  IGetTypesParams,
  GetTypesResponse,
  IGetTypesWithAccessParams,
  GetTypesWithAccessResponse,
  ISetNonIndexedPropertiesParams,
  IStartSchemaSamplingParams,
  IStopSchemaSamplingParams,
  IUpdatePropertyParams,
  IUpdateSchemaSettingsParams,
  IUpdateTypeParams,
  SimpleSchema
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class GraphSchemaAPI extends Request {
  /**
   * Start the schema sampling.
   */
  public startSchemaSampling(params?: IStartSchemaSamplingParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request({
      url: '/admin/:sourceKey/schema/sampling/start',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get the schema sampling status.
   */
  public getSamplingStatus(params?: IGetSamplingStatusParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      GetSamplingStatusResponse
    >({
      url: '/:sourceKey/schema/sampling/status',
      method: 'GET',
      params: params
    });
  }

  /**
   * Stop the schema sampling.
   */
  public stopSchemaSampling(params?: IStopSchemaSamplingParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request({
      url: '/admin/:sourceKey/schema/sampling/stop',
      method: 'POST',
      params: params
    });
  }

  /**
   * List all `edgeTypes`, `nodeCategories`, `edgeProperties`, `nodeProperties`
   * that exist in the graph database.
   */
  public getSimpleSchema(params?: IGetSimpleSchemaParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<SimpleSchema>(
      {
        url: '/:sourceKey/graph/schema/simple',
        method: 'GET',
        params: params
      }
    );
  }

  /**
   * Update the strict schema settings of the data-source.
   */
  public updateSchemaSettings(params: IUpdateSchemaSettingsParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request({
      url: '/admin/:sourceKey/graph/schema/settings',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Get the list of edge properties that are not indexed for the given data-source.
   */
  public getNonIndexedEdgeProperties(params?: IGetNonIndexedPropertiesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request<string[]>({
      url: '/admin/source/:sourceKey/noIndex/edgeProperties',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the list of node properties that are not indexed for the given data-source.
   */
  public getNonIndexedNodeProperties(params?: IGetNonIndexedPropertiesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request<string[]>({
      url: '/admin/source/:sourceKey/noIndex/nodeProperties',
      method: 'GET',
      params: params
    });
  }

  /**
   * Set the list of edge properties that are not indexed for the given data-source.
   */
  public setNotIndexedEdgeProperties(params: ISetNonIndexedPropertiesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request({
      url: '/admin/source/:sourceKey/noIndex/edgeProperties',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Set the list of node properties that are not indexed for the given data-source.
   */
  public setNotIndexedNodeProperties(params: ISetNonIndexedPropertiesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request({
      url: '/admin/source/:sourceKey/noIndex/nodeProperties',
      method: 'PUT',
      params: params
    });
  }

  public createType(params: ICreateTypeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN).request<
      CreateTypeResponse
    >({
      url: '/admin/:sourceKey/graph/schema/:entityType/types',
      method: 'POST',
      params: params
    });
  }

  public updateType(params: IUpdateTypeParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/graph/schema/:entityType/types',
      method: 'PATCH',
      params: params
    });
  }

  public createProperty(params: ICreatePropertyParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request<
      CreatePropertyResponse
    >({
      url: '/admin/:sourceKey/graph/schema/:entityType/properties',
      method: 'POST',
      params: params
    });
  }

  public updateProperty(params: IUpdatePropertyParams) {
    return this.handle(UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND).request({
      url: '/admin/:sourceKey/graph/schema/:entityType/properties',
      method: 'PATCH',
      params: params
    });
  }

  public getTypes(params: IGetTypesParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE).request<GetTypesResponse>({
      url: '/admin/:sourceKey/graph/schema/:entityType/types',
      method: 'GET',
      params: params
    });
  }

  public getTypesWithAccess(params: IGetTypesWithAccessParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED).request<
      GetTypesWithAccessResponse
    >({
      url: '/:sourceKey/graph/schema/:entityType/types',
      method: 'GET',
      params: params
    });
  }
}
