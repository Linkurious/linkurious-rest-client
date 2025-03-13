/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-02-06.
 */
import {IDataSourceParams} from '../commonTypes';

export interface BaseNodeGroupingRule {
  id: number;
  uuid: string;
  sourceKey: string;
  name: string;
  groupingType: NodeGroupingType;
  groupingOptions: NodeGroupingOptions[NodeGroupingType];
  right: NodeGroupingRuleRight;
}
export interface NodeGroupingByPropertyValue extends BaseNodeGroupingRule {
  groupingType: NodeGroupingType.BY_PROPERTY_VALUE;
  groupingOptions: NodeGroupingByPropertyValueOptions;
}

export interface NodeGroupingByAdjacentEdgeType extends BaseNodeGroupingRule {
  groupingType: NodeGroupingType.BY_ADJACENT_EDGE_TYPE;
  groupingOptions: NodeGroupingByAdjacentEdgeTypeOptions;
}

export type NodeGroupingRule = NodeGroupingByPropertyValue | NodeGroupingByAdjacentEdgeType;

export enum NodeGroupingRuleRight {
  MANAGE = 'manage',
  READ = 'read'
}

export enum NodeGroupingType {
  BY_PROPERTY_VALUE = 'propertyKey',
  // all nodes connected to the same central node by a defined relation/edge type
  BY_ADJACENT_EDGE_TYPE = 'edgeType'
}

export type NodeGroupingOptions = {
  [NodeGroupingType.BY_PROPERTY_VALUE]: NodeGroupingByPropertyValueOptions;
  [NodeGroupingType.BY_ADJACENT_EDGE_TYPE]: NodeGroupingByAdjacentEdgeTypeOptions;
};

export interface NodeGroupingByPropertyValueOptions {
  itemTypes: string[];
  propertyKey: string;
}

export interface NodeGroupingByAdjacentEdgeTypeOptions {
  edgeType: string;
  centralNodeIs: 'source' | 'target';
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
