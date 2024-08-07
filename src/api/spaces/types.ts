/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-08-04.
 */

import {IDataSourceParams, PersistedItem, SharingMode, SortDirection} from '../commonTypes';
import {VisualizationTree} from '../Visualization';

export interface ICreateSpaceParams extends IDataSourceParams {
  uuid?: string;
  title: string;
  description?: string;
  sharing?: SharingMode.SOURCE | SharingMode.GROUPS;
  sharedWithGroups?: number[];
}

export interface IUpdateSpaceParams extends Omit<ICreateSpaceParams, 'uuid'> {
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

export interface ISpace extends ICreateSpaceParams, PersistedItem {
  uuid: string;
}

export interface IAdminSpace extends ISpace {
  isEmpty: boolean;
}

export interface ISpaceWithVisualizationTree extends ISpace {
  tree: VisualizationTree;
}

export interface GetMySpacesWithTreeResponse {
  items: ISpaceWithVisualizationTree[];
}
