/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2025
 *
 * - Created on 2025-11-27.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CreateImportTemplateParams,
  DeleteImportTemplateParams,
  GetImportTemplatesParams,
  ImportTemplate
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
}
