/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-07-03.
 */
export declare type EnumValue = string | number | boolean;
export declare type EnumChoices = Array<{
  label: string;
  value: EnumValue;
}>;
export declare type DateFormat = 'timestamp'
  | 'timestamp-ms'
  | 'iso'
  | 'yyyy-mm-dd'
  | 'dd/mm/yyyy'
  | 'mm/dd/yyyy'
  | 'native';
export declare type DatetimeFormat = 'timestamp'
  | 'timestamp-ms'
  | 'iso'
  | 'yyyy-MM-ddThh:mm:ss'
  | 'native';
export interface ITemplate<T> {
  type: T;
  key: string;
}
export interface NumberTemplate extends ITemplate<'number'> {
  options?: {
    default?: string;
    min?: number;
    max?: number;
    placeholder?: string;
  };
}
export interface StringTemplate extends ITemplate<'string'> {
  options?: {
    default?: string;
    placeholder?: string;
  };
}
export interface EnumTemplate extends ITemplate<'enum'> {
  options?: {
    default?: string;
    values: EnumChoices;
  };
}
export interface NodeTemplate extends ITemplate<'node'> {
  options?: {
    categories?: string[];
  };
}
export interface NodesetTemplate extends ITemplate<'nodeset'> {
  options?: {
    categories?: string[];
  };
}
export interface DateTemplate extends ITemplate<'date'> {
  options?: {
    default?: string;
    min?: string;
    max?: string;
  };
}
export interface DatetimeTemplate extends ITemplate<'datetime'> {
  options?: {
    default?: string;
    min?: string;
    max?: string;
    timezone?: string;
  };
}
export interface BooleanTemplate extends ITemplate<'boolean'> {
  options?: {
    default?: boolean;
  };
}
