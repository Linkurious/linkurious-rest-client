/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-06-04.
 */
import {LkErrorKey} from '../../http/response';
import {Request} from '../../http/request';

import {CreateTagParams, DeleteTagParams, GetTagsParams, Tag, UpdateTagParams} from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, ALREADY_EXISTS, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export * from './types';

export class TagAPI extends Request {
  /**
   * Create a tag for queries.
   */
  public createTag(this: Request<Tag>, params: CreateTagParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, ALREADY_EXISTS, FORBIDDEN],
      url: '/:sourceKey/graph/query/tags',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get all the tags for queries.
   */
  public getTags(this: Request<Tag[]>, params: GetTagsParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN],
      url: '/:sourceKey/graph/query/tags',
      method: 'GET',
      params: params
    });
  }

  /**
   * Delete a tag.
   */
  public deleteTag(params: DeleteTagParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND],
      url: '/:sourceKey/graph/query/tags/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Update a tag.
   */
  public updateTag(this: Request<Tag>, params: UpdateTagParams) {
    return this.request({
      errors: [UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND, ALREADY_EXISTS],
      url: '/:sourceKey/graph/query/tags/:id',
      method: 'PATCH',
      params: params
    });
  }
}
