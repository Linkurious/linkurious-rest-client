import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {ICreateSpaceParams, ISpace} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, INVALID_PARAMETER} = LkErrorKey;

export class SpacesAPI extends Request {
  /**
   * Create a new space.
   */
  public createSpace(this: Request<ISpace>, params: ICreateSpaceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, INVALID_PARAMETER],
      url: '/spaces',
      method: 'POST',
      params: params
    });
  }
}
