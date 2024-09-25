/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */

import {
  DeletableUser,
  GenericObject,
  IDataSourceParams,
  IGetSubGraphParams,
  SharingOptions
} from '../commonTypes';
import {LkSubGraph} from '../graphItemTypes';

export enum TemplateFieldType {
  NUMBER = 'number',
  STRING = 'string',
  ENUM = 'enum',
  NODE = 'node',
  NODE_SET = 'nodeset',
  EDGE = 'edge',
  EDGE_SET = 'edgeset',
  DATE = 'date',
  DATE_TIME = 'datetime',
  BOOLEAN = 'boolean',
  ENV = 'env',
  LIST = 'list'
}

export interface TemplateField<T extends TemplateFieldType = TemplateFieldType> {
  key: string;
  type: T;
}

export interface NumberTemplate extends TemplateField<TemplateFieldType.NUMBER> {
  options?: {
    default?: number;
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

export type ListValue = string | number;

export type ListChoices = Array<{
  label: string;
  value: ListValue;
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
    serialize?: string;
  };
}

export interface NodesetTemplate extends TemplateField<TemplateFieldType.NODE_SET> {
  options?: {
    categories?: string[];
    serialize?: string;
  };
}

export interface EdgeTemplate extends TemplateField<TemplateFieldType.EDGE> {
  options?: {
    types?: string[];
  };
}

export interface EdgesetTemplate extends TemplateField<TemplateFieldType.EDGE_SET> {
  options?: {
    types?: string[];
  };
}

export interface ListTemplate extends TemplateField<TemplateFieldType.LIST> {
  options: {
    default?: ListValue[];
    values: ListChoices;
  };
}

export enum DateTemplateFormat {
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms',
  ISO = 'iso',
  ISO_YYYY_MM_DD = 'yyyy-mm-dd',
  DD_MM_YYYY = 'dd/mm/yyyy',
  MM_DD_YYYY = 'mm/dd/yyyy',
  NATIVE = 'native'
}

export interface DateTemplate extends TemplateField<TemplateFieldType.DATE> {
  options: {
    default?: string;
    min?: string;
    max?: string;
    format: DateTemplateFormat;
  };
}

export enum EnvTemplateValues {
  EMAIL = 'email'
}

export interface EnvTemplate extends TemplateField<TemplateFieldType.ENV> {
  options: {
    value: EnvTemplateValues;
  };
}

export enum DatetimeTemplateFormat {
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms',
  ISO = 'iso',
  YYYY_MM_DD_T = 'YYYY-MM-DDThh:mm:ss',
  NATIVE = 'native'
}

export interface DatetimeTemplate extends TemplateField<TemplateFieldType.DATE_TIME> {
  options: {
    default?: string;
    min?: string;
    max?: string;
    timezone?: string;
    format: DatetimeTemplateFormat;
  };
}
export interface BooleanTemplate extends TemplateField<TemplateFieldType.BOOLEAN> {
  options?: {
    default?: boolean;
  };
}

export type Template =
  | NumberTemplate
  | StringTemplate
  | EnumTemplate
  | NodeTemplate
  | NodesetTemplate
  | EdgeTemplate
  | EdgesetTemplate
  | DateTemplate
  | DatetimeTemplate
  | BooleanTemplate
  | EnvTemplate
  | ListTemplate;

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
  GREMLIN = 'gremlin'
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

export interface ICheckQueryParams extends IDataSourceParams {
  query: string;
  dialect?: GraphQueryDialect;
  isCaseAttributesQuery?: boolean;
  expectedOutputFields?: string[];
}

export interface CheckQueryResponse {
  write: boolean;
  type: GraphQueryType;
  graphInput?: GraphQueryInputType; // defined only if type='template'
  templateFields?: Template[]; // defined only if type='template'
  missingOutputFields?: boolean; // defined only if expectedOutputFields is defined
}

export interface IRunQueryParams extends IDataSourceParams {
  dialect?: GraphQueryDialect;
  limit?: number;
  timeout?: number;
  templateData?: GenericObject;
}

export interface IRunQueryByContentParams extends IGetSubGraphParams, IRunQueryParams {
  query: string;
}

export interface RunQueryResponse extends LkSubGraph {
  truncatedByLimit: boolean;
  truncatedByAccess: boolean;
}

export interface IRunQueryByIdParams extends IGetSubGraphParams, IRunQueryParams {
  id: number | string;
}

export interface ErrorHighlight {
  offset: number;
  length?: number;
}
