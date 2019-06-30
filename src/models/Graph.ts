/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-06-30.
 */

// TS2019-DONE

import {LkNormalizedEdge, LkNormalizedNode} from './Entities';
import {IDataSourceParams} from './Model';

export interface ICreateNodeParams extends IDataSourceParams {
  properties: {[key: string]: unknown};
  categories: string[];
}

export interface IUpdateNodeParams extends IDataSourceParams {
  id: string;
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
  id: string;
  properties?: {[key: string]: unknown};
  deletedProperties?: string[];
  readAt?: number;
}

export interface ICreateNodeResponse extends LkNormalizedNode {}

export interface ICreateEdgeResponse extends LkNormalizedEdge {}

export interface IUpdateNodeResponse extends LkNormalizedNode {}

export interface IUpdateEdgeResponse extends LkNormalizedEdge {}
