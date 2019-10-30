/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-29.
 */
import { LkEdge, LkNode } from '../graphItemTypes';

import { GenericObject, IDataSourceParams } from '../commonTypes';
import { SubGraph } from '../Graph/types';


export interface TemplateFieldOptions {
  [k: string]: string | number | boolean | string[] | object | undefined;
}

export enum TemplateFieldType {
  NODE = 'node',
  NODE_SET = 'nodeset',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ENUM = 'enum',
  DATE = 'date',
  DATE_TIME = 'datetime'
}

export interface TemplateField<T extends TemplateFieldType = TemplateFieldType> {
  key: string;
  type: T;
  options?: TemplateFieldOptions;
}

export type TemplateFields = Array<NumberTemplate | StringTemplate
  | EnumTemplate | NodeTemplate | NodesetTemplate | DateTemplate
  | DatetimeTemplate | BooleanTemplate>

export type EnumValue = string | number | boolean;

export type EnumChoices = Array<{
  label: string;
  value: EnumValue;
}>;

export enum DatetimeFormat {
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms',
  ISO = 'iso',
  YYYY_MM_DD_T = 'yyyy-MM-ddThh:mm:ss',
  NATIVE = 'native'
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
export interface DateTemplate extends TemplateField<TemplateFieldType.DATE> {
  options: {
    default?: string;
    min?: string;
    max?: string;
    format: DateFormat;
  };
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


export enum GraphQuerySharingMode {
  PRIVATE = 'private',
  SOURCE = 'source',
  GROUPS = 'groups'
}

export enum GraphQueryDialect {
  CYPHER = 'cypher',
  GREMLIN = 'gremlin'
}

export enum GraphQueryType {
  STATIC = 'static',
  TEMPLATE = 'template'
}

export enum GraphInputType {
  NONE = "none",
  _1_NODE = "1-node",
  _2_NODES = "2-nodes",
  NODESET = "nodeset"
}

export enum RIGHT_VALUES {
  OWNER = 'owner',
  READ = 'read'
}

export interface IGetGraphQueryParams extends IDataSourceParams {
  id: number;
}

export interface IGraphQueryResponse {
  id: number;
  sourceKey: string;
  name: string;
  content: string;
  dialect: GraphQueryDialect;
  description: string;
  sharing: GraphQuerySharingMode;
  sharedWithGroups?: number[];
  write: boolean;
  graphInput?: GraphInputType;
  templateFields?: TemplateFields;
  type: GraphQueryType;
  right: RIGHT_VALUES;
  builtin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetGraphQueriesParams extends  IDataSourceParams {
  type: GraphQueryType
}

export interface IRunGraphQueryParams extends IDataSourceParams {
  dialect?: string;
  limit?: number;
  timeout?: number;
  edgesTo?: Array<string | number>;
  withAccess?: boolean;
  withDegree?: boolean;
  withDigest?: boolean;
  templateData?: GenericObject<unknown>;
}

export interface IRunGraphQueryByContentParams extends IRunGraphQueryParams {
  query: string;
}

export interface IRunGraphQueryByIdParams extends IRunGraphQueryParams {
  id: number;
}

export interface RunGraphQueryResponse extends SubGraph {
  truncatedByLimit: boolean;
  truncatedByAccess: boolean;
}

export interface ICheckGraphQueryParams extends IDataSourceParams {
  query: string;
  dialect?: GraphQueryDialect;
}

export interface ICheckGraphQueryResponse {
  write: boolean;
  type: GraphQueryType;
  graphInput?: GraphInputType;
  templateFields?: TemplateField[];
}

export enum COLUMN_TYPE_VALUES {
  STRING = 'string',
  NUMBER = 'number'
}

export interface IAlertPreviewParams {
  query: string;
  dialect?: GraphQueryDialect;
  columns?: Array<{columnName: string; columnTitle?: string; type: COLUMN_TYPE_VALUES}>;
  limit?: number;
  timeout?: number;
}
export interface AlertPreviewResponse {
  results: Array<{
    nodes: LkNode[];
    edges: LkEdge[];
    columns: Array<string | number>;
  }>;
}

export interface ICreateGraphQueryParams extends IDataSourceParams {
  name: string;
  content: string;
  dialect?: GraphQueryDialect;
  description: string;
  sharing: GraphQuerySharingMode;
  sharedWithGroups?: number[];

}

export interface IUpdateGraphQueryParams extends Partial<ICreateGraphQueryParams> {
  id: number;
}

export interface IDeleteGraphQueryParams extends IDataSourceParams {
  id: number;
}
