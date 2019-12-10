/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, IGetSubGraphParams} from '../commonTypes';

export interface IGetNodeParams extends IGetSubGraphParams {
  id: string;
}

export interface ICreateNodeParams extends IDataSourceParams {
  categories: string[];
  properties?: GenericObject;
}

export interface IUpdateNodeParams extends IDataSourceParams {
  id: string;
  addedCategories?: string[];
  deletedCategories?: string[];
  properties?: GenericObject;
  deletedProperties?: string[];
  readAt?: number;
}

export interface IDeleteNodeParams extends IDataSourceParams {
  id: string;
}

export interface IGetStatisticsParams extends IDataSourceParams {
  ids: string[];
  withDigest?: boolean;
  withDegree?: boolean;
}

export enum LimitType {
  ID = 'id',
  HIGHEST_DEGREE = 'highestDegree',
  LOWEST_DEGREE = 'lowestDegree'
}

export interface IGetAdjacentNodesParams extends IGetSubGraphParams {
  ids: string[];
  limit?: number;
  limitType?: LimitType;
  nodeCategories?: string[];
  edgeTypes?: string[];
}
