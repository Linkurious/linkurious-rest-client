/**
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-02-06.
 */

import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {CreateNodeGroupingRuleParams} from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class NodeGroupingAPI extends Request {
  public createNodeGroupingRule(params: CreateNodeGroupingRuleParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/nodeGroupings',
      method: 'POST',
      params: params
    });
  }
}
