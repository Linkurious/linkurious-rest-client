/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-12-05.
 */
import * as assert from 'node:assert';

import {describe, it} from 'mocha';

import {RestClient} from '../src';
import {Request} from '../src/http/request';
import {DataSourceUserInfo} from '../src/api/DataSource';

describe('Rest Client', () => {
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

    assert.deepStrictEqual(RestClient.getCurrentSource(sources, {userId: 1}, storage), sources[1]);
    assert.deepStrictEqual(RestClient.getCurrentSource(sources, {userId: 2}, storage), sources[1]);
    assert.deepStrictEqual(RestClient.getCurrentSource(sources, {userId: 3}, storage), sources[2]);
    assert.deepStrictEqual(RestClient.getCurrentSource(sources, {userId: 5}, storage), sources[1]);
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
