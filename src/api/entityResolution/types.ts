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
  | ['phone', PersonPhoneType, RecordPhoneAttribute]
  | ['groupAssociation', GroupAssociationAttribute];

export type OrganizationComplexAttribute =
  | ['name', OrganizationNameAttribute]
  | ['address', RecordAddressAttribute]
  | ['phone', RecordPhoneAttribute]
  | ['name', RecordNameType, OrganizationNameAttribute]
  | ['address', OrganizationAddressType, RecordAddressAttribute]
  | ['phone', OrganizationPhoneType, RecordPhoneAttribute];

export const RESOLVED_ORGANIZATION_ENTITY = 'ResolvedOrganizationEntity';
export const RESOLVED_PERSON_ENTITY = 'ResolvedPersonEntity';

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
  'nationalIdCountry',
  'employerName'
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

export const GROUP_ASSOCIATION_ATTRIBUTES = ['type', 'organisationName', 'idType', 'id'] as const;
export type GroupAssociationAttribute = (typeof GROUP_ASSOCIATION_ATTRIBUTES)[number];

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

export interface StopEntityResolutionTaskParams extends IDataSourceParams {}

/**
 * The possible ingestion states.
 */
export const INGESTION_STATES = ['empty', 'done', 'error', 'ongoing', 'stopped'] as const;
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
       * Ingestion has never run or has been completely purged.
       */
      state: 'empty';
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
      /**
       * When did the task start.
       *
       * It's a date-time formatted as a ISO 8601 string, for instance "2025-01-31T09:46:07.404Z".
       */
      startedAt: string;
      /**
       * When did the task end in error.
       *
       * It's a date-time formatted as a ISO 8601 string, for instance "2025-01-31T09:46:07.404Z".
       */
      endedAt: string;
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
      /**
       * When did the task start.
       *
       * It's a date-time formatted as a ISO 8601 string, for instance "2025-01-31T09:46:07.404Z".
       */
      startedAt: string;
    }
  | {
      /**
       * Ingestion is complete.
       */
      state: 'done';
      /**
       * A human readable message describing the state.
       */
      message: string;
      /**
       * When did the task start.
       *
       * It's a date-time formatted as a ISO 8601 string, for instance "2025-01-31T09:46:07.404Z".
       */
      startedAt: string;
      /**
       * When did the task end.
       *
       * It's a date-time formatted as a ISO 8601 string, for instance "2025-01-31T09:46:07.404Z".
       */
      endedAt: string;
      /**
       * How long did the ingestion last in total, from the very beginning to the very end, without error interruption time.
       * It is NOT simply the time between startedAt and endedAt. It is the total processing time.
       *
       * Duration is returned as a number of seconds.
       */
      durationSeconds: number;
    }
  | {
      /**
       * Ingestion has been stopped upon request.
       */
      state: 'stopped';
      /**
       * A human readable message describing the state.
       */
      message: string;
      /**
       * When did the task start.
       *
       * It's a date-time formatted as a ISO 8601 string, for instance "2025-01-31T09:46:07.404Z".
       */
      startedAt: string;
      /**
       * When was the task stopped.
       *
       * It's a date-time formatted as a ISO 8601 string, for instance "2025-01-31T09:46:07.404Z".
       */
      endedAt: string;
      /**
       * How long did the ingestion run from the start til it was stopped.
       *
       * Duration is returned as a number of seconds.
       */
      durationSeconds: number;
    };

/**
 *  Informations about the entity resolution license, across all data-sources.
 */
export interface EntityResolutionLicenseInfo {
  /**x
   * The number of records ingested.
   */
  recordsIngested: number;

  /**
   * The number of records available in the license.
   */
  recordsAvailable: number;

  /**
   * Whether the license is an evaluation license.
   */
  isEvaluationLicense: boolean;

  /**
   * Number of ingested records per data-source:
   * - Keys are data source keys
   * - Values are number of records
   */
  ingestedRecordsPerDataSource: Record<string, number>;

  /**
   * The expiration date of the license.
   *
   * yyyy-mm-dd format
   */
  expirationDate: string;

  /**
   * The license status.
   */
  status: 'valid' | 'expired' | 'noCredits';
}

/**
 *  The entity resolution metrics, for a given data-source.
 */
