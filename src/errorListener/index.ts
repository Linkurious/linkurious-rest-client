/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 2019-03-13.
 *
 * File: index
 * Description :
 */

import {LinkuriousError} from '../LinkuriousError';
import {Rejection} from '../response/errors';

type EventCallback = (e: Rejection) => unknown;

export class ErrorListener {
  private _triggerListen: EventCallback | undefined = undefined;

  constructor() {}

  /**
   * Trigger the listener when a new error is catch
   */
  public dispatch(e: Rejection): void {
    if (this._triggerListen !== undefined && typeof this._triggerListen === 'function') {
      this._triggerListen(e);
    }
  }

  /**
   * Store the method defined
   */
  public setErrorListener(fn: EventCallback): void {
    if (this._triggerListen !== undefined) {
      throw LinkuriousError.fromClientError('bug', 'You cannot set more than on error listener');
    } else {
      this._triggerListen = fn;
    }
  }
}
