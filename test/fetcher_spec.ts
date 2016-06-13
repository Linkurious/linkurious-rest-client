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

import {Fetcher} from '../dist/http/fetcher';
import {Logger} from '../dist/log/Logger';

export class FetcherSpec {
  constructor () {
  }

  static test () {
    describe('Fetcher class', () =>{
      let logger:Logger, fetcher:Fetcher;

      it('must throw if key is not defined', (done) => {
        fetcher = new Fetcher(logger, {user:undefined, currentSource:undefined}, 'http://127.0.0.1:3001');

        let fetch = fetcher.fetch;

        fetch({
          url : '/test/{dataSourceKey}',
          method : 'GET'
        }).catch((res:any) => {
          expect(fetch).toThrow();
          done();
        })
      });

      it('must return the right lkError object', (done) => {
        fetcher = new Fetcher(logger, {user:undefined, currentSource:undefined}, 'http://127.0.0.1:3001');

        fetcher.fetch({
          url : '/test/{dataSourceKey}',
          method : 'GET'
        }).catch((res:any) => {
          expect(res).toEqual(jasmine.objectContaining({
            status:0
          }));
          expect(res).toEqual(jasmine.objectContaining({
            type:'client'
          }));
          done();
        })
      });

      beforeEach(() => {
        logger  = new Logger('quiet');
        fetcher = new Fetcher(logger, {user:undefined, currentSource:{name: 'Database #0', key: '66a2bc71', configIndex: 0}}, 'http://127.0.0.1:3001');
      });

      it('must return an error', (done) => {
        var fetch = fetcher.fetch;

        fetch({
          url : '/test',
          method : 'GET'
        }).catch((res:any) => {
          expect(fetch).toThrow();
          done();
        })
      });
    });
  }
}

