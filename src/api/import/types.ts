/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2025
 *
 * - Created on 2025-11-18.
 */
import {DeletableUser, IDataSourceParams, SharingMode} from '../commonTypes';
import {EntityType} from '../GraphSchema';

export type CreateImportTemplateParams =
  | CreateNodeImportTemplateParams
  | CreateEdgeImportTemplateParams;

export interface CreateNodeImportTemplateParams extends CreateBaseImportTemplateParams {
  entityType: EntityType.NODE;
}

export interface CreateEdgeImportTemplateParams extends CreateBaseImportTemplateParams {
  entityType: EntityType.EDGE;
  sourceNode: NodeReference;
  targetNode: NodeReference;
}

interface CreateBaseImportTemplateParams extends IDataSourceParams {
  name: string;
  description?: string;
  sharing?: SharingMode.PRIVATE | SharingMode.SOURCE;
  /**
   * The target node category / edge type.
   */
  itemType: string;
  /**
   * How to map imported fields to node/edge properties.
   */
  properties: PropertyMapping[];
}

interface PropertyMapping {
  /**
   * The field in the imported file.
   */
  sourceField: string;
  /**
   * The destination property key on the node/edge.
   */
  targetProperty: string;
}

interface NodeReference {
  /**
   * The field in the imported file.
   */
  sourceField: string;
  /**
   * The destination node category.
   */
  targetCategory: string;
  /**
   * The destination property key on the node. If it is undefined, the destination is the native
   * ID of the node.
   */
  targetProperty?: string;
}

export type UpdateImportTemplateParams = CreateImportTemplateParams & {
  id: number;
};

export interface DeleteImportTemplateParams extends IDataSourceParams {
  id: number;
}

export interface GetImportTemplatesParams extends IDataSourceParams {
  entityType?: EntityType;
}

export type ImportTemplate = CreateImportTemplateParams & {
  id: number;
  sourceKey: string;
};

export interface CreateImportParams extends IDataSourceParams {
  /**
   * Filename of the uploaded file (including its extension).
   */
  filename: string;
}

export interface Import extends CreateImportParams {
  id: number;
  sourceKey: string;
  /**
   * Who created this import.
   */
  createdBy: DeletableUser;
  /**
   * When was this import handle created (so before actually uploading nodes/edges).
   *
   * It's a date-time formatted as a ISO 8601 string, for instance "2025-01-31T09:32:07.508Z".
   */
  createdAt: string;
}

export interface DeleteImportDataParams extends IDataSourceParams {
  id: number;
}
