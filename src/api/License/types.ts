/**
 * Copyright Linkurious SAS 2012 - 2022
 *
 * - Created on 2022-03-16.
 */
export enum LicenseState {
  VALID = 'valid',
  EXPIRED = 'expired',
  MISSING = 'missing',
  IN_GRACE_PERIOD = 'inGracePeriod'
}

export interface LicenseInfo {
  state: LicenseState;
  endDate: number;
  customerKey: string;
  telemetry: 'automatic' | 'manual';

  /**
   * Defined if the client is using a SAAS instance
   */
  saasTier?: string;

  /**
   * True if the license is strictly enforced.
   */
  strictLicenseEnforcement: boolean;

  /**
   * True if external authentication is allowed by the license.
   */
  externalAuthentication: boolean;

  /**
   * True if customer groups are allowed by the license.
   */
  customGroups: boolean;

  /**
   * Whether access rights can be set at the entity or the property level.
   */
  dataAccessRights: 'entityLevel' | 'propertyLevel';

  /**
   * True if audit trail is allowed by the license.
   */
  auditTrail: boolean;

  /**
   * True if running Linkurious in cluster mode is allowed by the license.
   */
  clusterMode: boolean;

  /**
   * Whether this is a trial license
   */
  trial: boolean;

  /**
   * The number of named users granted by the license.
   */
  seats?: {
    allowed: number;
    used: number;
  };

  /**
   * The number of floating users granted by the license.
   */
  tokens?: number;

  /**
   * The number of alert queries (models + preprocessing steps) granted by the license.
   */
  alerts?: {
    allowed: number;
    used: number;
  };
}

export interface ISaveLicenseParams {
  license: string;
}
