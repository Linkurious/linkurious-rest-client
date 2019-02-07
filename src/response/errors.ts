/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 08/01/2019.
 *
 * File: unauthorized
 * Description :
 */

'use strict';

import { ServerResponse } from './index';
import { Tools } from 'linkurious-shared';

export type RejectionKey =
  | 'bad_graph_request'
  | 'constraint_violation'
  | 'dataSource_unavailable'
  | 'forbidden'
  | 'graph_request_timeout'
  | 'graph_unreachable'
  | 'group_exists'
  | 'guest_disabled'
  | 'invalid_parameter'
  | 'not_found'
  | 'unauthorized'
  | 'write_forbidden';

export interface BadGraphRequest extends ServerRejection {}
export interface ConstraintViolation extends ServerRejection {}
export interface DataSourceUnavailable extends ServerRejection {}
export interface Forbidden extends ServerRejection {}
export interface GraphRequestTimeout extends ServerRejection {}
export interface GraphUnreachable extends ServerRejection {}
export interface GroupExists extends ServerRejection {}
export interface GuestDisabled extends ServerRejection {}
export interface InvalidParameter extends ServerRejection {}
export interface NotFound extends ServerRejection {}
export interface Unauthorized extends ServerRejection {}
export interface WriteForbidden extends ServerRejection {}

export class ServerRejection extends ServerResponse<RejectionKey> {
  public readonly message: string;
  public readonly status: number;
  private readonly _data: any;

  constructor(e: { key: RejectionKey; message: string; status: number; data?: any }) {
    super(e.key);
    this.message = e.message;
    this.status = e.status;
    this._data = e.data || {};
  }

  /**
   * Return true if an offset exists in rejection
   */
  public get hasOffset(): boolean {
    return Tools.isDefined(this._data.offset);
  }

  /**
   * Return the offset error
   */
  public get offset(): { offset: number; length?: number } {
    return this.hasOffset ? this._data.offset : undefined;
  }

  public isBadGraphRequest(): this is BadGraphRequest {
    return this.key === 'bad_graph_request';
  }
  public isConstraintViolation(): this is ConstraintViolation {
    return this.key === 'constraint_violation';
  }
  public isDatasourceUnavailable(): this is DataSourceUnavailable {
    return this.key === 'dataSource_unavailable';
  }
  public isForbidden(): this is Forbidden {
    return this.key === 'forbidden';
  }
  public isGraphRequestTimeout(): this is GraphRequestTimeout {
    return this.key === 'graph_request_timeout';
  }
  public isGraphUnreachable(): this is GraphUnreachable {
    return this.key === 'graph_unreachable';
  }
  public isGroupExists(): this is GroupExists {
    return this.key === 'group_exists';
  }
  public isGuestDisabled(): this is GuestDisabled {
    return this.key === 'guest_disabled';
  }
  public isInvalidParameter(): this is InvalidParameter {
    return this.key === 'invalid_parameter';
  }
  public isNotFound(): this is NotFound {
    return this.key === 'not_found';
  }
  public isUnauthorized(): this is Unauthorized {
    return this.key === 'unauthorized';
  }
  public isWriteForbidden(): this is WriteForbidden {
    return this.key === 'write_forbidden';
  }
}
