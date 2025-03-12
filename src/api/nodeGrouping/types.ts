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
  groupingOptions: PropertyKeyNodeGroupingOptions | RelationTypeNodeGroupingOptions;
  right: NodeGroupingRuleRight;
}

export interface NodeGroupingRulePropertyKey extends BaseNodeGroupingRule {
  groupingType: NodeGroupingType.PROPERTY_KEY;
  groupingOptions: PropertyKeyNodeGroupingOptions;
}

export interface NodeGroupingRuleRelationType extends BaseNodeGroupingRule {
  groupingType: NodeGroupingType.RELATION_TYPE;
  groupingOptions: RelationTypeNodeGroupingOptions;
}

export type NodeGroupingRule = NodeGroupingRulePropertyKey | NodeGroupingRuleRelationType;

export enum NodeGroupingRuleRight {
  MANAGE = 'manage',
  READ = 'read'
}

export enum NodeGroupingType {
  PROPERTY_KEY = 'propertyKey',
  // node connected to the same node by the same relation type
  RELATION_TYPE = 'relationType'
}

export interface PropertyKeyNodeGroupingOptions {
  itemTypes: string[];
  propertyKey: string;
}

export interface RelationTypeNodeGroupingOptions {
  edgeType: string;
  centralNodeIs: 'source' | 'target';
}

export interface BaseCreateNodeGroupingRuleParams extends IDataSourceParams {
  uuid?: string;
  name: string;
  groupingType: NodeGroupingType;
  groupingOptions: PropertyKeyNodeGroupingOptions | RelationTypeNodeGroupingOptions;
}
export interface CreateNodeGroupingPropertyRuleParams extends BaseCreateNodeGroupingRuleParams {
  groupingType: NodeGroupingType.PROPERTY_KEY;
  groupingOptions: PropertyKeyNodeGroupingOptions;
}

export interface CreateNodeGroupingRelationRuleParams extends BaseCreateNodeGroupingRuleParams {
  groupingType: NodeGroupingType.RELATION_TYPE;
  groupingOptions: RelationTypeNodeGroupingOptions;
}

export type CreateNodeGroupingRuleParams =
  | CreateNodeGroupingPropertyRuleParams
  | CreateNodeGroupingRelationRuleParams;

export interface UpdateNodeGroupingRuleParams
  extends Omit<Partial<CreateNodeGroupingRuleParams>, 'uuid'> {
  id: number;
}

export interface GetNodeGroupingRulesParams extends IDataSourceParams {}

export interface DeleteNodeGroupingRuleParams extends IDataSourceParams {
  id: number;
}
