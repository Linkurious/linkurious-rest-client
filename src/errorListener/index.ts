/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 2019-03-13.
 *
 * File: index
 * Description :
 */

'use strict';

import { Rejection } from '../response/errors';

type EventCallback = (e: Rejection) => unknown;

export class ErrorListener {
  private _triggerListen: EventCallback | undefined;

  constructor() {
    this._triggerListen = undefined;
  }

  /**
   * Trigger the listener when a new error is catch
   */
  public catch(e: Rejection): void {
    if (this._triggerListen !== undefined) {
      this._triggerListen(e);
    }
  }

  /**
   * Store the method defined
   */
  public listen(fn: EventCallback): void {
    this._triggerListen = fn;
  }
}
