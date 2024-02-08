/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-02-06.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {
  CreateNodeGroupingRuleParams,
  DeleteNodeGroupingRuleParams,
  GetNodeGroupingRulesParams,
  NodeGroupingRule
} from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, ALREADY_EXISTS, NOT_FOUND, FORBIDDEN} = LkErrorKey;

export class NodeGroupingAPI extends Request {
  public createNodeGroupingRule(
    this: Request<NodeGroupingRule>,
    params: CreateNodeGroupingRuleParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND, ALREADY_EXISTS],
      url: '/:sourceKey/nodeGroupings',
      method: 'POST',
      params: params
    });
  }

  public getNodeGroupingRules(
    this: Request<NodeGroupingRule[]>,
    params: GetNodeGroupingRulesParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/nodeGroupings',
      method: 'GET',
      params: params
    });
  }

  public deleteNodeGroupingRule(params: DeleteNodeGroupingRuleParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/nodeGroupings/:id',
      method: 'DELETE',
      params: params
    });
  }
}
