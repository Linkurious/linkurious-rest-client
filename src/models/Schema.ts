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

export interface IEnumOptions {
  values: string[];
}

export interface IDateOptions {
  format: LkDateFormat;
}

export interface IDatetimeOptions {
  format: LkDateTimeFormat;
  timezone?: string; // timezone information e.g: +05:30
}

export type IGraphSchemaProperty = {
  propertyKey: string;
  required: boolean;
  visibility: DataVisibility;
} & (
  | {
      propertyType:
        | LkPropertyType.AUTO
        | LkPropertyType.BOOLEAN
        | LkPropertyType.NUMBER
        | LkPropertyType.STRING;
    }
  | {
      propertyType: LkPropertyType.DATE;
      typeOptions: IDateOptions;
    }
  | {
      propertyType: LkPropertyType.DATETIME;
      typeOptions: IDatetimeOptions;
    }
  | {
      propertyType: LkPropertyType.STRING;
      typeOptions: IEnumOptions;
    });

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
  entityType: EntityType;
  label: string;
  visibility?: DataVisibility; // default is searchable
}

export interface ICreateTypeResponse extends IGraphSchemaType {}

export interface IUpdateTypeParams extends IDataSourceParams {
  entityType: EntityType;
  label: string;
  visibility: DataVisibility;
}

export interface ICreatePropertyParams extends IDataSourceParams {
  entityType: EntityType;
  label: string;
  propertyKey: string;
  propertyType: LkPropertyType;
  typeOptions?: IEnumOptions | IDateOptions | IDatetimeOptions;
  required?: boolean;
  visibility?: DataVisibility;
}

export interface ICreatePropertyResponse {}

export interface IUpdatePropertyParams extends IDataSourceParams {
  entityType: EntityType;
  label: string;
  propertyKey: string;
  propertyType?: LkPropertyType;
  typeOptions?: IEnumOptions | IDateOptions | IDatetimeOptions;
  required?: boolean;
  visibility?: DataVisibility;
}

export interface IGetTypesParams extends IDataSourceParams {
  entityType: EntityType;
}

export interface IGetTypesResponse extends IGraphSchemaWithAccess {}

export interface IUpdateGraphSchemaSettingsParams extends IDataSourceParams {
  strictSchema: boolean;
}
