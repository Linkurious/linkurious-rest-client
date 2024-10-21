/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-07-29.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {IDataSourceParams} from '../commonTypes';

import {
  CreateEntityResolutionMappingParams,
  DeleteEntityResolutionMappingParams,
  EntityResolutionMapping,
  IngestionStatus,
  StartIngestionParams,
  UpdateEntityResolutionMappingParams
} from './types';

export * from './types';

const {
  ALREADY_EXISTS,
  DATA_SOURCE_UNAVAILABLE,
  FORBIDDEN,
  ILLEGAL_SOURCE_STATE,
  NOT_FOUND,
  UNAUTHORIZED
} = LkErrorKey;

export class EntityResolutionAPI extends Request {
  /**
   * Create a new entity resolution mapping.
   */
  createEntityResolutionMapping(params: CreateEntityResolutionMappingParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND, ALREADY_EXISTS],
      url: '/:sourceKey/entityResolution/mappings/:sourceNodeCategory',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an existing entity resolution mapping.
   */
  updateEntityResolutionMapping(params: UpdateEntityResolutionMappingParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/entityResolution/mappings/:sourceNodeCategory',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete an existing entity resolution mapping.
   */
  deleteEntityResolutionMapping(params: DeleteEntityResolutionMappingParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/entityResolution/mappings/:sourceNodeCategory',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * List all the entity resolution mappings for a given data-source.
   */
  getEntityResolutionMappings(
    this: Request<{items: EntityResolutionMapping[]}>,
    params: IDataSourceParams
  ) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/entityResolution/mappings',
      method: 'GET',
      params: params
    });
  }

  /**
   * Start the entity resolution ingestion on a given data-source.
   */
  startIngestion(params: StartIngestionParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, ILLEGAL_SOURCE_STATE],
      url: '/:sourceKey/entityResolution',
      method: 'POST',
      params: params
    });
  }

  /**
   * Get the status of the entity resolution ingestion, for a given data-source.
   */
  getIngestionStatus(this: Request<IngestionStatus>, params: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/entityResolution',
      method: 'GET',
      params: params
    });
  }
}
