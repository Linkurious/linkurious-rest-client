/**
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-03-16.
 */
export enum LicenseState {
  VALID = 'valid',
  EXPIRED = 'expired',
  MISSING = 'missing'
}

export interface LicenseInfo {
  state: LicenseState;
  endDate: number;
}

export interface ISaveLicenseParams {
  license: string;
}

export interface SaveLicenseResponse {
  state: LicenseState;
}
