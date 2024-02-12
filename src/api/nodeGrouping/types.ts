/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-02-06.
 */
import {IDataSourceParams} from '../commonTypes';

export interface NodeGroupingRule {
  id: number;
  sourceKey: string;
  name: string;
  groupingType: NodeGroupingType;
  groupingOptions: NodeGroupingOptions[NodeGroupingType];
  canDelete: boolean;
}

export enum NodeGroupingType {
  PROPERTY_KEY = 'propertyKey'
}

export type NodeGroupingOptions = {
  [NodeGroupingType.PROPERTY_KEY]: PropertyKeyNodeGroupingOptions;
};

export interface PropertyKeyNodeGroupingOptions {
  itemType: string;
  propertyKey: string;
}

export interface CreateNodeGroupingRuleParams extends IDataSourceParams {
  name: string;
  groupingType: NodeGroupingType;
  groupingOptions: NodeGroupingOptions[NodeGroupingType];
}
