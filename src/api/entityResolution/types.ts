/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-07-29.
 */
import {IDataSourceParams} from '../commonTypes';

export type CreateEntityResolutionMappingParams = IDataSourceParams &
  Omit<EntityResolutionMapping, 'id'>;

export type UpdateEntityResolutionMappingParams = IDataSourceParams & EntityResolutionMapping;

export type DeleteEntityResolutionMappingParams = IDataSourceParams &
  Pick<EntityResolutionMapping, 'id'>;

/**
 * Describe how to convert a graph node into a entity resolution record.
 */
export interface EntityResolutionMapping<
  T extends EntityResolutionRecordType = EntityResolutionRecordType
> {
  id: number;
  /**
   * The node category of the mapped graph node.
   */
  sourceNodeCategory: string;
  /**
   * Which kind of entity resolution record we map to.
   */
  targetRecordType: T;
  /**
   * How do we map graph properties to entity resolution attributes.
   */
  properties: EntityResolutionPropertyMapping<T>[];
}

export interface EntityResolutionPropertyMapping<
  T extends EntityResolutionRecordType = EntityResolutionRecordType
> {
  /**
   * The node category of the graph node on which the property is picked. If it is undefined, it
   * means the property belongs to the main mapped node, identified by the source node category of
   * the parent mapping. Otherwise, the property belongs to an adjacent node, identified by this
   * category.
   */
  sourceAdjacentNodeCategory?: string;
  /**
   * The key of the graph node property to pick.
   */
  sourcePropertyKey: string;
  /**
   * The entity resolution attribute to map the property to.
   */
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
  | ['name', PersonNameAttribute]
  | ['address', RecordAddressAttribute]
  | ['phone', RecordPhoneAttribute]
  | ['name', RecordNameType, PersonNameAttribute]
  | ['address', PersonAddressType, RecordAddressAttribute]
  | ['phone', PersonPhoneType, RecordPhoneAttribute];

export type OrganizationComplexAttribute =
  | ['name', OrganizationNameAttribute]
  | ['address', RecordAddressAttribute]
  | ['phone', RecordPhoneAttribute]
  | ['name', RecordNameType, OrganizationNameAttribute]
  | ['address', OrganizationAddressType, RecordAddressAttribute]
  | ['phone', OrganizationPhoneType, RecordPhoneAttribute];

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

export interface StartEntityResolutionTaskParams extends IDataSourceParams {
  waitForCompletion?: boolean;
}

/**
 * The possible ingestion states.
 */
export const INGESTION_STATES = ['empty', 'done', 'error', 'ongoing'] as const;
export type IngestionState = (typeof INGESTION_STATES)[number];

/**
 * Define the various types of entity resolution tasks.
 */
export const ENTITY_RESOLUTION_TASK_NAMES = ['ingestion', 'purge'] as const;
export type EntityResolutionTaskName = (typeof ENTITY_RESOLUTION_TASK_NAMES)[number];

/**
 *  The status of the entity resolution ingestion for a given data-source.
 */
export type IngestionStatus =
  | {
      /**
       * - `empty`: Ingestion has never run or has been completely purged.
       * - `done`:  Ingestion is complete.
       */
      state: 'empty' | 'done';
      /**
       * A human readable message describing the state.
       */
      message: string;
      /**
       * The source-key of the data-source on which ingestion is currently running, if any.
       */
      busySourceKey?: string;
    }
  | {
      /**
       * The previous ingestion or purge failed.
       */
      state: 'error';
      /**
       * The type of the task that failed.
       */
      taskName: EntityResolutionTaskName;
      /**
       * the error message.
       */
      message: string;
      /**
       * The source-key of the data-source on which ingestion is currently running, if any.
       */
      busySourceKey?: string;
    }
  | {
      /**
       * Ingestion or purge is currently running.
       */
      state: 'ongoing';
      /**
       * The type of the currently ongoing task.
       */
      taskName: EntityResolutionTaskName;
      /**
       * A human readable message giving details about the progress.
       */
      message: string;
      /**
       * The current source-key.
       */
      busySourceKey: string;
      /**
       * The progress percentage, as a number between 0 and 100.
       */
      progress: number;
      /**
       * The current ingestion rate (if it is known), as a number of items per second.
       */
      itemsPerSecond?: number;
      /**
       * The estimated time left, in seconds.
       */
      timeLeftSeconds?: number;
    };
