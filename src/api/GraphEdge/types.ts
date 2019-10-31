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
  properties?: GenericObject<unknown>;
}

export interface CreateEdgeResponse extends LkEdge {}

export interface IUpdateEdgeParams extends IDataSourceParams, Identified {
  properties?: GenericObject<unknown>;
  deletedProperties?: string[];
  readAt?: number;
}

export interface UpdateEdgeResponse extends LkEdge {}

export interface IDeleteEdgeParams extends IDataSourceParams, Identified {}

export interface IGetEdgeCountParams extends IDataSourceParams {}

// TODO RC-refactoring change api response
export type GetEdgeCountResponse = number;
