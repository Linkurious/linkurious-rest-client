/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {IDataSourceParams} from '../commonTypes';

import {
  GetSamplingStatusResponse,
  GraphSchema,
  GraphSchemaProperty,
  GraphSchemaType,
  GraphSchemaWithAccess,
  ICreatePropertyParams,
  ICreateTypeParams,
  IGetTypesParams,
  ISetNonIndexedPropertiesParams,
  IStartSchemaSamplingParams,
  IUpdatePropertyParams,
  IUpdateSchemaSettingsParams,
  IUpdateTypeParams,
  SimpleSchema
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  NOT_FOUND,
  STRICT_SCHEMA_REQUIRED
} = LkErrorKey;

export class GraphSchemaAPI extends Request {
  /**
   * Start the schema sampling.
   */
  public startSchemaSampling(params?: IStartSchemaSamplingParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/admin/:sourceKey/schema/sampling/start',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get the schema sampling status.
   */
  public getSamplingStatus(this: Request<GetSamplingStatusResponse>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED],
      url: '/:sourceKey/schema/sampling/status',
      method: 'GET',
      params: params
    });
  }

  /**
   * Stop the schema sampling.
   */
  public stopSchemaSampling(params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/admin/:sourceKey/schema/sampling/stop',
      method: 'POST',
      params: params
    });
  }

  /**
   * List all `edgeTypes`, `nodeCategories`, `edgeProperties`, `nodeProperties`
   * that exist in the graph database.
   */
  public getSimpleSchema(this: Request<SimpleSchema>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED],
      url: '/:sourceKey/graph/schema/simple',
      method: 'GET',
      params: params
    });
  }

  /**
   * Update the strict schema settings of the data-source.
   */
  public updateSchemaSettings(params: IUpdateSchemaSettingsParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, STRICT_SCHEMA_REQUIRED],
      url: '/admin/:sourceKey/graph/schema/settings',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Get the list of edge properties that are not indexed for the given data-source.
   */
  public getNonIndexedEdgeProperties(this: Request<string[]>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/admin/source/:sourceKey/noIndex/edgeProperties',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get the list of node properties that are not indexed for the given data-source.
   */
  public getNonIndexedNodeProperties(this: Request<string[]>, params?: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/admin/source/:sourceKey/noIndex/nodeProperties',
      method: 'GET',
      params: params
    });
  }

  /**
   * Set the list of edge properties that are not indexed for the given data-source.
   */
  public setNonIndexedEdgeProperties(params: ISetNonIndexedPropertiesParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/admin/source/:sourceKey/noIndex/edgeProperties',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Set the list of node properties that are not indexed for the given data-source.
   */
  public setNonIndexedNodeProperties(params: ISetNonIndexedPropertiesParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/admin/source/:sourceKey/noIndex/nodeProperties',
      method: 'PUT',
      params: params
    });
  }

  /**
   * Add a new type to the graph schema.
   */
  public createType(this: Request<GraphSchemaType>, params: ICreateTypeParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/admin/:sourceKey/graph/schema/:entityType/types',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an existing graph schema type.
   */
  public updateType(params: IUpdateTypeParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/admin/:sourceKey/graph/schema/:entityType/types',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Add a new property for a type on the graph schema.
   */
  public createProperty(this: Request<GraphSchemaProperty>, params: ICreatePropertyParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/admin/:sourceKey/graph/schema/:entityType/properties',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an existing graph schema property.
   */
  public updateProperty(params: IUpdatePropertyParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/admin/:sourceKey/graph/schema/:entityType/properties',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * List all the types and properties of a data-source.
   */
  public getTypes(this: Request<GraphSchema>, params: IGetTypesParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/admin/:sourceKey/graph/schema/:entityType/types',
      method: 'GET',
      params: params
    });
  }

  /**
   * List all the readable types and properties of a data-source.
   */
  public getTypesWithAccess(this: Request<GraphSchemaWithAccess>, params: IGetTypesParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED],
      url: '/:sourceKey/graph/schema/:entityType/types',
      method: 'GET',
      params: params
    });
  }
}
