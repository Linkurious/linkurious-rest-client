/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-08-04.
 */

import {IDataSourceParams, PersistedItem, SortDirection} from '../commonTypes';

export interface ICreateSpaceParams extends IDataSourceParams {
  title: string;
  description?: string;
  sharedWithGroups: number[];
}

export interface IUpdateSpaceParams extends ICreateSpaceParams {
  id: number;
}

export interface IDeleteSpaceParams extends IDataSourceParams {
  id: number;
}

export enum SpaceSortBy {
  ID = 'id',
  TITLE = 'title'
}

export interface IGetSpacesParams extends IDataSourceParams {
  offset?: number;
  limit?: number;
  sortBy?: SpaceSortBy;
  sortDirection?: SortDirection;
}

export interface ISpace extends ICreateSpaceParams, PersistedItem {}
