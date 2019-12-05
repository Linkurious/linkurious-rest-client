/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-12-05.
 */
import {describe, it} from 'mocha';
import {assert} from 'chai';

import {RestClient} from '../src';

describe('Rest Client', () => {
  it('Should find the correct data-source by index', () => {
    const sources = [
      {configIndex: 0, connected: false},
      {configIndex: 1, connected: true},
      {configIndex: 3, connected: true}
    ];

    assert.deepEqual(
      //@ts-ignore partial interface for sources, local storage not used in this test
      RestClient.getCurrentSource(sources, {configIndex: 0}, null),
      sources[0]
    );

    assert.deepEqual(
      //@ts-ignore partial interface for sources, local storage not used in this test
      RestClient.getCurrentSource(sources, {configIndex: 1}, null),
      sources[1]
    );

    assert.deepEqual(
      //@ts-ignore partial interface for sources, local storage not used in this test
      RestClient.getCurrentSource(sources, {configIndex: 3}, null),
      sources[2]
    );

    assert.deepEqual(
      //@ts-ignore partial interface for sources, local storage not used in this test
      RestClient.getCurrentSource(sources, {configIndex: 5}, null),
      sources[1]
    );
  });

  it('should find the correct data-source by user id', () => {
    const sourceByUserId = new Map([
      ['lk-lastSeenSourceKey-1', 's1'],
      ['lk-lastSeenSourceKey-2', 's2'],
      ['lk-lastSeenSourceKey-3', 's3']
    ]);

    const getLocalStorage = () => ({
      getItem: (key: string) => sourceByUserId.get(key) || null
    });

    const sources = [
      {key: 's1', connected: false},
      {key: 's2', connected: true},
      {key: 's3', connected: true}
    ];

    assert.deepEqual(
      //@ts-ignore partial interface for sources
      RestClient.getCurrentSource(sources, {userId: 1}, getLocalStorage),
      sources[1]
    );

    assert.deepEqual(
      //@ts-ignore partial interface for sources
      RestClient.getCurrentSource(sources, {userId: 2}, getLocalStorage),
      sources[1]
    );

    assert.deepEqual(
      //@ts-ignore partial interface for sources
      RestClient.getCurrentSource(sources, {userId: 3}, getLocalStorage),
      sources[2]
    );

    assert.deepEqual(
      //@ts-ignore partial interface for tests
      RestClient.getCurrentSource(sources, {userId: 5}, getLocalStorage),
      sources[1]
    );
  });

  it('should find the correct data-source by sourceKey', function() {
    const sources = [
      {key: 's1', connected: false},
      {key: 's2', connected: true},
      {key: 's3', connected: true}
    ];

    assert.deepEqual(
      //@ts-ignore partial interface for sources, local storage not used in this test
      RestClient.getCurrentSource(sources, {sourceKey: 's1'}, null),
      sources[0]
    );

    assert.deepEqual(
      //@ts-ignore partial interface for sources, local storage not used in this test
      RestClient.getCurrentSource(sources, {sourceKey: 's2'}, null),
      sources[1]
    );

    assert.deepEqual(
      //@ts-ignore partial interface for sources, local storage not used in this test
      RestClient.getCurrentSource(sources, {sourceKey: 's3'}, null),
      sources[2]
    );

    assert.deepEqual(
      //@ts-ignore partial interface for sources, local storage not used in this test
      RestClient.getCurrentSource(sources, {sourceKey: 's5'}, null),
      sources[1]
    );
  });
});
