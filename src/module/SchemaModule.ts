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
  IGraphSchemaProperty,
  IGraphSchemaTypeWithAccess,
  ISetNonIndexedPropertiesParams,
  IStartSchemaSamplingParams,
  IStopSchemaSamplingParams,
  IUpdatePropertyParams,
  IUpdateSchemaSettingsParams,
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
      propertyType: p.propertyType || {name: LkPropertyType.AUTO},
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
  public async startSchemaSampling(
    options: IStartSchemaSamplingParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/schema/sampling/start',
      method: 'POST',
      query: options,
      path: {
        sourceKey: options.sourceKey
      },
      mock: true
    });
  }

  public async getSamplingStatus(
    options?: IGetSamplingStatusParams
  ): Promise<
    Success<IGetSamplingStatusResponse> | Unauthorized | Forbidden | DataSourceUnavailable
  > {
    return this.request({
      url: '/admin/{sourceKey}/schema/sampling/status',
      method: 'GET',
      path: {
        sourceKey: options && options.sourceKey
      },
      mock: true,
      mockValue: {
        status: SamplingStatus.ONGOING,
        progress: 65.43,
        message: 'Sampled 50 visualizations out of 500'
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
      url: '/admin/{sourceKey}/graph/schema/{entityType}/types',
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
      url: '/admin/{sourceKey}/graph/schema/{entityType}/types',
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
      url: '/admin/{sourceKey}/graph/schema/{entityType}/properties',
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
      url: '/admin/{sourceKey}/graph/schema/{entityType}/properties',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        entityType: options.entityType
      },
      mock: true
    });
  }

  public async updateSchemaSettings(
    options: IUpdateSchemaSettingsParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/admin/{sourceKey}/graph/schema/settings',
      method: 'PATCH',
      path: {
        sourceKey: options.sourceKey
      },
      mock: true
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
      },
      mock: true,
      mockValue: {
        results: Array.from(this.mockSchema.values()).map(v => {
          delete v.access;
          return v;
        })
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
      },
      mock: true,
      mockValue: {
        any: {access: 'writable'},
        results: Array.from(this.mockSchema.values())
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
