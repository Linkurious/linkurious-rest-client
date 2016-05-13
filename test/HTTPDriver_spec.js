/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-11.
 *
 * File:
 * Description :
 */
'use strict';

const should = require('should');
const HTTPDriver = require('./../built/HTTPDriver');

describe('HTTPDriver class', function(){

  let httpDriver;

  beforeEach(function(){
    httpDriver = new HTTPDriver.default();
  });

  describe('createConfig method', function(){
    it('must return the good object if method is POST without data', function(){
      let test = httpDriver.createConfig('POST', '/api/test');

      test.should.not.have.property('body');
      test.should.not.have.property('qs');
    });

    it('must return the good object if method is POST with data', function(){
      let test = httpDriver.createConfig('POST', '/api/test', {testKey:'testValue'});

      test.should.containDeep({body : {testKey:'testValue'}});
      test.should.not.have.property('qs');
    });

    it('must return the good object if method is PUT without data', function(){
      let test = httpDriver.createConfig('PUT', '/api/test');

      test.should.not.have.property('body');
      test.should.not.have.property('qs');
    });

    it('must return the good object if method is PUT with data', function(){
      let test = httpDriver.createConfig('PUT', '/api/test', {testKey:'testValue'});

      test.should.containDeep({body : {testKey:'testValue'}});
      test.should.not.have.property('qs');
    });

    it('must return the good object if method is PATCH without data', function(){
      let test = httpDriver.createConfig('PATCH', '/api/test');

      test.should.not.have.property('body');
      test.should.not.have.property('qs');
    });

    it('must return the good object if method is PATCH with data', function(){
      let test = httpDriver.createConfig('PATCH', '/api/test', {testKey:'testValue'});

      test.should.containDeep({body : {testKey:'testValue'}});
      test.should.not.have.property('qs');
    });

    it('must return the good object if method is DELETE without data', function(){
      let test = httpDriver.createConfig('DELETE', '/api/test');

      test.should.not.have.property('body');
      test.should.not.have.property('qs');
    });

    it('must return the good object if method is DELETE with data', function(){
      let test = httpDriver.createConfig('DELETE', '/api/test', {testKey:'testValue'});

      test.should.containDeep({body : {testKey:'testValue'}});
      test.should.not.have.property('qs');
    });

    it('must return the good object if method is GET without data', function(){
      let test = httpDriver.createConfig('GET', '/api/test');

      test.should.not.have.property('body');
      test.should.not.have.property('qs');
    });

    it('must return the good object if method is GET with data', function(){
      let test = httpDriver.createConfig('GET', '/api/test', {testKey:'testValue'});

      test.should.containDeep({qs : {testKey:'testValue'}});
      test.should.not.have.property('body');
    });
  })
});