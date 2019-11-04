/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */

import {IDataSourceParams, PersistedItem} from '../commonTypes';

export enum TemplateFieldType {
  NUMBER = 'number',
  STRING = 'string',
  ENUM = 'enum',
  NODE = 'node',
  NODE_SET = 'nodeset',
  DATE = 'date',
  DATE_TIME = 'datetime',
  BOOLEAN = 'boolean'
}

export interface TemplateField<T extends TemplateFieldType = TemplateFieldType> {
  key: string;
  type: T;
}

export interface NumberTemplate extends TemplateField<TemplateFieldType.NUMBER> {
  options?: {
    default?: string;
    min?: number;
    max?: number;
    placeholder?: string;
  };
}
export interface StringTemplate extends TemplateField<TemplateFieldType.STRING> {
  options?: {
    default?: string;
    placeholder?: string;
  };
}

export type EnumValue = string | number | boolean;

export type EnumChoices = Array<{
  label: string;
  value: EnumValue;
}>;

export interface EnumTemplate extends TemplateField<TemplateFieldType.ENUM> {
  options: {
    default?: string;
    values: EnumChoices;
  };
}

export interface NodeTemplate extends TemplateField<TemplateFieldType.NODE> {
  options?: {
    categories?: string[];
  };
}

export interface NodesetTemplate extends TemplateField<TemplateFieldType.NODE_SET> {
  options?: {
    categories?: string[];
  };
}

export enum DateFormat {
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms',
  ISO = 'iso',
  ISO_YYYY_MM_DD = 'yyyy-MM-dd',
  DD_MM_YYYY = 'dd/mm/yyyy',
  MM_DD_YYYY = 'mm/dd/yyyy',
  NATIVE = 'native'
}

export interface DateTemplate extends TemplateField<TemplateFieldType.DATE> {
  options: {
    default?: string;
    min?: string;
    max?: string;
    format: DateFormat;
  };
}

export enum DatetimeFormat {
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms',
  ISO = 'iso',
  YYYY_MM_DD_T = 'yyyy-MM-ddThh:mm:ss',
  NATIVE = 'native'
}

export interface DatetimeTemplate extends TemplateField<TemplateFieldType.DATE_TIME> {
  options: {
    default?: string;
    min?: string;
    max?: string;
    timezone?: string;
    format: DatetimeFormat;
  };
}
export interface BooleanTemplate extends TemplateField<TemplateFieldType.BOOLEAN> {
  options?: {
    default?: boolean;
  };
}

export type TemplateFields = Array<
  | NumberTemplate
  | StringTemplate
  | EnumTemplate
  | NodeTemplate
  | NodesetTemplate
  | DateTemplate
  | DatetimeTemplate
  | BooleanTemplate
>;

export enum GraphQueryInputType {
  NONE = 'none',
  _1_NODE = '1-node',
  _2_NODES = '2-nodes',
  NODESET = 'nodeset'
}

export enum GraphQueryDialect {
  CYPHER = 'cypher',
  GREMLIN = 'gremlin'
}

export enum GraphQuerySharingMode {
  PRIVATE = 'private',
  SOURCE = 'source',
  GROUPS = 'groups'
}

export enum GraphQueryRight {
  OWNER = 'owner',
  READ = 'read'
}

export enum GraphQueryType {
  STATIC = 'static',
  TEMPLATE = 'template'
}

export interface GraphQuery extends PersistedItem {
  sourceKey: string;
  name: string;
  content: string;
  dialect: GraphQueryDialect;
  description: string;
  sharing: GraphQuerySharingMode;
  sharedWithGroups?: number[];
  write: boolean;
  graphInput?: GraphQueryInputType;
  templateFields?: TemplateFields;
  type: GraphQueryType;
  right: GraphQueryRight;
  builtin: boolean;
}

export interface IGetQueryParams extends IDataSourceParams {
  id: number;
}

export type GetQueryResponse = GraphQuery;

export interface IGetQueriesParams extends IDataSourceParams {
  type: GraphQueryType;
}

export type GetQueriesResponse = GraphQuery[];

export interface ICreateQueryParams extends IDataSourceParams {
  name: string;
  content: string;
  dialect?: GraphQueryDialect;
  description: string;
  sharing: GraphQuerySharingMode;
  sharedWithGroups?: number[];
}

export type CreateQueryResponse = GraphQuery;

export interface IUpdateQueryParams extends Partial<ICreateQueryParams> {
  id: number;
}

export type UpdateQueryResponse = GraphQuery;

export interface IDeleteQueryParams extends IDataSourceParams {
  id: number;
}
