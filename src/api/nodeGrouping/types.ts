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
  PROPERTY_KEY = 'propertyKey',
  // node connected to the same node by the same relation type
  RELATION_TYPE = 'relationType'
}

export type NodeGroupingOptions = {
  [NodeGroupingType.PROPERTY_KEY]: PropertyKeyNodeGroupingOptions;
  [NodeGroupingType.RELATION_TYPE]: RelationTypeNodeGroupingOptions;
};

export interface PropertyKeyNodeGroupingOptions {
  itemTypes: string[];
  propertyKey: string;
}

export interface RelationTypeNodeGroupingOptions {
  itemType: string;
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
