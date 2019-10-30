/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams, IIdentified} from '../commonTypes';
import {LkEdge} from '../..';

export interface IGetEdgeParams extends IDataSourceParams, IIdentified {}

export interface GetEdgeResponse extends LkEdge {}

export interface ICreateEdgeParams extends IDataSourceParams {
  source: string;
  target: string;
  type: string;
  properties?: GenericObject<unknown>;
}

export interface CreateEdgeResponse extends LkEdge {}

export interface IUpdateEdgeParams extends IDataSourceParams, IIdentified {
  properties?: GenericObject<unknown>;
  deletedProperties?: string[];
  readAt?: number;
}

export interface UpdateEdgeResponse extends LkEdge {}

export interface IDeleteEdgeParams extends IDataSourceParams, IIdentified {}

export interface IGetEdgeCountParams extends IDataSourceParams {}

// TODO RC-refactoring change api response
export type GetEdgeCountResponse = number;
