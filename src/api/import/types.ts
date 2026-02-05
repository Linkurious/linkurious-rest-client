/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2025
 *
 * - Created on 2025-11-27.
 */
import {DeletableUser, IDataSourceParams, SharingMode} from '../commonTypes';
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
  sourceNode?: ImportNodeReference;
  /**
   * The reference of the node that the edge ends to. Only defined if the destination is an edge.
   */
  targetNode?: ImportNodeReference;
  /**
   * The destination node category / edge type.
   */
  itemType: string;
  /**
   * How to map imported fields to node/edge properties.
   */
  properties: ImportPropertyMapping[];
  /**
   * The delimiter character which separates each field.
   */
  delimiter?: CsvDelimiter;
}

export interface ImportPropertyMapping {
  /**
   * The field in the imported file.
   */
  importedFileField: string;
  /**
   * The destination property key on the node/edge.
   */
  destinationProperty: string;
}

export interface ImportNodeReference {
  /**
   * The field in the imported file.
   */
  importedFileField: string;
  /**
   * The destination node category and property. If it is undefined, the destination is the native
   * ID of the node.
   */
  destination?: ImportNodeDestination;
}

export interface ImportNodeDestination {
  category: string;
  property: string;
}

export const CSV_DELIMITERS = [',', ';', ':', '\t'] as const;
export type CsvDelimiter = (typeof CSV_DELIMITERS)[number];

export interface UpdateImportTemplateParams extends Partial<CreateImportTemplateParams> {
  id: number;
}

export interface DeleteImportTemplateParams extends IDataSourceParams {
  id: number;
}

export interface GetImportTemplatesParams extends IDataSourceParams {
  entityType?: EntityType;
}

export interface ImportTemplate extends CreateImportTemplateParams {
  id: number;
  sourceKey: string;
  createdBy: DeletableUser;
  createdAt: string;
}

export interface CreateImportParams extends IDataSourceParams {
  /**
   * Filename of the uploaded file (including its extension).
   */
  filename: string;
  entityType: EntityType;
  sourceNode?: ImportNodeDestination;
  targetNode?: ImportNodeDestination;
}

export interface DeleteImportParams extends IDataSourceParams {
  id: number;
}

export type GetImportsParams = IDataSourceParams;

export interface Import {
  id: number;
  sourceKey: string;
  filename: string;
  entityType: EntityType;
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
