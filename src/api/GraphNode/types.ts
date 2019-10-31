/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, Identified} from '../commonTypes';
import {LkNode} from '../graphItemTypes';

export interface IGetNodeParams extends IDataSourceParams, Identified {}

export interface GetNodeResponse extends LkNode {}

export interface ICreateNodeParams extends IDataSourceParams {
  categories: string[];
  properties?: GenericObject<unknown>;
}

export interface CreateNodeResponse extends LkNode {}

export interface IUpdateNodeParams extends IDataSourceParams, Identified {
  properties?: GenericObject<unknown>;
  deletedProperties?: string[];
  addedCategories?: string[];
  deletedCategories?: string[];
  readAt?: number;
}

export interface UpdateNodeResponse extends LkNode {}

export interface IDeleteNodeParams extends IDataSourceParams, Identified {}

export interface IGetNodeCountParams extends IDataSourceParams {}

// TODO RC-refactoring change api response
export type GetNodeCountResponse = number;
