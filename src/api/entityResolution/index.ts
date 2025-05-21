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
  EntityResolutionLicenseInfo,
  EntityResolutionMapping,
  EntityResolutionMetrics,
  EntityResolutionServerStatus,
  ExplainWhyEntitiesParams,
  ExplainWhyRecordParams,
  GetEntityByIdParams,
  GetEntityResolutionServerStatusParams,
  IngestionStatus,
  ResolvedEntity,
  StartEntityResolutionTaskParams,
  UpdateEntityResolutionMappingParams,
  WhyEntities,
  WhyRecord
} from './types';

export * from './types';

const {
  ALREADY_EXISTS,
  DATA_SOURCE_UNAVAILABLE,
  FORBIDDEN,
  ILLEGAL_SOURCE_STATE,
  NOT_FOUND,
  UNAUTHORIZED,
  ENTITY_RESOLUTION_EXPIRED_LICENSE,
  ENTITY_RESOLUTION_QUOTA_EXCEEDED
} = LkErrorKey;

export class EntityResolutionAPI extends Request {
  /**
   * Create a new entity resolution mapping, for a given node category.
   */
  createEntityResolutionMapping(
    this: Request<EntityResolutionMapping>,
    params: CreateEntityResolutionMappingParams
  ) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        FORBIDDEN,
        DATA_SOURCE_UNAVAILABLE,
        NOT_FOUND,
        ALREADY_EXISTS,
        ENTITY_RESOLUTION_EXPIRED_LICENSE,
        ENTITY_RESOLUTION_QUOTA_EXCEEDED
      ],
      url: '/:sourceKey/entityResolution/mappings',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an existing entity resolution mapping, for a given node category.
   */
  updateEntityResolutionMapping(
    this: Request<EntityResolutionMapping>,
    params: UpdateEntityResolutionMappingParams
  ) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        FORBIDDEN,
        DATA_SOURCE_UNAVAILABLE,
        NOT_FOUND,
        ALREADY_EXISTS,
        ENTITY_RESOLUTION_EXPIRED_LICENSE,
        ENTITY_RESOLUTION_QUOTA_EXCEEDED
      ],
      url: '/:sourceKey/entityResolution/mappings/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete an existing entity resolution mapping, for a given node category.
   */
  deleteEntityResolutionMapping(params: DeleteEntityResolutionMappingParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        FORBIDDEN,
        DATA_SOURCE_UNAVAILABLE,
        NOT_FOUND,
        ENTITY_RESOLUTION_EXPIRED_LICENSE,
        ENTITY_RESOLUTION_QUOTA_EXCEEDED
      ],
      url: '/:sourceKey/entityResolution/mappings/:id',
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
   * Start an ingestion task on a given data-source. This task:
   * - Ensures all the graph indexes needed for entity resolution are created.
   * - Fetches all the graph nodes for each mapped category.
   * - Converts each fetched node into an entity resolution record.
   * - Sends all the converted records to the entity resolution server.
   * - Materializes the resolved entities in the graph database.
   *
   * The ingestion is incremental: it only fetches the graph nodes that have been modified after
   * the latest ingestion.
   *
   * By default, immediately returns, without waiting for the task to complete.
   */
  startIngestion(params: StartEntityResolutionTaskParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        FORBIDDEN,
        DATA_SOURCE_UNAVAILABLE,
        ILLEGAL_SOURCE_STATE,
        ENTITY_RESOLUTION_EXPIRED_LICENSE,
        ENTITY_RESOLUTION_QUOTA_EXCEEDED
      ],
      url: '/:sourceKey/entityResolution',
      method: 'POST',
      params: params
    });
  }

  /**
   * Start a purge task for a given data-source. This task:
   * - Removes all the entity nodes/edges in the graph database.
   * - Deletes all the graph indexes related to entity resolution.
   * - Empties the data-source in the entity-resolution server.
   *
   * By default, immediately returns, without waiting for the task to complete.
   */
  startPurge(params: StartEntityResolutionTaskParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, ILLEGAL_SOURCE_STATE],
      url: '/:sourceKey/entityResolution',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * Get the status of the entity resolution ingestion, for a given data-source.
   */
  getIngestionStatus(this: Request<IngestionStatus>, params: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, ILLEGAL_SOURCE_STATE],
      url: '/:sourceKey/entityResolution',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get information about the entity resolution license, across all data-sources.
   */
  getLicenseInfo(this: Request<EntityResolutionLicenseInfo>) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN],
      url: '/entityResolution/license',
      method: 'GET'
    });
  }

  /**
   * Get entity resolution metrics, for a given data-source.
   */
  getMetrics(this: Request<EntityResolutionMetrics>, params: IDataSourceParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/entityResolution/metrics',
      method: 'GET',
      params: params
    });
  }

  /**
   * Explain why a given record resolved to an entity.
   */
  explainWhyRecord(this: Request<WhyRecord>, params: ExplainWhyRecordParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        FORBIDDEN,
        DATA_SOURCE_UNAVAILABLE,
        NOT_FOUND,
        ENTITY_RESOLUTION_EXPIRED_LICENSE
      ],
      url: '/:sourceKey/entityResolution/why/record/:recordId',
      method: 'GET',
      params: params
    });
  }

  /**
   * Explain why two different entities are related.
   */
  explainWhyEntities(this: Request<WhyEntities>, params: ExplainWhyEntitiesParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        FORBIDDEN,
        DATA_SOURCE_UNAVAILABLE,
        NOT_FOUND,
        ENTITY_RESOLUTION_EXPIRED_LICENSE
      ],
      url: '/:sourceKey/entityResolution/why/entities/:entityId/:otherEntityId',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get a resolved entity by its ID
   */
  getEntityById(this: Request<ResolvedEntity>, params: GetEntityByIdParams) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        FORBIDDEN,
        DATA_SOURCE_UNAVAILABLE,
        NOT_FOUND,
        ENTITY_RESOLUTION_EXPIRED_LICENSE
      ],
      url: '/:sourceKey/entityResolution/entities/:entityId',
      method: 'GET',
      params: params
    });
  }

  /**
   * Get entity resolution server status
   */
  getEntityResolutionServerStatus(
    this: Request<{status: EntityResolutionServerStatus}>,
    params: GetEntityResolutionServerStatusParams
  ) {
    return this.request({
      errors: [
        UNAUTHORIZED,
        FORBIDDEN,
        DATA_SOURCE_UNAVAILABLE,
        NOT_FOUND,
        ENTITY_RESOLUTION_EXPIRED_LICENSE
      ],
      url: '/entityResolution/server/status',
      method: 'GET',
      params: params
    });
  }
}
