/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, IGetSubGraphParams} from '../commonTypes';

export interface IGetEdgeParams extends IGetSubGraphParams {
  id: string;
}

export interface ICreateEdgeParams extends IDataSourceParams {
  source: string;
  target: string;
  type: string;
  properties?: GenericObject;
}

export interface IUpdateEdgeParams extends IDataSourceParams {
  id: string;
  properties?: GenericObject;
  deletedProperties?: string[];
  readAt?: number;
}

export interface IDeleteEdgeParams extends IDataSourceParams {
  id: string;
}

export interface IGetEdgeCountParams extends IDataSourceParams {}
