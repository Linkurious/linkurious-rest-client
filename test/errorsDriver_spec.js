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
const LkError = require('../built/LinkuriousError').default;

describe('ErrorDriver', function(){

  describe('fromHttpResponse', function(){

    it('must return a formatted object with 401 access type', function(){

      let response = {
        statusCode : 401,
        body: {
          key : 'test',
          message : 'test message'
        }
      };
      LkError.fromHttpResponse(response).should.eql({
        status  : 401,
        type    : 'access',
        key     : 'test',
        message : 'test message'
      });
    });

    it('must return a formatted object with 403 access type', function(){
      let incomingMessage = {
        statusCode : 403,
        body: {
          key: 'test',
          message: 'test message'
        }
      };
      LkError.fromHttpResponse(incomingMessage).should.eql({
        status  : 403,
        type    : 'access',
        key     : 'test',
        message : 'test message'
      })
    });

    it('must return a formatted object with 501 communication type', function(){
      let incomingMessage = {
        statusCode: 501,
        body: {
          key: 'test',
          message: 'test message'
        }
      };
      LkError.fromHttpResponse(incomingMessage).should.eql({
        status  : 501,
        type    : 'technical',
        key     : 'test',
        message : 'test message'
      });
    });

    it('must return a formatted object with 500 communication type', function(){
      let incomingMessage = {
        statusCode : 500,
        body: {
          key: 'test',
          message: 'test message'
        }
      };
      LkError.fromHttpResponse(incomingMessage).should.eql({
        status  : 500,
        type    : 'technical',
        key     : 'test',
        message : 'test message'
      });
    });

    it('must return a formatted object with 301 business type', function(){
      let incomingMessage = {
        statusCode: 301,
        body: {
          key: 'test',
          message: 'test message'
        }
      };
      LkError.fromHttpResponse(incomingMessage).should.eql({
        status  : 301,
        type    : 'business',
        key     : 'test',
        message : 'test message'
      });
    });

    it('must return a formatted object with 404 business type', function(){
      let incomingMessage = {
        statusCode: 404,
        body: {
          key: 'test',
          message: 'test message'
        }
      };

      LkError.fromHttpResponse(incomingMessage).should.eql({
        status  : 404,
        type    : 'business',
        key     : 'test',
        message : 'test message'
      });
    });

  });

});
