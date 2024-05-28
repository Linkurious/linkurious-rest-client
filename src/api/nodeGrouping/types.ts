/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-02-06.
 */
import {IDataSourceParams} from '../commonTypes';

export interface NodeGroupingRule {
  id: number;
  uuid: string;
  sourceKey: string;
  name: string;
  groupingType: NodeGroupingType;
  groupingOptions: NodeGroupingOptions[NodeGroupingType];
  right: NodeGroupingRuleRight;
}

export enum NodeGroupingRuleRight {
  MANAGE = 'manage',
  READ = 'read'
}

export enum NodeGroupingType {
  PROPERTY_KEY = 'propertyKey'
}

export type NodeGroupingOptions = {
  [NodeGroupingType.PROPERTY_KEY]: PropertyKeyNodeGroupingOptions;
};

export interface PropertyKeyNodeGroupingOptions {
  itemTypes: string[];
  propertyKey: string;
}

export interface CreateNodeGroupingRuleParams extends IDataSourceParams {
  uuid?: string;
  name: string;
  groupingType: NodeGroupingType;
  groupingOptions: NodeGroupingOptions[NodeGroupingType];
}

export interface UpdateNodeGroupingRuleParams
  extends Omit<Partial<CreateNodeGroupingRuleParams>, 'uuid'> {
  id: number;
}

export interface GetNodeGroupingRulesParams extends IDataSourceParams {}

export interface DeleteNodeGroupingRuleParams extends IDataSourceParams {
  id: number;
}
