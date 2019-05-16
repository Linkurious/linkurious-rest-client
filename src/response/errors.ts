/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 08/01/2019.
 *
 * File: unauthorized
 * Description :
 */

import {Tools} from 'linkurious-shared';
import {ServerResponse} from './index';

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
  | 'write_forbidden'
  | 'cancelled'
  | 'client_error';

export class Rejection extends ServerResponse<RejectionKey> {
  public readonly message: string | undefined;
  public readonly status: number | undefined;
  public readonly stack: string[] | undefined;
  private readonly _data: any;

  constructor(e: {
    key: RejectionKey;
    message?: string;
    status?: number;
    data?: any;
    cause?: Error;
  }) {
    super(e.key);
    this.message = e.message;
    this.status = e.status;
    this._data = e.data || {};
    this.stack = e.cause && e.cause.stack ? e.cause.stack.split(/\n/g) : undefined;
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
  public get offset(): {offset: number; length?: number} {
    return this.hasOffset ? this._data : undefined;
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
  public isPromiseCancelled(): this is Cancelled {
    return this.key === 'cancelled';
  }
  public isClientError(): this is ClientError {
    return this.key === 'client_error';
  }
}

export class BadGraphRequest extends Rejection {
  constructor() {
    super({key: 'bad_graph_request'});
  }
}
export class ConstraintViolation extends Rejection {
  constructor() {
    super({key: 'constraint_violation'});
  }
}
export class DataSourceUnavailable extends Rejection {
  constructor() {
    super({key: 'dataSource_unavailable'});
  }
}
export class Forbidden extends Rejection {
  constructor() {
    super({key: 'forbidden'});
  }
}
export class GraphRequestTimeout extends Rejection {
  constructor() {
    super({key: 'graph_request_timeout'});
  }
}
export class GraphUnreachable extends Rejection {
  constructor() {
    super({key: 'graph_unreachable'});
  }
}
export class GroupExists extends Rejection {
  constructor() {
    super({key: 'group_exists'});
  }
}
export class GuestDisabled extends Rejection {
  constructor() {
    super({key: 'guest_disabled'});
  }
}
export class InvalidParameter extends Rejection {
  constructor() {
    super({key: 'invalid_parameter'});
  }
}
export class NotFound extends Rejection {
  constructor() {
    super({key: 'not_found'});
  }
}
export class Unauthorized extends Rejection {
  constructor() {
    super({key: 'unauthorized'});
  }
}
export class WriteForbidden extends Rejection {
  constructor() {
    super({key: 'write_forbidden'});
  }
}
export class Cancelled extends Rejection {
  constructor() {
    super({key: 'cancelled'});
  }
}
export class ClientError extends Rejection {
  constructor() {
    super({key: 'client_error'});
  }
}
