/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-01-05.
 */
import {IDataSourceParams} from '../commonTypes';

export enum FavoriteType {
  GRAPH_QUERY = 'graph-query'
}

interface FavoriteParams extends IDataSourceParams {
  type: FavoriteType;
  itemId: number;
}

export interface CreateFavoriteParams extends FavoriteParams {}

export interface DeleteFavoriteParams extends FavoriteParams {}
