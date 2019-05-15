/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

import { Module } from './Module';
import { Success } from '../response/success';
import {
  ConstraintViolation,
  DataSourceUnavailable,
  Forbidden,
  InvalidParameter,
  Rejection,
  Unauthorized,
} from '../response/errors';

import {
  DataVisibility,
  GraphSchemaProperty,
  GraphSchemaType,
  GraphSchemaTypeWithAccess,
  GraphSchemaWithAccess,
  ICreateEdgePropertyParams,
  ICreateEdgeTypeParams,
  ICreateNodeCategoryParams,
  ICreateNodePropertyParams,
  IUpdateEdgePropertyParams,
  IUpdateEdgeTypeParams,
  IUpdateNodeCategoryParams,
  IUpdateNodePropertyParams,
} from '../models/graphSchema';

export class SchemaModule extends Module {
  has(name: string, items: Array<{ name: string }>) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].name === name) {
        return i;
      }
    }
    return undefined;
  }

  mockProperty(
    name: string,
    p: ICreateNodePropertyParams | IUpdateNodePropertyParams | ICreateEdgePropertyParams | IUpdateEdgePropertyParams
  ) {
    return {
      name: p.name,

      typeName: p.typeName,

      typeOptions: p.typeOptions,

      required: p.required || false,

      visibility: p.visibility,
    };
  }

  mockType(name: string, visibility?: DataVisibility) {
    return {
      access: 'writable',

      name: name,

      visibility: visibility || DataVisibility.SEARCHABLE,

      properties: [],
    };
  }

  private nodeSchema: Map<string, GraphSchemaTypeWithAccess> = new Map();

  private edgeSchema: Map<string, GraphSchemaTypeWithAccess> = new Map();

  /**
   * Get the dataSource schema with user access rights
   */
  getNodeTypes(
    params?: {
      includeType?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<GraphSchemaWithAccess> | Unauthorized | Forbidden | DataSourceUnavailable | InvalidParameter> {
    return this.request<GraphSchemaWithAccess>({
      url: '/{dataSourceKey}/graph/schema/nodeTypes',
      method: 'GET',
      query: params,
      dataSource: dataSourceKey,
      mock: true,
      mockValue: {
        any: { access: 'writable' },
        results: Array.from(this.edgeSchema.values()),
      },
    });
  }

  /**
   * Get the dataSource node schema with user access rights
   */
  public getEdgeTypes(
    data?: {
      includeType?: boolean;
    },
    dataSourceKey?: string
  ): Promise<Success<GraphSchemaWithAccess> | Unauthorized | Forbidden | DataSourceUnavailable | InvalidParameter> {
    return this.request<GraphSchemaWithAccess>({
      url: '/{dataSourceKey}/graph/schema/edgeTypes',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
      mock: true,
      mockValue: {
        any: { access: 'writable' },
        results: Array.from(this.edgeSchema.values()),
      },
    });
  }

  /**
   * Add a new node category to the schema.
   */
  createNodeCategory(
    params: ICreateNodeCategoryParams
  ): Promise<
    Success<GraphSchemaType> | Unauthorized | Forbidden | ConstraintViolation | DataSourceUnavailable | InvalidParameter
  > {
    this.nodeSchema.set(params.name, this.mockType(params.name, params.visibility));
    return this.request<GraphSchemaType>({
      url: '/{dataSourceKey}/graph/schema/nodeTypes',
      method: 'POST',
      query: params,
      dataSource: params.sourceKey,
      mock: true,
      mockValue: this.nodeSchema.get(params.name),
    });
  }

  /**
   * Update a node category on the schema.
   */
  updateNodeCategory(
    params: IUpdateNodeCategoryParams
  ): Promise<
    Success<void> | Unauthorized | Forbidden | ConstraintViolation | DataSourceUnavailable | InvalidParameter
  > {
    this.nodeSchema.set(params.name, this.mockType(params.name, params.visibility));
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/nodeTypes',
      method: 'PATCH',
      query: params,
      dataSource: params.sourceKey,
      mock: true,
    });
  }

  /**
   * Create a property for a node category on the schema.
   */
  createNodeProperty(
    params: ICreateNodePropertyParams
  ): Promise<
    | Success<GraphSchemaProperty>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    let mockValue = this.mockProperty(params.categoryName, params);
    const category = this.nodeSchema.get(params.categoryName);
    if (category && !this.has(params.name, category.properties)) {
      category.properties.push(mockValue);
    } else {
      return Promise.resolve(new Rejection({ key: 'constraint_violation' }));
    }

    return this.request<GraphSchemaProperty>({
      url: '/{dataSourceKey}/graph/schema/nodeTypes/properties',
      method: 'POST',
      query: params,
      dataSource: params.sourceKey,
      mock: true,
      mockValue: mockValue,
    });
  }

  /**
   * Update a property of a node category on the schema.
   */
  updateNodeProperty(
    params: IUpdateNodePropertyParams
  ): Promise<
    Success<void> | Unauthorized | Forbidden | ConstraintViolation | DataSourceUnavailable | InvalidParameter
  > {
    let mockValue = this.mockProperty(params.categoryName, params);
    const category = this.nodeSchema.get(params.categoryName);
    if (category) {
      const property = this.has(params.name, category.properties);
      if (property) {
        category.properties[property] = mockValue;
      } else {
        return Promise.resolve(new Rejection({ key: 'constraint_violation' }));
      }
    } else {
      return Promise.resolve(new Rejection({ key: 'constraint_violation' }));
    }
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/nodeTypes/properties',
      method: 'PATCH',
      query: params,
      dataSource: params.sourceKey,
      mock: true,
    });
  }

  /**
   * Add a new edge type to the schema.
   */
  createEdgeType(
    params: ICreateEdgeTypeParams
  ): Promise<
    Success<GraphSchemaType> | Unauthorized | Forbidden | ConstraintViolation | DataSourceUnavailable | InvalidParameter
  > {
    this.edgeSchema.set(params.name, this.mockType(params.name, params.visibility));
    return this.request<GraphSchemaType>({
      url: '/{dataSourceKey}/graph/schema/edgeTypes',
      method: 'POST',
      query: params,
      dataSource: params.sourceKey,
      mock: true,
      mockValue: this.edgeSchema.get(params.name),
    });
  }

  /**
   * Update an edge type on the schema.
   */
  updateEdgeType(
    params: IUpdateEdgeTypeParams
  ): Promise<
    Success<void> | Unauthorized | Forbidden | ConstraintViolation | DataSourceUnavailable | InvalidParameter
  > {
    this.edgeSchema.set(params.name, this.mockType(params.name, params.visibility));
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/edgeTypes',
      method: 'PATCH',
      query: params,
      dataSource: params.sourceKey,
      mock: true,
    });
  }

  /**
   * Create a property for a edge type on the schema.
   */
  createEdgeProperty(
    params: ICreateEdgePropertyParams
  ): Promise<
    | Success<GraphSchemaProperty>
    | Unauthorized
    | Forbidden
    | ConstraintViolation
    | DataSourceUnavailable
    | InvalidParameter
  > {
    let mockValue = this.mockProperty(params.edgeType, params);
    const type = this.edgeSchema.get(params.edgeType);
    if (type && !this.has(params.name, type.properties)) {
      type.properties.push(mockValue);
    } else {
      return Promise.resolve(new Rejection({ key: 'constraint_violation' }));
    }
    return this.request<GraphSchemaProperty>({
      url: '/{dataSourceKey}/graph/schema/edgeTypes/properties',
      method: 'POST',
      query: params,
      dataSource: params.sourceKey,
      mock: true,
      mockValue: mockValue,
    });
  }

  /**
   * Update a property of a edge type on the schema.
   */
  updateEdgeProperty(
    params: IUpdateEdgePropertyParams
  ): Promise<
    Success<void> | Unauthorized | Forbidden | ConstraintViolation | DataSourceUnavailable | InvalidParameter
  > {
    let mockValue = this.mockProperty(params.edgeType, params);
    const type = this.edgeSchema.get(params.edgeType);
    if (type) {
      const property = this.has(params.name, type.properties);
      if (property) {
        type.properties[property] = mockValue;
      } else {
        return Promise.resolve(new Rejection({ key: 'constraint_violation' }));
      }
    } else {
      return Promise.resolve(new Rejection({ key: 'constraint_violation' }));
    }
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/edgeTypes/properties',
      method: 'PATCH',
      query: params,
      dataSource: params.sourceKey,
      mock: true,
    });
  }
}
