/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-02-06.
 */

export interface NodeGroupingRule {
  id: number;
  sourceKey: string;
  name: string;
  itemType: string;
  propertyKey: string;
  canDelete: boolean;
}

export interface CreateNodeGroupingRuleParams
  extends Pick<NodeGroupingRule, 'sourceKey' | 'name' | 'itemType' | 'propertyKey'> {}
