/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {IDataSourceParams} from '../commonTypes';

import {
  AdminGraphSchemaProperty,
  AdminGraphSchemaType,
  GetSamplingStatusResponse,
  AdminGraphSchema,
  GraphSchemaWithAccess,
  ICreatePropertyParams,
  ICreateTypeParams,
  IGetTypesParams,
  IStartSchemaSamplingParams,
  IUpdatePropertyParams,
  IUpdateSchemaSettingsParams,
  IUpdateTypeParams
} from './types';

export * from './types';

const {
  UNAUTHORIZED,
  DATA_SOURCE_UNAVAILABLE,
  GUEST_DISABLED,
  FORBIDDEN,
  NOT_FOUND,
  STRICT_SCHEMA_REQUIRED,
  ALREADY_EXISTS
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
   * Add a new type to the graph schema.
   */
  public createType(this: Request<AdminGraphSchemaType>, params: ICreateTypeParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, ALREADY_EXISTS],
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
  public createProperty(this: Request<AdminGraphSchemaProperty>, params: ICreatePropertyParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, ALREADY_EXISTS],
      url: '/admin/:sourceKey/graph/schema/:entityType/properties',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an existing graph schema property.
   */
  public updateProperty(this: Request<AdminGraphSchemaProperty>, params: IUpdatePropertyParams) {
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
  public getTypes(this: Request<AdminGraphSchema>, params: IGetTypesParams) {
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
