/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {GenericObject, IDataSourceParams} from '../commonTypes';
import {LkEdge, LkSubGraph} from '../graphItemTypes';
import {IGetSubGraphParams} from '../Graph';

export interface IGetEdgeParams extends IGetSubGraphParams {
  id: string;
}

export interface GetEdgeResponse extends LkSubGraph {}

export interface ICreateEdgeParams extends IDataSourceParams {
  source: string;
  target: string;
  type: string;
  properties?: GenericObject;
}

export interface CreateEdgeResponse extends LkEdge {}

export interface IUpdateEdgeParams extends IDataSourceParams {
  id: string;
  properties?: GenericObject;
  deletedProperties?: string[];
  readAt?: number;
}

export interface UpdateEdgeResponse extends LkEdge {}

export interface IDeleteEdgeParams extends IDataSourceParams {
  id: string;
}

export interface IGetEdgeCountParams extends IDataSourceParams {}

export type GetEdgeCountResponse = number;
