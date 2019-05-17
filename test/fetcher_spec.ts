/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * Created by maximeallex on 2016-06-09.
 *
 * File:
 * Description :
 */

import {expect} from 'chai';
import 'mocha';
import {Fetcher} from '../src/http/fetcher';
import {Logger} from '../src/log/Logger';

describe('Fetcher class', () => {
  let logger: Logger, fetcher: Fetcher;

  it('must return the right lkError object', done => {
    fetcher = new Fetcher(
      logger,
      {
        user: undefined,
        currentSource: undefined,
        guestMode: false
      },
      'http://127.0.0.1:3001'
    );

    fetcher
      .fetch({
        url: '/test/{dataSourceKey}',
        method: 'GET'
      })
      .catch((res: any) => {
        expect(res.status).to.equal(0);
        expect(res.type).to.equal('client');
        done();
      });
  });

  beforeEach(() => {
    logger = new Logger('quiet');
    fetcher = new Fetcher(
      logger,
      {
        user: undefined,
        currentSource: {
          name: 'Database #0',
          key: '66a2bc71',
          configIndex: 0,
          connected: true,
          state: '',
          reason: '',
          features: {},
          settings: {}
        },
        guestMode: false
      },
      'http://127.0.0.1:3001'
    );
  });

  it('must return an error', () => {
    return fetcher
      .fetch({
        url: '/test',
        method: 'GET'
      })
      .catch(res => {
        expect(res.key).to.equal('api_not_found');
      });
  });
});
