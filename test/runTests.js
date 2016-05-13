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
let sourceKey  = null;
const maxRetry = 50;

const LKE = require('../../linkurious-server/server/services');
LKE.init({mode: 'test'});
console.log('LKE VERSION: ' + LKE.getVersionString());
var Config = LKE.get('configuration');
Config.load();

function testConnection() {
  return new Promise(function (resolve) {
    console.log('check for indexation to be done');
    if (retry++ < maxRetry) {
      if (!sourceKey) {
        request({
          method: 'GET',
          uri   : 'http://localhost:3001/api/datasources',
          json  : true
        }, function (err, res, bod) {
          if (err) {
            resolve(false);
          } else {
            if (res.statusCode === 200) {
              sourceKey = bod.sources[0].key;
              resolve(false);
            }
          }
        });
      } else {
        request({
          method: 'GET',
          uri   : 'http://localhost:3001/api/' + sourceKey + '/search/status',
          json  : true
        }, function (err, res, bod) {
          if (bod.indexing === 'done') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }
    }
  }).then(function (isServerReady) {
    if (isServerReady === false) {
      testConnection();
    }
    return true;
  })
}

function runTests() {
  const mocha = new Mocha();

  var testDir = './test';

  fs.readdirSync(testDir).filter(function (file) {
    return file.match(/_spec\.js/);
  }).forEach(function (file) {
    mocha.addFile(path.join(testDir, file));
  });

  mocha.run().on('end', function () {
    process.exit();
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
}).then(function () {
  return runAsTestServer();
}).then(function () {
  return testConnection();
}).then(function () {
  runTests();
});