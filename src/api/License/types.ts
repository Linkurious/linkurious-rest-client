/**
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-03-16.
 */
export interface ISubmitLicenseParams {
  license: string;
}

export enum LicenseState {
  VALID = 'valid',
  EXPIRED = 'expired',
  MISSING = 'missing'
}

export interface SubmitLicenseResponse {
  state: LicenseState;
}
