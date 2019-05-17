/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

// TODO TS2019

import {IDataSourceParams} from './Model';

export interface IStartSchemaSampleParams extends IDataSourceParams {
  reset?: boolean;
}

export interface IGetSchemaSampleStatusParams extends IDataSourceParams {}

export type ISamplingStatus = 'ongoing' | 'done';

export interface IGetSchemaSampleStatusResponse {
  sampling: ISamplingStatus;
  samplingProgress?: number;
  samplingStatus?: string;
}

export interface IStopSchemaSampleParams extends IDataSourceParams {}

// TODO TS2019 refactor under here

export enum DataVisibility {
  NONE = 'none',
  AVAILABLE = 'available',
  SEARCHABLE = 'searchable'
}

export enum LkPropertyType {
  AUTO = 'auto',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  NUMBER = 'number',
  STRING = 'string'
}

export interface EnumOptions {
  values: string[];
}

export interface DateOptions {
  format:
    | 'native'
    | 'timestamp'
    | 'timestamp-ms'
    | 'iso'
    | 'yyyy-mm-dd'
    | 'dd/mm/yyyy'
    | 'mm/dd/yyyy';
}

export interface DatetimeOptions {
  format:
    | 'native'
    | 'timestamp'
    | 'timestamp-ms'
    | 'iso'
    | 'yyyy-mm-dd'
    | 'dd/mm/yyyy'
    | 'mm/dd/yyyy';
  timezone?: string; // timezone information e.g: +05:30
}

// type SchemaCompliantValue =
//   | string
//   | number
//   | boolean
//   | LkDate
//   | LkDatetime
//   | MissingValue
//   | InvalidValue
//   | ConflictValue;
//
// type LkPropertyValue = string | number | boolean | string[] | null;

// interface LkDate {
//   type: LkPropertyType.DATE;
//   value: number;
// }
//
// interface LkDatetime {
//   type: LkPropertyType.DATETIME;
//   value: number;
// }
//
// interface MissingValue {
//   type: LkPropertyType;
//   status: 'missing';
// }
//
// interface InvalidValue {
//   type: LkPropertyType;
//   status: 'invalid';
//   original: string; // when not of the good type we return a string representation (string[] feel in this category)
// }
//
// interface ConflictValue {
//   type: 'auto';
//   status: 'conflict';
//   original: string; // when schema is in conflict we return a string representation
// }

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

export interface Schema {
  results: GraphSchemaType[];
}

export interface GraphSchemaWithAccess extends Schema {
  any: {
    access: string;
  };
  results: GraphSchemaTypeWithAccess[];
}

export interface ICreateTypeParams {
  sourceKey?: string;

  name: string;

  visibility?: DataVisibility; // default is searchable
}

export interface IUpdateTypeParams {
  sourceKey?: string;

  name: string; // name of the category to update

  visibility?: DataVisibility;
}

export interface ICreatePropertyParams {
  sourceKey?: string;

  propertyOf: string;

  name: string;

  visibility?: DataVisibility;

  typeName: LkPropertyType;

  typeOptions?: EnumOptions | DateOptions | DatetimeOptions;

  required?: boolean;
}

export interface IUpdatePropertyParams {
  sourceKey?: string;

  propertyOf: string;

  name: string;

  visibility: DataVisibility;

  typeName: LkPropertyType;

  typeOptions?: EnumOptions | DateOptions | DatetimeOptions;

  required?: boolean;
}
