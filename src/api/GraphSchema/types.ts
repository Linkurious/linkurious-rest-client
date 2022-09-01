/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-15.
 */

import {IDataSourceParams} from '../commonTypes';
import {ItemTypeAccessRightType, PropertyAccessRightType} from '../AccessRight';

export interface IStartSchemaSamplingParams extends IDataSourceParams {
  reset?: boolean;
  defaultVisibility?: DataVisibility;
}

export enum SamplingStatus {
  ONGOING = 'ongoing',
  DONE = 'done',
  ERROR = 'error'
}

export interface GetSamplingStatusResponse {
  status: SamplingStatus;
  progress?: string; // defined if status='ongoing'
  message?: string; // defined if status='ongoing' or status='error'
  lastSampled?: string; // defined if it has run at least once
}

export interface IUpdateSchemaSettingsParams extends IDataSourceParams {
  strictSchema: boolean;
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
  itemType: string;
  visibility?: DataVisibility; // default is searchable
}

export interface IUpdateTypeParams extends ICreateTypeParams {}

export enum PropertyTypeName {
  AUTO = 'auto',
  BOOLEAN = 'boolean',
  CURRENCY = 'currency',
  DATE = 'date',
  DATETIME = 'datetime',
  NUMBER = 'number',
  STRING = 'string'
}

export interface ISimpleType {
  name: PropertyTypeName.AUTO | PropertyTypeName.BOOLEAN;
}

export interface IEnumOptions {
  values: string[];
}

export interface IStringType {
  name: PropertyTypeName.STRING;
  options?: IEnumOptions;
}

export enum DateFormat {
  NATIVE = 'native',
  ISO = 'iso', // yyyy-mm-dd
  DD_MM_YYYY = 'dd/mm/yyyy',
  MM_DD_YYYY = 'mm/dd/yyyy',
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms'
}

export interface IDateOptions {
  format: DateFormat;
}

export interface IDateType {
  name: PropertyTypeName.DATE;
  options: IDateOptions;
}

export enum DateTimeFormat {
  NATIVE = 'native',
  ISO = 'iso', // YYYY-MM-DDThh:mm:ss
  TIMESTAMP = 'timestamp',
  TIMESTAMP_MS = 'timestamp-ms'
}

export interface IDatetimeOptions {
  format: DateTimeFormat;
  timezone?: boolean;
}

export interface IDateTimeType {
  name: PropertyTypeName.DATETIME;
  options: IDatetimeOptions;
}

export enum CurrencyFormat {
  SYMBOL_COMMAS_DOT = '[Symbol] #,###.##',
  DOTS_COMMA_SYMBOL = '#.###,## [Symbol]',
  SPACES_COMMA_DOT = '# ###,## [Symbol]'
}

export interface ICurrencyOptions {
  type: 'currency';
  symbol: string;
  format: CurrencyFormat;
}

export interface INumberType {
  name: PropertyTypeName.NUMBER;
  options?: ICurrencyOptions;
}

export type PropertyType = ISimpleType | IStringType | IDateType | IDateTimeType | INumberType;

export interface ICreatePropertyParams extends IDataSourceParams {
  entityType: EntityType;
  itemType: string;
  propertyKey: string;
  propertyType: PropertyType;
  required?: boolean;
  visibility?: DataVisibility;
}

export interface IUpdatePropertyParams extends IDataSourceParams {
  entityType: EntityType;
  itemType: string;
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
  indexed: boolean;
  // undefined for instance of schema property created before 3.0.0
  indexedAs?: PropertyType;
}

export interface GraphSchemaType {
  itemType: string;
  properties: GraphSchemaProperty[];
  visibility: DataVisibility;
  indexed: boolean;
}

export interface GraphSchema {
  results: GraphSchemaType[];
}

export interface AdminGraphSchemaProperty extends Omit<GraphSchemaProperty, 'indexedAs'> {
  propertyTypeConsistent: boolean;
}

export interface AdminGraphSchemaType extends GraphSchemaType {
  properties: AdminGraphSchemaProperty[];
}

export interface AdminGraphSchema {
  results: AdminGraphSchemaType[];
}

export interface GraphSchemaPropertyWithAccess extends Omit<GraphSchemaProperty, 'indexedAs'> {
  access: PropertyAccessRightType;
}

export interface GraphSchemaTypeWithAccess extends GraphSchemaType {
  access: ItemTypeAccessRightType;
  // GraphSchemaPropertyWithAccess[] if property key access rights is enabled
  properties: Omit<GraphSchemaProperty, 'indexedAs'>[] | GraphSchemaPropertyWithAccess[];
}

export interface GraphSchemaWithAccess extends GraphSchema {
  any: {
    access: ItemTypeAccessRightType;
  };
  results: GraphSchemaTypeWithAccess[];
}

export interface IGetTypesParams extends IDataSourceParams {
  entityType: EntityType;
}
