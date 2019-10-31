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
  properties?: GenericObject;
}

export interface CreateNodeResponse extends LkNode {}

export interface IUpdateNodeParams extends IDataSourceParams, Identified {
  addedCategories?: string[];
  deletedCategories?: string[];
  properties?: GenericObject;
  deletedProperties?: string[];
  readAt?: number;
}

export interface UpdateNodeResponse extends LkNode {}

export interface IDeleteNodeParams extends IDataSourceParams, Identified {}

export interface IGetNodeCountParams extends IDataSourceParams {}

// TODO change api response to be just a number
export type GetNodeCountResponse = number;
