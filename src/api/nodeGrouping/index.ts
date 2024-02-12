/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-02-06.
 */

export * from './types';

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {CreateNodeGroupingRuleParams, NodeGroupingRule} from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, ALREADY_EXISTS, NOT_FOUND} = LkErrorKey;

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
}
