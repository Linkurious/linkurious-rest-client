/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-10-29.
 */

import {DeletableUser, IDataSourceParams, SharingOptions} from '../commonTypes';

import {StructuredGraphQuery} from './queryBuilder';
import {Template} from './queryTemplates';

export enum GraphQueryInputType {
  NONE = 'none',
  _1_NODE = '1-node',
  _1_EDGE = '1-edge',
  _2_NODES = '2-nodes',
  NODESET = 'nodeset',
  EDGESET = 'edgeset'
}

export enum GraphQueryDialect {
  CYPHER = 'cypher',
  GREMLIN = 'gremlin',
  QUERY_BUILDER = 'queryBuilder'
}

export enum GraphQueryRight {
  MANAGE = 'manage',
  READ = 'read'
}

export enum GraphQueryType {
  STATIC = 'static',
  TEMPLATE = 'template'
}

export interface GraphQuery extends SharingOptions {
  id: number;
  uuid: string;
  shortUuid: string;
  sourceKey: string;
  name: string;
  content: string;
  dialect: GraphQueryDialect;
  description: string;
  owner?: {
    name: string;
    email: string;
  };
  lastEditor?: DeletableUser;
  lastShareEditor?: DeletableUser;
  write: boolean;
  graphInput?: GraphQueryInputType; // defined only if type='template'
  templateFields?: Template[]; // defined only if type='template'
  type: GraphQueryType;
  right: GraphQueryRight;
  tagIds: number[];
  builtin: boolean;
  isFavorite: boolean;
  isHidden: boolean; // false for builtin queries
  createdAt?: string; // defined only if builtin=false
  updatedAt?: string; // defined only if builtin=false
}

export interface IGetQueryParams extends IDataSourceParams {
  id: number | string;
}

export interface IGetQueriesParams extends IDataSourceParams {
  type?: GraphQueryType;
}

export interface ICreateQueryParams extends IDataSourceParams, SharingOptions {
  uuid?: string;
  name: string;
  content: string;
  dialect?: GraphQueryDialect;
  description?: string;
  tagIds?: number[];
  isHidden?: boolean;
}

export interface IUpdateQueryParams extends Partial<Omit<ICreateQueryParams, 'uuid'>> {
  id: number;
}

export interface IDeleteQueryParams extends IDataSourceParams {
  id: number;
}

export interface ConvertQueryParams extends IDataSourceParams {
  // For now, we only support converting from QueryBuilder to Cypher
  // But in the future we might extend the API to support other conversions
  sourceDialect: GraphQueryDialect.QUERY_BUILDER;
  targetDialect: GraphQueryDialect.CYPHER;
  query: StructuredGraphQuery;
}

export interface ConvertQueryResponse {
  query: string;
  dialect: GraphQueryDialect;
}

export interface GetQueryStatsParams extends IDataSourceParams {
  query: StructuredGraphQuery;
  dialect: GraphQueryDialect.QUERY_BUILDER;
}

export interface GetQueryStatsResponse {
  resultCount: {
    accuracy: QueryStatsCountAccuracy;
    value: number;
  };
}

export enum QueryStatsCountAccuracy {
  EXACT = 'exact',
  APPROXIMATE = 'approximate',
  AT_LEAST = 'at_least'
}
