/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams} from '../commonTypes';
import {LkNode, LkSubGraph} from '../graphItemTypes';
import {IGetSubGraphParams} from '../Graph';

export interface IGetNodeParams extends IGetSubGraphParams {
  id: string;
}

export interface GetNodeResponse extends LkSubGraph {}

export interface ICreateNodeParams extends IDataSourceParams {
  categories: string[];
  properties?: GenericObject;
}

export interface CreateNodeResponse extends LkNode {}

export interface IUpdateNodeParams extends IDataSourceParams {
  id: string;
  addedCategories?: string[];
  deletedCategories?: string[];
  properties?: GenericObject;
  deletedProperties?: string[];
  readAt?: number;
}

export interface UpdateNodeResponse extends LkNode {}

export interface IDeleteNodeParams extends IDataSourceParams {
  id: string;
}

export interface IGetNodeCountParams extends IDataSourceParams {}

export type GetNodeCountResponse = number;
