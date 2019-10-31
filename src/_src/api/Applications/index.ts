/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {
  CreateApplicationResponse,
  GetApplicationsResponse,
  ICreateApplicationParams,
  IUpdateApplicationParams,
  UpdateApplicationResponse
} from './types';

export * from './types';

const {UNAUTHORIZED, FORBIDDEN, NOT_FOUND} = LkErrorKey;

export class ApplicationsAPI extends Request {
  public getApplications() {
    return this.handle(UNAUTHORIZED, FORBIDDEN).request<GetApplicationsResponse>({
      url: '/admin/applications',
      method: 'GET'
    });
  }

  public createApplication(params: ICreateApplicationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<CreateApplicationResponse>({
      url: '/admin/applications',
      method: 'POST',
      params: params
    });
  }

  public updateApplication(params: IUpdateApplicationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<UpdateApplicationResponse>({
      url: '/admin/applications/:id',
      method: 'PATCH',
      params: params
    });
  }
}
