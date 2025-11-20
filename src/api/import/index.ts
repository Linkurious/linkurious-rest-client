/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2025
 *
 * - Created on 2025-11-18.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {CreateImportParams, DeleteImportDataParams, Import} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN} = LkErrorKey;

export class ImportAPI extends Request {
  /**
   * Create a new import.
   */
  createImport(this: Request<Import>, params: CreateImportParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/imports',
      method: 'POST',
      params: params
    });
  }

  /**
   * List all the existing imports (for the current user if they are not admin, or for all users
   * if the current user is an admin).
   */
  getImports(this: Request<{items: Import[]}>) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/imports',
      method: 'GET'
    });
  }

  /**
   * Delete all the nodes/edges uploaded as part of an existing import.
   */
  deleteImportData(params: DeleteImportDataParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/imports/:id/data',
      method: 'DELETE',
      params: params
    });
  }
}
