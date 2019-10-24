/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

// TS2019-DONE

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

export interface IGetSamplingStatusResponse {
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

export interface IEnumOptions {
    values: string[];
}

export interface IDateOptions {
    format: LkDateFormat;
}

export interface IDatetimeOptions {
    format: LkDateTimeFormat;
    timezone?: boolean;
}

export interface ISimpleType {
    name: LkPropertyType.AUTO | LkPropertyType.NUMBER | LkPropertyType.BOOLEAN;
}

export interface IStringType {
    name: LkPropertyType.STRING;
    options?: IEnumOptions;
}

export interface IDateType {
    name: LkPropertyType.DATE;
    options: IDateOptions;
}

export interface IDateTimeType {
    name: LkPropertyType.DATETIME;
    options: IDatetimeOptions;
}

export interface IGraphSchemaProperty {
    propertyKey: string;
    required: boolean;
    visibility: DataVisibility;
    propertyType: ISimpleType | IStringType | IDateType | IDateTimeType;
}

export interface IGraphSchemaType {
    label: string;
    properties: IGraphSchemaProperty[];
    visibility: DataVisibility;
}

export interface IGraphSchema {
    results: IGraphSchemaType[];
}

export enum AccessLevel {
    READABLE = 'readable',
    EDITABLE = 'editable',
    WRITABLE = 'writable',
    NONE = 'none'
}

export interface IGraphSchemaWithAccess extends IGraphSchema {
    any: {
        access: AccessLevel;
    };
    results: IGraphSchemaTypeWithAccess[];
}

export interface IGraphSchemaTypeWithAccess extends IGraphSchemaType {
    access: AccessLevel;
}

export interface ICreateTypeParams extends IDataSourceParams {
    entityType: EntityType;
    label: string;
    visibility?: DataVisibility; // default is searchable
}

export interface ICreateTypeResponse extends IGraphSchemaType {}

export interface IUpdateTypeParams extends ICreateTypeParams {}

export interface ICreatePropertyParams extends IDataSourceParams {
    entityType: EntityType;
    label: string;
    propertyKey: string;
    propertyType: ISimpleType | IStringType | IDateType | IDateTimeType;
    required?: boolean;
    visibility?: DataVisibility;
}

export interface ICreatePropertyResponse {}

export interface IUpdatePropertyParams extends IDataSourceParams {
    entityType: EntityType;
    label: string;
    propertyKey: string;
    propertyType?: ISimpleType | IStringType | IDateType | IDateTimeType;
    required?: boolean;
    visibility?: DataVisibility;
}

export interface IUpdateSchemaSettingsParams extends IDataSourceParams {
    strictSchema: boolean;
}

export interface IGetTypesParams extends IDataSourceParams {
    entityType: EntityType;
}

export interface IGetTypesResponse extends IGraphSchema {}

export interface IGetTypesWithAccessParams extends IDataSourceParams {
    entityType: EntityType;
}

export interface IGetTypesWithAccessResponse extends IGraphSchemaWithAccess {}

export interface IGetSimpleSchemaParams extends IDataSourceParams {}

export interface ISimpleSchema {
    nodeCategories: string[];
    edgeTypes: string[];
    nodeProperties: string[];
    edgeProperties: string[];
}

export interface IGetSimpleSchemaResponse extends ISimpleSchema {}

export interface IGetNonIndexedPropertiesParams extends IDataSourceParams {}

export type IGetNonIndexedPropertiesResponse = string[];

export interface ISetNonIndexedPropertiesParams extends IDataSourceParams {
    properties: string[];
}
