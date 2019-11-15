/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {Application, ICreateApplicationParams, IUpdateApplicationParams} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class ApplicationAPI extends Request {
  /**
   * Get all the API applications.
   */
  public getApplications() {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<Application[]>({
      url: '/admin/applications',
      method: 'GET'
    });
  }

  /**
   * Add a new API application.
   */
  public createApplication(params: ICreateApplicationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<Application>({
      url: '/admin/applications',
      method: 'POST',
      params: params
    });
  }

  /**
   * Update an API application.
   */
  public updateApplication(params: IUpdateApplicationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<Application>({
      url: '/admin/applications/:id',
      method: 'PATCH',
      params: params
    });
  }
}
