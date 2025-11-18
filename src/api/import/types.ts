/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2025
 *
 * - Created on 2025-11-18.
 */
import {DeletableUser, IDataSourceParams} from '../commonTypes';

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