export interface EntityResolutionMetrics {
  /**
   * The number of records ingested.
   */
  recordsIngested: number;
  /**
   * The number of entities created in the graph database.
   */
  entitiesCreated: number;
  /**
   * The number of records that are identified as a duplicate of another one, and is resolved by an entity.
   */
  fullDuplicates: number;
  /**
   * The number of `POSSIBLY_SAME` relations between entities.
   */
  possibleDuplicates: number;
  /**
   * The number of `POSSIBLY_RELATED` relations between entities.
   */
  possibleRelationships: number;
}

export interface ExplainWhyRecordParams extends IDataSourceParams {
  /**
   * The ID of the record to explain. It corresponds to the ID of the record node in the graph
   * database.
   */
  recordId: string;
}

export interface ExplainWhyEntitiesParams extends IDataSourceParams {
  /**
   * The ID of the first entity to explain. It corresponds to the `entityId` property of the entity
   * node in the graph database.
   */
  entityId: number;
  /**
   * The ID of the other related entity.
   */
  otherEntityId: number;
}

export interface GetEntityByIdParams extends IDataSourceParams {
  /**
   * The ID of the first entity to explain. It corresponds to the `entityId` property of the entity
   * node in the graph database.
   */
  entityId: number;
}

export interface WhyRecord {
  matchLevelCode: 'RESOLVED';
  matchKey: MatchKey;
  entityResolutionRuleCode: string;
  matchScores: MatchScore<ScoredValue>[];
}

export interface WhyEntities {
  matchLevelCode: 'POSSIBLY_SAME' | 'POSSIBLY_RELATED';
  matchKey: MatchKey;
  entityResolutionRuleCode: string;
  matchScores: MatchScore<ScoredPair>[];
}

export interface MatchKey {
  /**
   * The serialized form of the match key, for instance `+NAME+ADDRESS-DOB`.
   */
  value: string;
  same: EntityAttributeKey[];
  different: EntityAttributeKey[];
  ambiguous: boolean;
}

interface MatchScore<T> {
  key: EntityAttributeKey;
  values: T[];
}

export interface Score {
  percentage: number;
  bucket: 'SAME' | 'CLOSE' | 'PLAUSIBLE' | 'NO_CHANCE';
}

export interface ScoredValue {
  value: string;
  score: Score;
}

export interface ScoredPair {
  inbound: {id: string; value: string};
  candidate: {id: string; value: string};
  score: Score;
}

export type EntityAttributeKey =
  | 'Account number'
  | 'Address'
  | 'Citizenship'
  | 'Date of birth'
  | 'Date of death'
  | 'Driver license'
  | 'DUNS number'
  | 'Email'
  | 'Facebook'
  | 'Gender'
  | 'Group association'
  | 'Instagram'
  | 'LEI number'
  | 'LinkedIn'
  | 'Name'
  | 'Nationality'
  | 'National ID'
  | 'NPI number'
  | 'Passport'
  | 'Phone'
  | 'Place of birth'
  | 'Record type'
  | 'Registration country'
  | 'Registration date'
  | 'Signal'
  | 'Social security number'
  | 'Skype'
  | 'Tango'
  | 'Tax ID'
  | 'Telegram'
  | 'Twitter'
  | 'Viber'
  | 'Website'
  | 'Wechat'
  | 'WhatsApp'
  | 'Zoom room';

export interface ResolvedEntity {
  id: number;
  name: string;
  type: EntityResolutionRecordType;
  records: EntityRecord[];
  relatedEntities: RelatedEntity[];
}

export interface EntityRecord extends EntityResolutionMatch {
  id: string;
}

export interface RelatedEntity extends EntityResolutionMatch {
  id: number;
  name: string;
  ambiguous: boolean;
}

export interface EntityResolutionMatch {
  matchKey: MatchKey;
  matchLevel: number;
  matchLevelCode: `${MatchLevel}`;
  entityResolutionRuleCode: string;
}

export enum MatchLevel {
  RESOLVED = 'RESOLVED',
  POSSIBLY_SAME = 'POSSIBLY_SAME',
  POSSIBLY_RELATED = 'POSSIBLY_RELATED'
  // These are known match level codes, some might be added later
}
