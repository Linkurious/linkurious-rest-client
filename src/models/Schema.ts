/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

// TS2019-DONE

import {IDataSourceParams} from './Model';

export interface IStartSchemaSampleParams extends IDataSourceParams {
  reset?: boolean;
}

export interface IGetSchemaSampleStatusParams extends IDataSourceParams {}

export enum SamplingStatus {
  ONGOING = 'ongoing',
  DONE = 'done'
}

export interface IGetSchemaSampleStatusResponse {
  sampling: SamplingStatus;
  samplingProgress?: number;
  samplingStatus?: string;
}

export interface IStopSchemaSampleParams extends IDataSourceParams {}

export enum DataVisibility {
  NONE = 'none',
  AVAILABLE = 'available',
  SEARCHABLE = 'searchable'
}

export enum Archetype {
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

export enum DateFormat {
  NATIVE = 'native',
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms',
  ISO = 'iso',
  ISO_YYYY_MM_DD = 'yyyy-mm-dd',
  DD_MM_YYYY = 'dd/mm/yyyy',
  MM_DD_YYYY = 'mm/dd/yyyy'
}

export interface IEnumOptions {
  values: string[];
}

export interface IDateOptions {
  format: DateFormat;
}

export interface IDatetimeOptions {
  format: DateFormat;
  timezone?: string; // timezone information e.g: +05:30
}

export interface IGraphSchemaProperty {
  propertyKey: string;
  propertyType: LkPropertyType;
  typeOptions?: IEnumOptions | IDateOptions | IDatetimeOptions;
  required: boolean;
  visibility: DataVisibility;
}

export interface IGraphSchemaType {
  label: string;
  properties: IGraphSchemaProperty[];
  visibility: DataVisibility;
}

export interface IGraphSchema {
  results: IGraphSchemaType[];
}

export interface IGraphSchemaWithAccess extends IGraphSchema {
  any: {
    access: string;
  };
  results: IGraphSchemaTypeWithAccess[];
}

export interface IGraphSchemaTypeWithAccess extends IGraphSchemaType {
  access: string;
}

export interface ICreateTypeParams extends IDataSourceParams {
  archetype: Archetype;
  label: string;
  visibility?: DataVisibility; // default is searchable
}

export interface ICreateTypeResponse extends IGraphSchemaType {}

export interface IUpdateTypeParams extends IDataSourceParams {
  archetype: Archetype;
  label: string;
  visibility: DataVisibility;
}

export interface ICreatePropertyParams extends IDataSourceParams {
  archetype: Archetype;
  label: string;
  propertyKey: string;
  propertyType: LkPropertyType;
  typeOptions?: IEnumOptions | IDateOptions | IDatetimeOptions;
  required?: boolean;
  visibility?: DataVisibility;
}

export interface ICreatePropertyResponse {}

export interface IUpdatePropertyParams extends IDataSourceParams {
  archetype: Archetype;
  label: string;
  propertyKey: string;
  propertyType?: LkPropertyType;
  typeOptions?: IEnumOptions | IDateOptions | IDatetimeOptions;
  required?: boolean;
  visibility?: DataVisibility;
}

export interface IGetTypesParams extends IDataSourceParams {
  archetype: Archetype;
}

export interface IGetTypesResponse extends IGraphSchemaWithAccess {}
