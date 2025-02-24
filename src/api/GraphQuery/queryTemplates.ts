/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-10-29.
 */

export enum TemplateFieldType {
  NUMBER = 'number',
  STRING = 'string',
  ENUM = 'enum',
  NODE = 'node',
  NODE_SET = 'nodeset',
  EDGE = 'edge',
  EDGE_SET = 'edgeset',
  DATE = 'date',
  DATE_TIME = 'datetime',
  BOOLEAN = 'boolean',
  ENV = 'env',
  LIST = 'list'
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

export type ListValue = string | number;

export type ListChoices = Array<{
  label: string;
  value: ListValue;
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
    serialize?: string;
    var?: string;
  };
}

export interface NodesetTemplate extends TemplateField<TemplateFieldType.NODE_SET> {
  options?: {
    categories?: string[];
    serialize?: string;
    var?: string;
  };
}

export interface EdgeTemplate extends TemplateField<TemplateFieldType.EDGE> {
  options?: {
    types?: string[];
    var?: string;
  };
}

export interface EdgesetTemplate extends TemplateField<TemplateFieldType.EDGE_SET> {
  options?: {
    types?: string[];
    var?: string;
  };
}

export interface ListTemplate extends TemplateField<TemplateFieldType.LIST> {
  options: {
    default?: ListValue[];
    values: ListChoices;
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

export enum EnvTemplateValues {
  EMAIL = 'email'
}

export interface EnvTemplate extends TemplateField<TemplateFieldType.ENV> {
  options: {
    value: EnvTemplateValues;
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
  | EdgeTemplate
  | EdgesetTemplate
  | DateTemplate
  | DatetimeTemplate
  | BooleanTemplate
  | EnvTemplate
  | ListTemplate;
