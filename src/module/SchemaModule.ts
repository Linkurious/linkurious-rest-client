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
  Unauthorized,
} from '../response/errors';

import {
  GraphSchemaProperty,
  GraphSchemaType,
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
  /**
   * Get the dataSource schema with user access rights
   */
  getNodeCategories(
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
    return this.request<GraphSchemaType>({
      url: '/{dataSourceKey}/graph/schema/nodeTypes',
      method: 'POST',
      query: params,
      dataSource: params.sourceKey,
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
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/nodeTypes',
      method: 'PATCH',
      query: params,
      dataSource: params.sourceKey,
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
    return this.request<GraphSchemaProperty>({
      url: '/{dataSourceKey}/graph/schema/nodeTypes/properties',
      method: 'POST',
      query: params,
      dataSource: params.sourceKey,
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
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/nodeTypes/properties',
      method: 'PATCH',
      query: params,
      dataSource: params.sourceKey,
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
    return this.request<GraphSchemaType>({
      url: '/{dataSourceKey}/graph/schema/edgeTypes',
      method: 'POST',
      query: params,
      dataSource: params.sourceKey,
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
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/edgeTypes',
      method: 'PATCH',
      query: params,
      dataSource: params.sourceKey,
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
    return this.request<GraphSchemaProperty>({
      url: '/{dataSourceKey}/graph/schema/edgeTypes/properties',
      method: 'POST',
      query: params,
      dataSource: params.sourceKey,
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
    return this.request<void>({
      url: '/{dataSourceKey}/graph/schema/edgeTypes/properties',
      method: 'PATCH',
      query: params,
      dataSource: params.sourceKey,
    });
  }
}
