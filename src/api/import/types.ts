/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2025
 *
 * - Created on 2025-11-27.
 */
import {IDataSourceParams, SharingMode} from '../commonTypes';
import {EntityType} from '../GraphSchema';

export interface CreateImportTemplateParams extends IDataSourceParams {
  name: string;
  description?: string;
  sharing: SharingMode.PRIVATE | SharingMode.SOURCE;
  /**
   * Whether the destination is an edge or a node.
   */
  entityType: EntityType;
  /**
   * The reference of the node that the edge starts from. Only defined if the destination is an edge.
   */
  sourceNode?: ImportTemplateNodeReference;
  /**
   * The reference of the node that the edge ends to. Only defined if the destination is an edge.
   */
  targetNode?: ImportTemplateNodeReference;
  /**
   * The destination node category / edge type.
   */
  itemType: string;
  /**
   * How to map imported fields to node/edge properties.
   */
  properties: ImportTemplatePropertyMapping[];
}

export interface ImportTemplatePropertyMapping {
  /**
   * The field in the imported file.
   */
  sourceField: string;
  /**
   * The destination property key on the node/edge.
   */
  targetProperty: string;
}

export interface ImportTemplateNodeReference {
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
