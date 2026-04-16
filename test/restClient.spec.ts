/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-12-05.
 */
import * as assert from 'node:assert';

import {describe, it} from 'mocha';

import {DataSourceUserInfo, LkErrorKey, Request, RestClient} from '../src/';

describe('Rest Client', () => {
  describe('getCurrentSource', () => {
    it('Should find the correct data-source by index', () => {
      // We actually use a partial interface for 'sources', hence the type assertion.
      const sources = [
        {configIndex: 0, connected: false},
        {configIndex: 1, connected: true},
        {configIndex: 3, connected: true}
      ] as DataSourceUserInfo[];

      assert.deepStrictEqual(RestClient.getCurrentSource(sources, {configIndex: 0}), sources[0]);
      assert.deepStrictEqual(RestClient.getCurrentSource(sources, {configIndex: 1}), sources[1]);
      assert.deepStrictEqual(RestClient.getCurrentSource(sources, {configIndex: 3}), sources[2]);
      assert.deepStrictEqual(RestClient.getCurrentSource(sources, {configIndex: 5}), sources[1]);
    });

    it('Should find the correct data-source by user id', () => {
      const sourceByUserId = new Map([
        ['lk-lastSeenSourceKey-1', 's1'],
        ['lk-lastSeenSourceKey-2', 's2'],
        ['lk-lastSeenSourceKey-3', 's3']
      ]);

      const storage = {
        getItem: (key: string) => sourceByUserId.get(key) || null
      } as Storage;

      const sources = [
        {key: 's1', connected: false},
        {key: 's2', connected: true},
        {key: 's3', connected: true}
      ] as DataSourceUserInfo[];

      assert.deepStrictEqual(
        RestClient.getCurrentSource(sources, {userId: 1}, storage),
        sources[1]
      );
      assert.deepStrictEqual(
        RestClient.getCurrentSource(sources, {userId: 2}, storage),
        sources[1]
      );
      assert.deepStrictEqual(
        RestClient.getCurrentSource(sources, {userId: 3}, storage),
        sources[2]
      );
      assert.deepStrictEqual(
        RestClient.getCurrentSource(sources, {userId: 5}, storage),
        sources[1]
      );
    });

    it('Should find the correct data-source by sourceKey', () => {
      const sources = [
        {key: 's1', connected: false},
        {key: 's2', connected: true},
        {key: 's3', connected: true}
      ] as DataSourceUserInfo[];

      assert.deepStrictEqual(RestClient.getCurrentSource(sources, {sourceKey: 's1'}), sources[0]);
      assert.deepStrictEqual(RestClient.getCurrentSource(sources, {sourceKey: 's2'}), sources[1]);
      assert.deepStrictEqual(RestClient.getCurrentSource(sources, {sourceKey: 's3'}), sources[2]);
      assert.deepStrictEqual(RestClient.getCurrentSource(sources, {sourceKey: 's5'}), sources[1]);
    });
  });

  describe('renderURL', () => {
    it('Should render URL correctly', () => {
      assert.deepStrictEqual(
        // @ts-ignore private method and incomplete params
        Request.renderURL({
          url: '/visualizations/:visualizationId/share/:userId',
          params: {
            visualizationId: 1,
            userId: 2
          }
        }).url,
        '/visualizations/1/share/2'
      );
    });
  });

  describe('getFetchConfig', () => {
    it('Should generate the correct URL/body for a GET request', () => {
      const restClient = new RestClient({baseUrl: 'https://lol.com'});
      const now = Date.now();
      const c = Request.getFetchConfig(
        {
          url: '/hello',
          method: 'GET',
          params: {
            lol: 123
          },
          errors: []
        },
        restClient.linkurious.props,
        now
      );

      assert.deepStrictEqual(c.method, 'GET');
      assert.deepStrictEqual(c.url.toString(), `https://lol.com/api/hello?_=${now}&lol=123`);
      assert.deepStrictEqual(c.body, undefined);
    });

    it('Should generate the correct URL/body for a POST request', () => {
      const restClient = new RestClient({baseUrl: 'https://lol.com'});
      const now = Date.now();
      const c = Request.getFetchConfig(
        {
          url: '/hello',
          method: 'post' as 'POST',
          params: {
            lol: 123
          },
          errors: []
        },
        restClient.linkurious.props,
        now
      );

      assert.deepStrictEqual(c.method, 'POST');
      assert.deepStrictEqual(c.url.toString(), `https://lol.com/api/hello?_=${now}`);
      assert.deepStrictEqual(c.body, {lol: 123});
    });

    it('Should fail if the URL is invalid', () => {
      const restClient = new RestClient({baseUrl: './'});
      assert.throws(() => {
        Request.getFetchConfig(
          {
            url: '/hello',
            method: 'GET',
            params: {},
            errors: []
          },
          restClient.linkurious.props,
          Date.now()
        );
      });
    });
  });

  describe('getStatus', () => {
    it('Should fail with CONNECTION_REFUSED if it cannot reach the server', async () => {
      const rc = new RestClient({baseUrl: 'http://localhost:1999'});
      const r = await rc.linkurious.getStatus();
      assert.equal(r.isSuccess(), false, 'Expect response to be an error');
      assert.equal(r.isError(LkErrorKey.CONNECTION_REFUSED), true);
    });
  });
});
