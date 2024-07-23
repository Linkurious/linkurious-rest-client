/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2024
 *
 * - Created on 2024-07-29.
 */

export interface EntityResolutionStatus {
  state: 'needed' | 'ongoing' | 'done';
  progress: string;
  message: string;
}
