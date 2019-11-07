/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {IDataSourceParams, IGetSubGraphParams} from '../commonTypes';
import {LkValidProperties} from '../graphItemTypes';

export interface IGetEdgeParams extends IGetSubGraphParams {
  id: string;
}

export interface ICreateEdgeParams extends IDataSourceParams {
  source: string;
  target: string;
  type: string;
  properties?: LkValidProperties;
}

export interface IUpdateEdgeParams extends IDataSourceParams {
  id: string;
  properties?: LkValidProperties;
  deletedProperties?: string[];
  readAt?: number;
}

export interface IDeleteEdgeParams extends IDataSourceParams {
  id: string;
}
