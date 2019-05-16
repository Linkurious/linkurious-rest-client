/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */
export enum DataVisibility {
  NONE = 'none',
  AVAILABLE = 'available',
  SEARCHABLE = 'searchable',
}

export enum LkPropertyType {
  AUTO = 'auto',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  NUMBER = 'number',
  STRING = 'string',
}

export interface EnumOptions {
  values: string[];
}

export interface DateOptions {
  format: 'native' | 'timestamp' | 'timestamp-ms' | 'iso' | 'yyyy-mm-dd' | 'dd/mm/yyyy' | 'mm/dd/yyyy';
}

export interface DatetimeOptions {
  format: 'native' | 'timestamp' | 'timestamp-ms' | 'iso' | 'yyyy-mm-dd' | 'dd/mm/yyyy' | 'mm/dd/yyyy';
  timezone?: string; // timezone information e.g: +05:30
}

type SchemaCompliantValue =
  | string
  | number
  | boolean
  | LkDate
  | LkDatetime
  | MissingValue
  | InvalidValue
  | ConflictValue;

type LkPropertyValue = string | number | boolean | string[] | null;

interface LkDate {
  type: LkPropertyType.DATE;
  value: number;
}

interface LkDatetime {
  type: LkPropertyType.DATETIME;
  value: number;
}

interface MissingValue {
  type: LkPropertyType;
  status: 'missing';
}

interface InvalidValue {
  type: LkPropertyType;
  status: 'invalid';
  original: string; // when not of the good type we return a string representation (string[] feel in this category)
}

interface ConflictValue {
  type: 'auto';
  status: 'conflict';
  original: string; // when schema is in conflict we return a string representation
}

export interface GraphSchemaProperty {
  name: string;

  typeName: LkPropertyType;

  typeOptions?: EnumOptions | DateOptions | DatetimeOptions;

  required: boolean;

  visibility?: DataVisibility;
}

export interface GraphSchemaType {
  name: string;

  visibility: DataVisibility;

  properties: GraphSchemaProperty[];
}

export interface GraphSchemaTypeWithAccess extends GraphSchemaType {
  access: string;
}

export interface GraphSchema {
  results: GraphSchemaType[];
}

export interface GraphSchemaWithAccess extends GraphSchema {
  any: {
    access: string;
  };
  results: Array<GraphSchemaTypeWithAccess>;
}

export interface ICreateNodeCategoryParams {
  sourceKey: string;

  name: string;

  visibility?: DataVisibility; // default is searchable
}

export interface IUpdateNodeCategoryParams {
  sourceKey: string;

  name: string; // name of the category to update

  visibility?: DataVisibility;
}

export interface ICreateNodePropertyParams {
  sourceKey: string;

  categoryName: string;

  name: string;

  visibility?: DataVisibility;

  typeName: LkPropertyType;

  typeOptions?: EnumOptions | DateOptions | DatetimeOptions;

  required?: boolean;
}

export interface IUpdateNodePropertyParams {
  sourceKey: string;

  categoryName: string;

  name: string;

  visibility: DataVisibility;

  typeName: LkPropertyType;

  typeOptions?: EnumOptions | DateOptions | DatetimeOptions;

  required?: boolean;
}

export interface IUpdateEdgeTypeParams {
  sourceKey: string;

  name: string;

  visibility: DataVisibility;
}

export interface ICreateEdgeTypeParams {
  sourceKey: string;

  name: string;

  visibility?: DataVisibility;
}

export interface ICreateEdgePropertyParams {
  sourceKey: string;

  edgeType: string;

  name: string;

  visibility?: DataVisibility;

  typeName: LkPropertyType;

  typeOptions?: EnumOptions | DateOptions | DatetimeOptions;

  required?: boolean;
}

export interface IUpdateEdgePropertyParams {
  sourceKey: string;

  edgeType: string;

  name: string;

  visibility: DataVisibility;

  typeName: LkPropertyType;

  typeOptions?: EnumOptions | DateOptions | DatetimeOptions;

  required?: boolean;
}
