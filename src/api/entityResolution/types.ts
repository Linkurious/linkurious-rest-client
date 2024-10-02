/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-07-29.
 */
import {IDataSourceParams} from '../commonTypes';

export type CreateEntityResolutionMappingParams = IDataSourceParams & EntityResolutionMapping;
export type UpdateEntityResolutionMappingParams = CreateEntityResolutionMappingParams;
export type DeleteEntityResolutionMappingParams = IDataSourceParams & {sourceNodeCategory: string};

/**
 * Describe how to convert a graph node into a entity resolution record.
 */
export interface EntityResolutionMapping<
  T extends EntityResolutionRecordType = EntityResolutionRecordType
> {
  sourceNodeCategory: string;
  targetRecordType: T;
  properties: EntityResolutionPropertyMapping<T>[];
}

export interface EntityResolutionPropertyMapping<
  T extends EntityResolutionRecordType = EntityResolutionRecordType
> {
  sourcePropertyKey: string;
  targetAttribute: RecordAttribute<T>;
}

export type RecordAttribute<T extends EntityResolutionRecordType = EntityResolutionRecordType> =
  | RecordSimpleAttribute<T>
  | RecordComplexAttribute<T>;

export type RecordSimpleAttribute<
  T extends EntityResolutionRecordType = EntityResolutionRecordType
> =
  | CommonSimpleAttribute
  | (T extends 'person'
      ? PersonSimpleAttribute
      : T extends 'organization'
        ? OrganizationSimpleAttribute
        : never);

export type RecordComplexAttribute<
  T extends EntityResolutionRecordType = EntityResolutionRecordType
> = T extends 'person'
  ? PersonComplexAttribute
  : T extends 'organization'
    ? OrganizationComplexAttribute
    : never;

export type PersonComplexAttribute =
  | ['names', RecordNameType, PersonNameAttribute]
  | ['addresses', PersonAddressType, RecordAddressAttribute]
  | ['phones', PersonPhoneType, RecordPhoneAttribute];

export type OrganizationComplexAttribute =
  | ['names', RecordNameType, OrganizationNameAttribute]
  | ['addresses', OrganizationAddressType, RecordAddressAttribute]
  | ['phones', OrganizationPhoneType, RecordPhoneAttribute];

/**
 * The supported record types.
 */
export const ENTITY_RESOLUTION_RECORD_TYPES = ['person', 'organization'] as const;
export type EntityResolutionRecordType = (typeof ENTITY_RESOLUTION_RECORD_TYPES)[number];

export const COMMON_SIMPLE_ATTRIBUTES = [
  'accountNumber',
  'accountDomain',
  'websiteAddress',
  'emailAddress',
  'linkedin',
  'facebook',
  'twitter',
  'skype',
  'zoomRoom',
  'instagram',
  'whatsapp',
  'signal',
  'telegram',
  'tango',
  'viber',
  'wechat'
] as const;
export type CommonSimpleAttribute = (typeof COMMON_SIMPLE_ATTRIBUTES)[number];

export const PERSON_SIMPLE_ATTRIBUTES = [
  'gender',
  'dateOfBirth',
  'dateOfDeath',
  'nationality',
  'citizenship',
  'placeOfBirth',
  'passportNumber',
  'passportCountry',
  'driverLicenseNumber',
  'driverLicenseState',
  'ssnNumber',
  'nationalIdNumber',
  'nationalIdCountry'
] as const;
export type PersonSimpleAttribute = (typeof PERSON_SIMPLE_ATTRIBUTES)[number];

export const ORGANIZATION_SIMPLE_ATTRIBUTES = [
  'registrationDate',
  'registrationCountry',
  'taxIdType',
  'taxIdNumber',
  'taxIdCountry',
  'dunsNumber',
  'npiNumber',
  'leiNumber'
] as const;
export type OrganizationSimpleAttribute = (typeof ORGANIZATION_SIMPLE_ATTRIBUTES)[number];

export const RECORD_NAME_TYPES = ['primary', 'alias'] as const;
export type RecordNameType = (typeof RECORD_NAME_TYPES)[number];

export const PERSON_ADDRESS_TYPES = ['primary', 'other', 'home', 'work', 'mail'] as const;
export type PersonAddressType = (typeof PERSON_ADDRESS_TYPES)[number];

export const ORGANIZATION_ADDRESS_TYPES = ['primary', 'other', 'business', 'mail'] as const;
export type OrganizationAddressType = (typeof ORGANIZATION_ADDRESS_TYPES)[number];

export const PERSON_PHONE_TYPES = ['primary', 'other', 'home', 'work', 'fax', 'mobile'] as const;
export type PersonPhoneType = (typeof PERSON_PHONE_TYPES)[number];

export const ORGANIZATION_PHONE_TYPES = ['primary', 'other', 'fax'] as const;
export type OrganizationPhoneType = (typeof ORGANIZATION_PHONE_TYPES)[number];

export const PERSON_NAME_ATTRIBUTES = [
  'full',
  'first',
  'middle',
  'last',
  'prefix',
  'suffix'
] as const;
export type PersonNameAttribute = (typeof PERSON_NAME_ATTRIBUTES)[number];

export const ORGANIZATION_NAME_ATTRIBUTES = ['org'] as const;
export type OrganizationNameAttribute = (typeof ORGANIZATION_NAME_ATTRIBUTES)[number];

export const RECORD_ADDRESS_ATTRIBUTES = [
  'full',
  'line1',
  'line2',
  'line3',
  'line4',
  'line5',
  'line6',
  'city',
  'state',
  'postalCode',
  'country',
  'fromDate',
  'thruDate'
] as const;
export type RecordAddressAttribute = (typeof RECORD_ADDRESS_ATTRIBUTES)[number];

export const RECORD_PHONE_ATTRIBUTES = ['number', 'fromDate', 'thruDate'] as const;
export type RecordPhoneAttribute = (typeof RECORD_PHONE_ATTRIBUTES)[number];

export interface StartEntityResolutionParams extends IDataSourceParams {
  waitForCompletion?: boolean;
}

/**
 *  The status of entity resolution for a given data-source.
 */
export interface EntityResolutionStatus {
  /**
   * - `needed`: Entity resolution has never run or the last run failed.
   * - `ongoing`: Entity resolution is currently running.
   * - `done`: Entity resolution has successfully run.
   */
  state: 'needed' | 'ongoing' | 'done';
  /**
   * The formatted progress percentage with two decimal digits (for instance `42.93`).
   */
  progress: string;
  /**
   * A human readable message giving additionnal details.
   */
  message: string;
  /**
   * The source-key of the data-source on which entity resolution is currently running, if any.
   */
  busySourceKey?: string;
}
