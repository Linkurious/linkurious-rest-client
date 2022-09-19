/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-08-04.
 */

import {IDataSourceParams} from '../commonTypes';

export interface ICreateSpaceParams extends IDataSourceParams {
  title: string;
  description: string;
  sharedWithGroups: number[];
}

export interface ISpace extends ICreateSpaceParams {
  id: number;
  createdAt: string;
  updatedAt: string;
}
