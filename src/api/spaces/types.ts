/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-08-04.
 */

import {IDataSourceParams} from '../commonTypes';
import {
  ICreateVisualizationParams,
  IGetSandboxParams,
  PopulatedVisualization,
  Visualization
} from '../Visualization/types';

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

export interface IGetSpaceParams extends IDeleteSpaceParams {}

export interface ISpace extends ICreateSpaceParams {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetSpaceSandboxParams extends IGetSandboxParams {
  spaceId: number;
}

export interface CreateSpaceVisualizationParams extends ICreateVisualizationParams {
  spaceId: number;
}

export interface SpaceVisualization extends Visualization {
  spaceId: number;
}

export interface PopulatedSpaceVisualization extends PopulatedVisualization {
  spaceId: number;
}
