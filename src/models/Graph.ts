/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-06-28.
 */

// TS2019-DONE

import { IDataSourceParams } from './Model';

export interface ICreateNodeParams extends IDataSourceParams {
  properties: {[key: string]: unknown};
  categories: string[];
}

export interface IUpdateNodeParams extends IDataSourceParams {
  id: number;
  properties?: {[key: string]: unknown};
  deletedProperties?: string[];
  addedCategories?: string[];
  deletedCategories?: string[];
  readAt?: number;
}

export interface ICreateEdgeParams extends IDataSourceParams {
  properties: {[key: string]: unknown};
  type: string;
  source: string;
  target: string;
}

export interface IUpdateEdgeParams extends IDataSourceParams {
  id: number;
  properties?: {[key: string]: unknown};
  deletedProperties?: string[];
  readAt?: number;
}
