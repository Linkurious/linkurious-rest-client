/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, IIdentified} from '../commonTypes';
import {LkNode} from '../graphItemTypes';

export interface IGetNodeParams extends IDataSourceParams, IIdentified {}

export interface GetNodeResponse extends LkNode {}

export interface ICreateNodeParams extends IDataSourceParams {
  categories: string[];
  properties?: GenericObject<unknown>;
}

export interface CreateNodeResponse extends LkNode {}

export interface IUpdateNodeParams extends IDataSourceParams, IIdentified {
  properties?: GenericObject<unknown>;
  deletedProperties?: string[];
  addedCategories?: string[];
  deletedCategories?: string[];
  readAt?: number;
}

export interface UpdateNodeResponse extends LkNode {}

export interface IDeleteNodeParams extends IDataSourceParams, IIdentified {}

export interface IGetNodeCountParams extends IDataSourceParams {}

// TODO RC-refactoring change api response
export type GetNodeCountResponse = number;
