/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-08-04.
 */

import {GenericObject, IDataSourceParams, PersistedItem} from '../commonTypes';
import {VizEdge, VizNode} from '../graphItemTypes';
import {
  BaseVisualization,
  ICreateVisualizationParams,
  IGetSandboxParams,
  IVisualizationTimeline
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

export interface ISpace extends ICreateSpaceParams, PersistedItem {}

export interface GetSpaceSandboxParams extends IGetSandboxParams {
  spaceId: number;
}

export interface CreateSpaceVisualizationParams extends ICreateVisualizationParams {
  spaceId: number;
}

export interface SpaceVisualization extends BaseVisualization, PersistedItem {
  sourceKey: string;
  spaceId: number;
  title: string;
  sandbox: boolean;
  edgeGrouping: GenericObject<boolean>;
  timeline: IVisualizationTimeline;
}

export interface PopulatedSpaceVisualization extends SpaceVisualization {
  nodes: VizNode[];
  edges: VizEdge[];
}
