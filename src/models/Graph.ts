/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-06-28.
 */

// TS2019-DONE

import { IDataSourceParams } from './Model';

export interface ILkDate {
  type: 'date';
  value: string; // iso string UTC+0
}

export interface ILkDateTime {
  type: 'datetime';
  value: string; // iso string UTC+0
}

export interface ILkProperties {
  [key: string]: string | number | boolean | ILkDate | ILkDateTime;
}

export interface ICreateNodeParams extends IDataSourceParams {
  properties: ILkProperties;
  categories: string[];
}

export interface IUpdateNodeParams extends IDataSourceParams {
  id: number;
  properties?: ILkProperties;
  deletedProperties?: string[];
  addedCategories?: string[];
  deletedCategories?: string[];
  readAt?: number;
}

export interface ICreateEdgeParams extends IDataSourceParams {
  properties: ILkProperties;
  type: string;
  source: string;
  target: string;
}

export interface IUpdateEdgeParams extends IDataSourceParams {
  id: number;
  properties?: ILkProperties;
  deletedProperties?: string[];
  readAt?: number;
}
