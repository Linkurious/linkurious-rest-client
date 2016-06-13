/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-06-10.
 *
 * File:
 * Description :
 */
'use strict';

import {DefaultLoggerDriver} from '../dist/log/DefaultLoggerDriver';

export class DefaultLoggerDriverSpec {
  constructor(){}

  static test(){

    let defaultLogger:DefaultLoggerDriver;

    beforeEach(() => {
      defaultLogger = new DefaultLoggerDriver();
    });

    describe('debug method', () => {
      it('must return the right log', () => {
        spyOn(console, 'debug');
        defaultLogger.debug('test');

        expect(console.debug).toHaveBeenCalled();
      });
    });

    describe('error method', () => {
      it('must return the right log', () => {
        spyOn(console, 'error');
        defaultLogger.error('test');

        expect(console.error).toHaveBeenCalled();
      });
    });

  }
}