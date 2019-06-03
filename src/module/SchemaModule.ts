/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

// TS2019-DONE

import {DataSourceUnavailable, Forbidden, NotFound, Unauthorized} from '../response/errors';
import {Success} from '../response/success';
import {Module} from './Module';

import {
  DataVisibility,
  ICreatePropertyParams,
  ICreatePropertyResponse,
  ICreateTypeParams,
  ICreateTypeResponse,
  IGetSchemaSampleStatusParams,
  IGetSchemaSampleStatusResponse,
  IGetTypesParams,
  IGetTypesResponse,
  IGraphSchemaProperty,
  IGraphSchemaTypeWithAccess,
  IStartSchemaSampleParams,
  IStopSchemaSampleParams,
  IUpdatePropertyParams,
  IUpdateTypeParams,
  LkPropertyType,
  SamplingStatus
} from '../models/Schema';

// TODO #76 remove Mock 2.8
class Mock {
  public static indexOf(
    propertyKey: string,
    items: Array<{propertyKey: string}>
  ): number | undefined {
    for (let i = 0; i < items.length; i++) {
      if (items[i].propertyKey === propertyKey) {
        return i;
      }
    }
    return undefined;
  }

  public static property(
    name: string,
    p: ICreatePropertyParams | IUpdatePropertyParams
  ): IGraphSchemaProperty {
    // @ts-ignore
    return {
      propertyKey: p.propertyKey,
      propertyType: p.propertyType || LkPropertyType.AUTO,
      typeOptions: p.typeOptions,
      required: p.required || false,
      visibility: p.visibility || DataVisibility.SEARCHABLE
    };
  }

  public static type(label: string, visibility?: DataVisibility): IGraphSchemaTypeWithAccess {
    return {
      access: 'writable',
      label: label,
      visibility: visibility || DataVisibility.SEARCHABLE,
      properties: []
    };
  }
}

export class SchemaModule extends Module {
  public async startSchemaSample(
    options: IStartSchemaSampleParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/api/{sourceKey}/schema/sample/start',
      method: 'POST',
      query: options,
      path: {
        sourceKey: options.sourceKey
      },
      mock: true
    });
  }

  public async getSchemaSampleStatus(
    options: IGetSchemaSampleStatusParams
  ): Promise<
    Success<IGetSchemaSampleStatusResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/api/{sourceKey}/schema/sample/status',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey
      },
      mock: true,
      mockValue: {
        sampling: SamplingStatus.ONGOING,
        samplingProgress: 65.43,
        samplingStatus: 'Sampled 50 visualizations out of 500'
      }
    });
  }

  public async stopSchemaSample(
    options: IStopSchemaSampleParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/api/{sourceKey}/schema/sample/stop',
      method: 'POST',
      path: {
        sourceKey: options.sourceKey
      },
      mock: true
    });
  }

  private mockSchema: Map<string, IGraphSchemaTypeWithAccess> = new Map();

  public async createType(
    options: ICreateTypeParams
  ): Promise<Success<ICreateTypeResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    this.mockSchema.set(options.label, Mock.type(options.label, options.visibility));
    return this.request({
      url: '/{sourceKey}/graph/schema/{entityType}/types',
      method: 'POST',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      },
      mock: true,
      mockValue: this.mockSchema.get(options.label)
    });
  }

  public async updateType(
    options: IUpdateTypeParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable | NotFound> {
    this.mockSchema.set(options.label, Mock.type(options.label, options.visibility));
    return this.request({
      url: '/{sourceKey}/graph/schema/{entityType}/types',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      },
      mock: true
    });
  }

  public async createProperty(
    options: ICreatePropertyParams
  ): Promise<
    Success<ICreatePropertyResponse> | Unauthorized | Forbidden | DataSourceUnavailable | NotFound
  > {
    const mockValue = Mock.property(options.label, options);
    const graphSchemaType = this.mockSchema.get(options.label);
    if (graphSchemaType && !Mock.indexOf(options.propertyKey, graphSchemaType.properties)) {
      graphSchemaType.properties.push(mockValue);
    }

    return this.request({
      url: '/{sourceKey}/graph/schema/{entityType}/properties',
      method: 'POST',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      },
      mock: true,
      mockValue: mockValue
    });
  }

  public async updateProperty(
    options: IUpdatePropertyParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable | NotFound> {
    const mockValue = Mock.property(options.label, options);
    const graphSchemaType = this.mockSchema.get(options.label);
    if (graphSchemaType) {
      const property = Mock.indexOf(options.propertyKey, graphSchemaType.properties);
      if (property) {
        graphSchemaType.properties[property] = mockValue;
      }
    }
    return this.request({
      url: '/{sourceKey}/graph/schema/{entityType}/properties',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      },
      mock: true
    });
  }

  public async getTypes(
    options: IGetTypesParams
  ): Promise<Success<IGetTypesResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/{sourceKey}/graph/schema/{entityType}/types',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      },
      mock: true,
      mockValue: {
        any: {access: 'writable'},
        results: Array.from(this.mockSchema.values())
      }
    });
  }
}
