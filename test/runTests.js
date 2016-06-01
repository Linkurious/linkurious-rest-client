/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-13.
 *
 * File:
 * Description :
 */
'use strict';

const Mocha    = require('mocha');
const fs       = require('fs-extra');
const path     = require('path');
const request  = require('request');
let retry      = 0;
global.sourceKey  = null;
const maxRetry = 50;

const LKE = require('../../linkurious-server/server/services');
LKE.init({mode: 'test'});
console.log('LKE VERSION: ' + LKE.getVersionString());
var Config = LKE.get('configuration');
Config.load();

/**
 *
 * @param {string} uri
 * @returns {Promise.<object>}
 */
function queryTestServer(uri) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri   : 'http://localhost:3001' + uri,
      json  : true
    },(err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}

/**
 *
 * @returns {Promise.<boolean>}
 */
function testConnection() {
  var sourceKeyPromise = global.sourceKey !== null
    ? Promise.resolve(global.sourceKey)
    : queryTestServer('/api/dataSources').then(r => global.sourceKey = r.sources[0].key);

  if (retry++ > maxRetry) {
    console.log(`Check indexation status: Giving up after ${retry} tries`);
    return Promise.resolve(false);
  }

  console.log(`check for indexation to be done (${retry}/${maxRetry})`);
  return sourceKeyPromise.then(sourceKey => {
    return queryTestServer(`/api/${sourceKey}/search/status`)
  }).then(body => {
    return body.indexing === 'done';
  }).then(isServerReady => {
    if (isServerReady === false) {
      return testConnection();
    }
    console.log('Indexation done :)');
    return true;
  }).catch(e => {
    console.log(JSON.stringify(e.stack.split('\s*\n\s*'), null, ' '));
    process.exit(0);
  })
}

function runTests() {
  const mocha = new Mocha({
    // stop tests on first failure
    bail: true,
    // provide describe(), context(), it(), specify(), before(), after(), beforeEach(), and afterEach().
    ui: 'bdd',
    // default reporter
    reporter: 'spec',
    // 10 seconds per test max.
    timeout: 10000,
    // show slow tests in different colors
    slow: 80
  });

  var testDir = path.resolve(__dirname);
  fs.readdirSync(testDir).filter(file => {
    return file.match(/_spec\.js$/);
  }).forEach(file => {
    mocha.addFile(path.resolve(testDir, file));
  });

  console.log('Launching tests ...');
  // Run the tests.
  var failures = undefined;
  mocha.run(_failures => { failures = _failures }).on('end', () => {
    console.log('failures: '+ failures);
    process.exit(failures);
  });
}

/**
 * run as test server (for client tests)
 */
function runAsTestServer() {
  console.log('Running as test server ...');

  return utils.cleanUpDatabases().then(() => {
    // add a route to allow the client to reset the database during tests
    var app = LKE.get('webServer').app;
    app.delete('/api/cleanup/all', function (req, res) {
      utils.cleanUpDatabases().then(
        function () {
          res.apiReturn(200, {message: 'Everything cleaned up successfully'});
        },
        function (err) {
          res.apiReturn(500, {
            message: 'Something went terribly wrong on cleanup',
            error  : err
          });
        }
      );
    });
  });
}

// CLEAN SQLITE FILES
function clearEnvFiles() {
  const filesToDelete = [Config.get('db.options.storage')];
  filesToDelete.forEach(file => {
    file = LKE.dataFile(file);
    if (!fs.existsSync(file)) {
      return;
    }
    fs.removeSync(file);
    console.log('* ' + file + ' deleted');
  });
}
clearEnvFiles();

var utils = require('../../linkurious-server/test/utils');

Promise.resolve().then(() => {
  // switch to desired graph DB before running APP and tests.
  var graphConfig = {
    vendor: 'neo4j',
    url   : 'http://127.0.0.1:7484'
  };

  console.log('Using data-source configuration: ' + JSON.stringify(graphConfig));
  graphConfig.alternativeNodeId               = 'name';
  graphConfig.alternativeEdgeId               = 'altEdgeID';
  Config.defaultConfig.dataSources[0].graphdb = graphConfig;

  // force enterprise/starter edition
  LKE.getRelease().enterprise = true;

  console.log('Starting Backend server.');
  return require('../../linkurious-server/server/app');
}).then(function () {
  // check state after APP start
  var StateMachine = LKE.get('stateMachine');
  var state        = StateMachine.get().code;
  if (state !== 200) {
    console.error('Unexpected Backend state: ' + state);
    return Promise.reject();
  }
}).then(() => {
  return runAsTestServer();
}).then(() => {
  return testConnection();
}).then(() => {
  runTests();
});