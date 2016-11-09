/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * - Created by david on 2016-11-09.
 */
'use strict';

if ('production' === process.env['NODE_ENV']) {
  console.log('Skipping "typings install" in production.');
} else {
  require('child_process').execSync(
    'node typings install', {cwd: require('path').resolve(__dirname, '..')}
  );
}
