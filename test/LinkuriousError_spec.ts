/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-06-09.
 *
 * File:
 * Description :
 */

import {expect} from 'chai';
import 'mocha';
import {LinkuriousError} from '../src/LinkuriousError';

export class LinkuriousErrorSpec {
  constructor() {}

  public static test() {
    describe('fromHttpResponse method', () => {
      it('must return a communication error', () => {
        const linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode: undefined,
          body: 'test',
          header: undefined
        });

        expect(linkuriousError.type).to.eql('communication');

        expect(linkuriousError.key).to.eql('communication_error');

        expect(linkuriousError.message).to.eql('Could not get response from server');
      });
    });

    describe('fromError method', () => {
      it('must return the good lkError object', () => {
        const error = new Error('test error');
        const linkuriousError = LinkuriousError.fromError(error);

        expect(linkuriousError.key).to.eql('critical');

        expect(linkuriousError.message).to.eql('Error: test error');
      });

      it('must return a error object to string', () => {
        const error = new Error();
        const linkuriousError = LinkuriousError.fromError(error);

        expect(linkuriousError.message).to.eql('{}');
        expect(typeof linkuriousError.cause).to.eql('object');
      });
    });

    describe('getErrorType method', () => {
      it('must return a "communication" type', () => {
        const linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode: 12,
          body: 'test',
          header: undefined
        });

        expect(linkuriousError.type).to.eql('communication');
      });

      it('must return a "access" type', () => {
        let linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode: 401,
          body: 'test',
          header: undefined
        });

        expect(linkuriousError.type).to.eql('access');

        linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode: 403,
          body: 'test',
          header: undefined
        });

        expect(linkuriousError.type).to.eql('access');
      });

      it('must return a "technical" type', () => {
        const linkuriousError = LinkuriousError.fromHttpResponse({
          statusCode: 503,
          body: 'test',
          header: undefined
        });

        expect(linkuriousError.type).to.eql('technical');
      });
    });
  }
}
