/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

// TODO TS2019

import {
  ConstraintViolation,
  DataSourceUnavailable,
  Forbidden,
  InvalidParameter,
  Rejection,
  Unauthorized
} from '../response/errors';
import {Success} from '../response/success';
import {Module} from './Module';

import {
  DataVisibility,
  GraphSchemaProperty,
  GraphSchemaType,
  GraphSchemaTypeWithAccess,
  GraphSchemaWithAccess,
  ICreatePropertyParams,
  ICreateTypeParams,
  IGetSchemaSampleStatusParams,
  IGetSchemaSampleStatusResponse,
  IStartSchemaSampleParams,
  IStopSchemaSampleParams,
  IUpdatePropertyParams,
  IUpdateTypeParams
} from '../models/Schema';

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
  ): GraphSchemaProperty {
    return {
      name: p.name,

      typeName: p.typeName,

      typeOptions: p.typeOptions,

      required: p.required || false,

      visibility: p.visibility
    };
  }

  public static type(name: string, visibility?: DataVisibility): GraphSchemaTypeWithAccess {
    return {
      access: 'writable',

      name: name,

      visibility: visibility || DataVisibility.SEARCHABLE,

      properties: []
    };
  }
}

export class SchemaModule extends Module {
  public async startSampleSchema(
    options: IStartSchemaSampleParams
  ): Promise<Success<void> | Unauthorized | Forbidden> {
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
  ): Promise<Success<IGetSchemaSampleStatusResponse> | Unauthorized | Forbidden> {
    return this.request({
      url: '/api/{sourceKey}/schema/sample/status',
      method: 'GET',
      path: {
        sourceKey: options.sourceKey
      },
      mock: true
    });
  }

  public async stopSampleSchema(
    options: IStopSchemaSampleParams
  ): Promise<Success<void> | Unauthorized | Forbidden> {
    return this.request({
      url: '/api/{sourceKey}/schema/sample/stop',
      method: 'POST',
      path: {
        sourceKey: options.sourceKey
      },
      mock: true
    });
  }

  // TODO TS2019 refactor under here

  private mockNodeSchema: Map<string, GraphSchemaTypeWithAccess> = new Map();

  private mockEdgeSchema: Map<string, GraphSchemaTypeWithAccess> = new Map();

  public async getTypes(
    type: 'node' | 'edge',
    data?: {
      includeType?: boolean;
    },
    dataSourceKey?: string
  ): Promise<
    | Success<GraphSchemaWithAccess>
    | Unauthorized
    | Forbidden
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.request<GraphSchemaWithAccess>({
      url: '/{dataSourceKey}/graph/schema/{type}/types',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
      path: {type: type},
      mock: true,
      mockValue: {
        any: {access: 'writable'},
        results: Array.from(this.mockEdgeSchema.values())
      }
    });
  }

  public async createProperty(
    params: ICreatePropertyParams,
    type: 'node' | 'edge'
  ): Promise<
    | Success<GraphSchemaProperty>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    const mockValue = Mock.property(params.propertyOf, params);
    const category = this.mockNodeSchema.get(params.propertyOf);
    if (category && !Mock.indexOf(params.name, category.properties)) {
      category.properties.push(mockValue);
    } else {
      return Promise.resolve(new Rejection({key: 'constraint_violation'}));
    }

    return this.request<GraphSchemaProperty>({
      url: '/{dataSourceKey}/graph/schema/{type}/properties',
      method: 'POST',
      body: params,
      dataSource: params.sourceKey,
      path: {type: type},
      mock: true,
      mockValue: mockValue
    });
  }

  public async updateProperty(
    params: IUpdatePropertyParams,
    type: 'node' | 'edge'
  ): Promise<
    | Success<void>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    const mockValue = Mock.property(params.propertyOf, params);
    const category = this.mockNodeSchema.get(params.propertyOf);
    if (category) {
      const property = Mock.indexOf(params.name, category.properties);
      if (property) {
        category.properties[property] = mockValue;
      } else {
        return Promise.resolve(new Rejection({key: 'constraint_violation'}));
      }
    } else {
      return Promise.resolve(new Rejection({key: 'constraint_violation'}));
    }
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/{type}/properties',
      method: 'PATCH',
      body: params,
      path: {type: type},
      dataSource: params.sourceKey,
      mock: true
    });
  }

  public async createType(
    params: ICreateTypeParams,
    type: 'node' | 'edge'
  ): Promise<
    | Success<GraphSchemaType>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    this.mockEdgeSchema.set(params.name, Mock.type(params.name, params.visibility));
    return this.request<GraphSchemaType>({
      url: '/{dataSourceKey}/graph/schema/{type}/types',
      method: 'POST',
      body: params,
      dataSource: params.sourceKey,
      path: {type: type},
      mock: true,
      mockValue: this.mockEdgeSchema.get(params.name)
    });
  }

  public async updateType(
    params: IUpdateTypeParams,
    type: 'node' | 'edge'
  ): Promise<
    | Success<void>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    this.mockEdgeSchema.set(params.name, Mock.type(params.name, params.visibility));
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/{type}/types',
      method: 'PATCH',
      body: params,
      path: {type: type},
      dataSource: params.sourceKey,
      mock: true
    });
  }

  /**
   * Get the dataSource schema with user access rights
   */
  public async getNodeTypes(
    params?: {
      includeType?: boolean;
    },
    dataSourceKey?: string
  ): Promise<
    | Success<GraphSchemaWithAccess>
    | Unauthorized
    | Forbidden
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.getTypes('node', params, dataSourceKey);
  }

  /**
   * Get the dataSource node schema with user access rights
   */
  public async getEdgeTypes(
    params?: {
      includeType?: boolean;
    },
    dataSourceKey?: string
  ): Promise<
    | Success<GraphSchemaWithAccess>
    | Unauthorized
    | Forbidden
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.getTypes('edge', params, dataSourceKey);
  }

  /**
   * Add a new node category to the schema.
   */
  public async createNodeCategory(
    params: ICreateTypeParams
  ): Promise<
    | Success<GraphSchemaType>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.createType(params, 'node');
  }

  /**
   * Update a node category on the schema.
   */
  public async updateNodeCategory(
    params: IUpdateTypeParams
  ): Promise<
    | Success<void>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.updateType(params, 'node');
  }

  /**
   * Create a property for a node category on the schema.
   */
  public async createNodeProperty(
    params: ICreatePropertyParams
  ): Promise<
    | Success<GraphSchemaProperty>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.createProperty(params, 'node');
  }

  /**
   * Update a property of a node category on the schema.
   */
  public async updateNodeProperty(
    params: IUpdatePropertyParams
  ): Promise<
    | Success<void>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.updateProperty(params, 'node');
  }

  /**
   * Add a new edge type to the schema.
   */
  public async createEdgeType(
    params: ICreateTypeParams
  ): Promise<
    | Success<GraphSchemaType>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.createType(params, 'edge');
  }

  /**
   * Update an edge type on the schema.
   */
  public async updateEdgeType(
    params: IUpdateTypeParams
  ): Promise<
    | Success<void>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.updateType(params, 'edge');
  }

  /**
   * Create a property for a edge type on the schema.
   */
  public async createEdgeProperty(
    params: ICreatePropertyParams
  ): Promise<
    | Success<GraphSchemaProperty>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.createProperty(params, 'edge');
  }

  /**
   * Update a property of a edge type on the schema.
   */
  public async updateEdgeProperty(
    params: IUpdatePropertyParams
  ): Promise<
    | Success<void>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    return this.updateProperty(params, 'edge');
  }
}
