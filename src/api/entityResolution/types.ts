/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-07-29.
 */

/**
 * The supported record types.
 */
export const ENTITY_RESOLUTION_RECORD_TYPES = ['person', 'organization'] as const;

export type EntityResolutionRecordType = (typeof ENTITY_RESOLUTION_RECORD_TYPES)[number];

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
