/**
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-03-16.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {ISaveLicenseParams, LicenseInfo} from './types';

export * from './types';

const {INVALID_LICENSE, FORBIDDEN, UNAUTHORIZED} = LkErrorKey;

export class LicenseAPI extends Request {
  /**
   * Get information about the currently saved license.
   */
  public getLicenseInfo(this: Request<LicenseInfo>) {
    return this.request({
      errors: [FORBIDDEN, UNAUTHORIZED],
      url: '/license',
      method: 'GET'
    });
  }

  /**
   * Verify the submitted license and save it if it's valid and there is no saved license yet.
   */
  public saveLicenseIfMissing(this: Request<LicenseInfo>, params: ISaveLicenseParams) {
    return this.request({
      errors: [INVALID_LICENSE, UNAUTHORIZED],
      url: '/license',
      method: 'POST',
      params: params
    });
  }

  /**
   * Replace the saved license with the submitted one. Fails if submitted license is invalid.
   */
  public updateLicense(this: Request<LicenseInfo>, params: ISaveLicenseParams) {
    return this.request({
      errors: [INVALID_LICENSE, FORBIDDEN, UNAUTHORIZED],
      url: '/license',
      method: 'PUT',
      params: params
    });
  }
}
