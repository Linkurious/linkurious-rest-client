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
const Logger = require('./../built/Logger').default;
const DefaultLoggerDriver = require('./../built/Logger').DefaultLoggerDriver;

describe('logDriver class', function(){
  describe('constructor', function(){
    it('Logger.level must be "quiet"', function() {
      let logger = new Logger('quiet');

      logger.level.should.equal('quiet');
    });
    
    it('Logger.driver must be the default driver', function() {
      let logger = new Logger('quiet');
      logger.driver.debug.should.eql(DefaultLoggerDriver.prototype.debug);
      logger.driver.error.should.eql(DefaultLoggerDriver.prototype.error);
    });

    it('Logger.driver must be bound to bunyan log functions', function(){
      let bunyanDriver= {
        error: m => bunyan.error(m),
        debug: m => bunyan.debug(m)
      };
      let logger = new Logger('quiet', bunyanDriver);
      logger.driver.should.eql({
        error: bunyanDriver.error,
        debug: bunyanDriver.debug
      });
    });
  });

  describe('debug method', function(){
    let testLog, driver;

    beforeEach(function(){
      testLog = false;
      driver = {
        debug: () => {
          testLog = true;
        }
      };
    });

    it('must return nothing if level is set to quiet', function(){
      let logger = new Logger('quiet', driver);
      logger.debug({key : 'test key', message : 'test message'});
      testLog.should.equal(false);
    });

    it('must return nothing if level is set to error', function(){
      let logger = new Logger('error', driver);
      logger.debug({key : 'test key', message : 'test message'});
      testLog.should.equal(false);
    });

    it('must return something if level is set to debug', function(){
      let logger = new Logger('debug', driver);
      logger.debug({key : 'test key', message : 'test message'});
      testLog.should.equal(true);
    });
  });

  describe('error method', function(){
    let testLog, driver;

    beforeEach(function(){
      testLog = false;
      driver = {
        error: () => {
          testLog = true;
        }
      };
    });

    it('must return nothing if level is set to quiet', function(){
      let logger = new Logger('quiet', driver);

      logger.error({key : 'test key', message : 'test message'});

      testLog.should.equal(false);
    });

    it('must return something if level is set to error', function(){
      let logger = new Logger('error', driver);

      logger.error({key : 'test key', message : 'test message'});

      testLog.should.equal(true);
    });

    it('must return something if level is set to debug', function(){

      let logger = new Logger('debug', driver);

      logger.error({key : 'test key', message : 'test message'});

      testLog.should.equal(true);
    });
  });
});