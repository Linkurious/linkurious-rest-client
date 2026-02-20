/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2025
 *
 * - Created on 2025-11-27.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CreateImportParams,
  CreateImportTemplateParams,
  DeleteImportParams,
  DeleteImportTemplateParams,
  GetImportsParams,
  GetImportTemplatesParams,
  Import,
  ImportTemplate,
  UpdateImportTemplateParams
} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class ImportAPI extends Request {
  /**
   * Create a new import template.
   */
  createImportTemplate(this: Request<ImportTemplate>, params: CreateImportTemplateParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/imports/templates',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an existing import template.
   */
  updateImportTemplate(this: Request<ImportTemplate>, params: UpdateImportTemplateParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/imports/templates/:id',
      method: 'PATCH',
      params: params
    });
  }

  /**
   * Delete an existing import template.
   */
  deleteImportTemplate(params: DeleteImportTemplateParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/imports/templates/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * List all the import templates (the publicly shared ones and the private ones owned by the user).
   */
  getImportTemplates(this: Request<{items: ImportTemplate[]}>, params: GetImportTemplatesParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/imports/templates',
      method: 'GET',
      params: params
    });
  }

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
   * Delete an existing import.
   */
  deleteImport(params: DeleteImportParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE, NOT_FOUND],
      url: '/:sourceKey/imports/:id',
      method: 'DELETE',
      params: params
    });
  }

  /**
   * List all the existing imports (for the current user if they are not admin, or for all the
   * users if the current user is an admin).
   */
  getImports(this: Request<{items: Import[]}>, params: GetImportsParams) {
    return this.request({
      errors: [UNAUTHORIZED, FORBIDDEN, DATA_SOURCE_UNAVAILABLE],
      url: '/:sourceKey/imports',
      method: 'GET',
      params: params
    });
  }
}
