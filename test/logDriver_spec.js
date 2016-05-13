/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-10.
 *
 * File:
 * Description :
 */
'use strict';

const should = require('should');
const bunyan     = require('bunyan');
const LogDriver = require('./../built/logDriver');

describe('logDriver class', function(){
  describe('constructor', function(){
    it('logDriver.level must be "quiet" and logDriver.logger.debug must be "console.debug" and logDriver.logger.error must be "console.error"', function(){
      let logger = new LogDriver.default('quiet');

      logger.level.should.equal('quiet');
      logger.logger.should.eql({
        debug : console.debug,
        error : console.error
      })
    });

    it('logDriver.logger must be bound to bunyan log functions', function(){

      let logFunctions = {
        error: m => bunyan.info(m),
        debug: m => bunyan.warn(m)
      };

      let logger = new LogDriver.default('quiet', logFunctions);

      logger.logger.should.eql({
        error: logFunctions.error,
        debug: logFunctions.debug
      });
    });
  });

  describe('debug method', function(){

    let testLog, logFunctions;

    beforeEach(function(){
      testLog = false;
      logFunctions = {
        debug: () => {
          testLog = true;
        }
      };
    });

    it('must return nothing if level is set to quiet', function(){

      let logger = new LogDriver.default('quiet', logFunctions);

      logger.debug({
        key : 'test key',
        message : 'test message'
      });

      testLog.should.equal(false);
    });

    it('must return nothing if level is set to error', function(){
      let logger = new LogDriver.default('error', logFunctions);

      logger.debug({
        key : 'test key',
        message : 'test message'
      });

      testLog.should.equal(false);
    });

    it('must return something if level is set to debug', function(){

      let logger = new LogDriver.default('debug', logFunctions);

      logger.debug({
        key : 'test key',
        message : 'test message'
      });

      testLog.should.equal(true);
    });
  });

  describe('error method', function(){

    let testLog, logFunctions;

    beforeEach(function(){
      testLog = false;
      logFunctions = {
        error: () => {
          testLog = true;
        }
      };
    });

    it('must return nothing if level is set to quiet', function(){

      let logger = new LogDriver.default('quiet', logFunctions);

      logger.error({
        key : 'test key',
        message : 'test message'
      });

      testLog.should.equal(false);
    });

    it('must return something if level is set to error', function(){
      let logger = new LogDriver.default('error', logFunctions);

      logger.error({
        key : 'test key',
        message : 'test message'
      });

      testLog.should.equal(true);
    });

    it('must return something if level is set to debug', function(){

      let logger = new LogDriver.default('debug', logFunctions);

      logger.error({
        key : 'test key',
        message : 'test message'
      });

      testLog.should.equal(true);
    });
  });
});