/**
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-03-16.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {ISubmitLicenseParams, LicenseState} from './types';

export * from './types';

const {INVALID_LICENSE} = LkErrorKey;

export class LicenseAPI extends Request {
  /**
   * Verify the supplied license and save it if it’s valid and there is no saved license yet.
   */
  public submitLicense(this: Request<LicenseState>, params: ISubmitLicenseParams) {
    return this.request({
      errors: [INVALID_LICENSE],
      url: '/license',
      method: 'POST',
      params: params
    });
  }
}
