/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-06-09.
 *
 * File:
 * Description :
 */
'use strict';

import {LinkuriousError} from '../dist/LinkuriousError';

export class LinkuriousErrorSpec {
  constructor(){}

  static test(){

    describe('fromHttpResponse method', () => {
      it('must return a communication error', () => {
        let linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode:undefined,
          body:'test',
          header:undefined
        });

        expect(linkuriousError).toEqual(jasmine.objectContaining({
          type:'communication'
        }));

        expect(linkuriousError).toEqual(jasmine.objectContaining({
          key:'communication_error'
        }));

        expect(linkuriousError).toEqual(jasmine.objectContaining({
          message:'Could not get response from server'
        }));
      });
    });

    describe('fromError method', () => {
      it('must return the good lkError object', ()=> {
        let error = new Error('test error');
        let linkuriousError = LinkuriousError.fromError(error);

        expect(linkuriousError).toEqual(jasmine.objectContaining({
          key:'unknown_error'
        }));

        expect(linkuriousError).toEqual(jasmine.objectContaining({
          message:'Error: test error'
        }));
      });

      it('must return a error object to string', () => {
        let error = new Error();
        let linkuriousError = LinkuriousError.fromError(error);

        expect(linkuriousError.message).toEqual('{}');
        expect(typeof linkuriousError.cause).toEqual('object');
      })
    });

    describe('get error stack', () => {
      it('must return the error stack', () => {
        try {
          jasmine.Ajax.install()
        } catch(e) {
          let linkuriousError = LinkuriousError.fromError(e);

          expect(linkuriousError.stack).toMatch('TypeError: Cannot read property \'install\' of' +
            ' undefined');
        }
      });

      it('must return an undefined stack', () => {
        let linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode:undefined,
          body:'test',
          header:undefined
        });

        expect(linkuriousError.stack).toBeUndefined();
      });
    });

    describe('get error stack in array', () => {
      it('must return the error stack in an array', () => {
        try {
          jasmine.Ajax.install()
        } catch(e) {
          let linkuriousError = LinkuriousError.fromError(e);

          expect(linkuriousError.stackArray.length).toEqual(11);
        }
      });

      it('must return an empty array stack', () => {
        let linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode:undefined,
          body:'test',
          header:undefined
        });

        expect(linkuriousError.stackArray.length).toBe(0);
      });
    });

    describe('getErrorType method', () => {
      it('must return a "communication" type', () => {
        let linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode:12,
          body:'test',
          header:undefined
        });

        expect(linkuriousError.type).toEqual('communication');
      });

      it('must return a "access" type', () => {
        let linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode:401,
          body:'test',
          header:undefined
        });

        expect(linkuriousError.type).toEqual('access');

        linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode:403,
          body:'test',
          header:undefined
        });

        expect(linkuriousError.type).toEqual('access');
      });

      it('must return a "technical" type', () => {
        let linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode:503,
          body:'test',
          header:undefined
        });

        expect(linkuriousError.type).toEqual('technical');
      });
    });
  }
}