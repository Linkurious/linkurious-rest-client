/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

import {IDataSourceParams} from '../commonTypes';

export interface IStartSchemaSamplingParams extends IDataSourceParams {
  reset?: boolean;
}

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

export interface SimpleSchema {
  nodeCategories: string[];
  edgeTypes: string[];
  nodeProperties: string[];
  edgeProperties: string[];
}

export interface IUpdateSchemaSettingsParams extends IDataSourceParams {
  strictSchema: boolean;
}

export interface ISetNonIndexedPropertiesParams extends IDataSourceParams {
  properties: string[];
}

export enum EntityType {
  NODE = 'node',
  EDGE = 'edge'
}

export enum DataVisibility {
  NONE = 'none',
  AVAILABLE = 'available',
  SEARCHABLE = 'searchable'
}

export interface ICreateTypeParams extends IDataSourceParams {
  entityType: EntityType;
  label: string;
  visibility?: DataVisibility; // default is searchable
}

export interface IUpdateTypeParams extends ICreateTypeParams {}

export enum PropertyName {
  AUTO = 'auto',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  NUMBER = 'number',
  STRING = 'string'
}

export interface SimpleType {
  name: PropertyName.AUTO | PropertyName.NUMBER | PropertyName.BOOLEAN;
}

export interface EnumOptions {
  values: string[];
}

export interface StringType {
  name: PropertyName.STRING;
  options?: EnumOptions;
}

export enum DateFormat {
  NATIVE = 'native',
  ISO = 'iso', // yyyy-mm-dd
  DD_MM_YYYY = 'dd/mm/yyyy',
  MM_DD_YYYY = 'mm/dd/yyyy',
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms'
}

export interface DateOptions {
  format: DateFormat;
}

export interface DateType {
  name: PropertyName.DATE;
  options: DateOptions;
}

export enum DateTimeFormat {
  NATIVE = 'native',
  ISO = 'iso', // YYYY-MM-DDThh:mm:ss
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms'
}

export interface DatetimeOptions {
  format: DateTimeFormat;
  timezone?: boolean;
}

export interface DateTimeType {
  name: PropertyName.DATETIME;
  options: DatetimeOptions;
}

export type PropertyType = SimpleType | StringType | DateType | DateTimeType;

export interface ICreatePropertyParams extends IDataSourceParams {
  entityType: EntityType;
  label: string;
  propertyKey: string;
  propertyType: PropertyType;
  required?: boolean;
  visibility?: DataVisibility;
}

export interface IUpdatePropertyParams extends IDataSourceParams {
  entityType: EntityType;
  label: string;
  propertyKey: string;
  propertyType?: PropertyType;
  required?: boolean;
  visibility?: DataVisibility;
}

export interface GraphSchemaProperty {
  propertyKey: string;
  required: boolean;
  visibility: DataVisibility;
  propertyType: PropertyType;
}

export interface GraphSchemaType {
  label: string;
  properties: GraphSchemaProperty[];
  visibility: DataVisibility;
}

export interface IGetTypesParams extends IDataSourceParams {
  entityType: EntityType;
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

export interface GraphSchemaTypeWithAccess extends GraphSchemaType {
  access: AccessLevel;
}

export interface GraphSchemaWithAccess extends GraphSchema {
  any: {
    access: AccessLevel;
  };
  results: GraphSchemaTypeWithAccess[];
}
