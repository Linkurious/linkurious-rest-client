/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */

import {GenericObject, IDataSourceParams, IGetSubGraphParams, PersistedItem} from '../commonTypes';
import {LkSubGraph} from '../graphItemTypes';

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
  | DateTemplate
  | DatetimeTemplate
  | BooleanTemplate;

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
  sharedWithGroups?: number[]; // defined only if sharing='groups'
  write: boolean;
  graphInput?: GraphQueryInputType; // defined only if type='template'
  templateFields?: Template[]; // defined only if type='template'
  type: GraphQueryType;
  right: GraphQueryRight;
  builtin: boolean;
}

export interface IGetQueryParams extends IDataSourceParams {
  id: number;
}

export interface IGetQueriesParams extends IDataSourceParams {
  type: GraphQueryType;
}

export interface ICreateQueryParams extends IDataSourceParams {
  name: string;
  content: string;
  dialect?: GraphQueryDialect;
  description: string;
  sharing: GraphQuerySharingMode;
  sharedWithGroups?: number[];
}

export interface IUpdateQueryParams extends Partial<ICreateQueryParams> {
  id: number;
}

export interface IDeleteQueryParams extends IDataSourceParams {
  id: number;
}

export interface ICheckQueryParams extends IDataSourceParams {
  query: string;
  dialect?: GraphQueryDialect;
}

export interface CheckQueryResponse {
  write: boolean;
  type: GraphQueryType;
  graphInput?: GraphQueryInputType; // defined only if type='template'
  templateFields?: Template[]; // defined only if type='template'
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
  id: number;
}

export interface ErrorHighlight {
  offset: number;
  length?: number;
}
