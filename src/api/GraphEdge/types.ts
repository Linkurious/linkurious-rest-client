/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, Identified} from '../commonTypes';
import {LkEdge} from '../graphItemTypes';

export interface IGetEdgeParams extends IDataSourceParams, Identified {}

export interface GetEdgeResponse extends LkEdge {}

export interface ICreateEdgeParams extends IDataSourceParams {
  source: string;
  target: string;
  type: string;
  properties?: GenericObject;
}

export interface CreateEdgeResponse extends LkEdge {}

export interface IUpdateEdgeParams extends IDataSourceParams, Identified {
  properties?: GenericObject;
  deletedProperties?: string[];
  readAt?: number;
}

export interface UpdateEdgeResponse extends LkEdge {}

export interface IDeleteEdgeParams extends IDataSourceParams, Identified {}

export interface IGetEdgeCountParams extends IDataSourceParams {}

// TODO change api response to be just a number
export type GetEdgeCountResponse = number;
