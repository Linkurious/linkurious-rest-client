/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

import {IDataSourceParams} from '../commonTypes';

export interface IStartSchemaSamplingParams extends IDataSourceParams {
  reset?: boolean;
}

export interface IGetSamplingStatusParams extends IDataSourceParams {}

export enum SamplingStatus {
  ONGOING = 'ongoing',
  DONE = 'done',
  ERROR = 'error'
}

export interface GetSamplingStatusResponse {
  status: SamplingStatus;
  progress?: string;
  message?: string;
  lastSampled?: string;
}

export interface IStopSchemaSamplingParams extends IDataSourceParams {}

export enum DataVisibility {
  NONE = 'none',
  AVAILABLE = 'available',
  SEARCHABLE = 'searchable'
}

export enum EntityType {
  NODE = 'node',
  EDGE = 'edge'
}

export enum LkPropertyType {
  AUTO = 'auto',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  NUMBER = 'number',
  STRING = 'string'
}

export enum LkDateFormat {
  NATIVE = 'native',
  ISO = 'iso', // yyyy-mm-dd
  DD_MM_YYYY = 'dd/mm/yyyy',
  MM_DD_YYYY = 'mm/dd/yyyy',
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms'
}

export enum LkDateTimeFormat {
  NATIVE = 'native',
  ISO = 'iso', // YYYY-MM-DDThh:mm:ss
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms'
}

export interface EnumOptions {
  values: string[];
}

export interface DateOptions {
  format: LkDateFormat;
}

export interface DatetimeOptions {
  format: LkDateTimeFormat;
  timezone?: boolean;
}

export interface SimpleType {
  name: LkPropertyType.AUTO | LkPropertyType.NUMBER | LkPropertyType.BOOLEAN;
}

export interface StringType {
  name: LkPropertyType.STRING;
  options?: EnumOptions;
}

export interface DateType {
  name: LkPropertyType.DATE;
  options: DateOptions;
}

export interface DateTimeType {
  name: LkPropertyType.DATETIME;
  options: DatetimeOptions;
}

export interface GraphSchemaProperty {
  propertyKey: string;
  required: boolean;
  visibility: DataVisibility;
  propertyType: SimpleType | StringType | DateType | DateTimeType;
}

export interface GraphSchemaType {
  label: string;
  properties: GraphSchemaProperty[];
  visibility: DataVisibility;
}

export interface GraphSchema {
  results: GraphSchemaType[];
}

export enum AccessLevel {
  READABLE = 'readable',
  EDITABLE = 'editable',
  WRITABLE = 'writable',
  NONE = 'none'
}

export interface GraphSchemaWithAccess extends GraphSchema {
  any: {
    access: AccessLevel;
  };
  results: GraphSchemaTypeWithAccess[];
}

export interface GraphSchemaTypeWithAccess extends GraphSchemaType {
  access: AccessLevel;
}

export interface ICreateTypeParams extends IDataSourceParams {
  entityType: EntityType;
  label: string;
  visibility?: DataVisibility; // default is searchable
}

export interface CreateTypeResponse extends GraphSchemaType {}

export interface IUpdateTypeParams extends ICreateTypeParams {}

export interface ICreatePropertyParams extends IDataSourceParams {
  entityType: EntityType;
  label: string;
  propertyKey: string;
  propertyType: SimpleType | StringType | DateType | DateTimeType;
  required?: boolean;
  visibility?: DataVisibility;
}

export interface CreatePropertyResponse {}

export interface IUpdatePropertyParams extends IDataSourceParams {
  entityType: EntityType;
  label: string;
  propertyKey: string;
  propertyType?: SimpleType | StringType | DateType | DateTimeType;
  required?: boolean;
  visibility?: DataVisibility;
}

export interface IUpdateSchemaSettingsParams extends IDataSourceParams {
  strictSchema: boolean;
}

export interface IGetTypesParams extends IDataSourceParams {
  entityType: EntityType;
}

export interface GetTypesResponse extends GraphSchema {}

export interface IGetTypesWithAccessParams extends IDataSourceParams {
  entityType: EntityType;
}

export interface GetTypesWithAccessResponse extends GraphSchemaWithAccess {}

export interface IGetSimpleSchemaParams extends IDataSourceParams {}

export interface SimpleSchema {
  nodeCategories: string[];
  edgeTypes: string[];
  nodeProperties: string[];
  edgeProperties: string[];
}

export interface GetSimpleSchemaResponse extends SimpleSchema {}

export interface IGetNonIndexedPropertiesParams extends IDataSourceParams {}

export type IGetNonIndexedPropertiesResponse = string[];

export interface ISetNonIndexedPropertiesParams extends IDataSourceParams {
  properties: string[];
}
