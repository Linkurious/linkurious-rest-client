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
  LkPropertyType
} from '../models/Schema';

// TODO #76 remove Mock 2.8
class Mock {
  public static indexOf(name: string, items: Array<{name: string}>): number | undefined {
    for (let i = 0; i < items.length; i++) {
      if (items[i].name === name) {
        return i;
      }
    }
    return undefined;
  }

  public static property(
    name: string,
    p: ICreatePropertyParams | IUpdatePropertyParams | ICreatePropertyParams | IUpdatePropertyParams
  ): IGraphSchemaProperty {
    return {
      name: p.name,
      typeName: p.typeName || LkPropertyType.AUTO,
      typeOptions: p.typeOptions,
      required: p.required || false,
      visibility: p.visibility || DataVisibility.SEARCHABLE
    };
  }

  public static type(name: string, visibility?: DataVisibility): IGraphSchemaTypeWithAccess {
    return {
      access: 'writable',
      name: name,
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
      mock: true
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
    this.mockSchema.set(options.name, Mock.type(options.name, options.visibility));
    return this.request({
      url: '/{sourceKey}/graph/schema/{type}/types',
      method: 'POST',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        type: options.type
      },
      mock: true,
      mockValue: this.mockSchema.get(options.name)
    });
  }

  public async updateType(
    options: IUpdateTypeParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable | NotFound> {
    this.mockSchema.set(options.name, Mock.type(options.name, options.visibility));
    return this.request({
      url: '/{sourceKey}/graph/schema/{type}/types',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        type: options.type
      },
      mock: true
    });
  }

  public async createProperty(
    options: ICreatePropertyParams
  ): Promise<
    Success<ICreatePropertyResponse> | Unauthorized | Forbidden | DataSourceUnavailable | NotFound
  > {
    const mockValue = Mock.property(options.propertyOf, options);
    const category = this.mockSchema.get(options.propertyOf);
    if (category && !Mock.indexOf(options.name, category.properties)) {
      category.properties.push(mockValue);
    }

    return this.request({
      url: '/{sourceKey}/graph/schema/{type}/properties',
      method: 'POST',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        type: options.type
      },
      mock: true,
      mockValue: mockValue
    });
  }

  public async updateProperty(
    options: IUpdatePropertyParams
  ): Promise<Success<void> | Unauthorized | Forbidden | DataSourceUnavailable | NotFound> {
    const mockValue = Mock.property(options.propertyOf, options);
    const category = this.mockSchema.get(options.propertyOf);
    if (category) {
      const property = Mock.indexOf(options.name, category.properties);
      if (property) {
        category.properties[property] = mockValue;
      }
    }
    return this.request({
      url: '/{sourceKey}/graph/schema/{type}/properties',
      method: 'PATCH',
      body: options,
      path: {
        sourceKey: options.sourceKey,
        type: options.type
      },
      mock: true
    });
  }

  public async getTypes(
    options: IGetTypesParams
  ): Promise<Success<IGetTypesResponse> | Unauthorized | Forbidden | DataSourceUnavailable> {
    return this.request({
      url: '/{sourceKey}/graph/schema/{type}/types',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey,
        type: options.type
      },
      mock: true,
      mockValue: {
        any: {access: 'writable'},
        results: Array.from(this.mockSchema.values())
      }
    });
  }
}
