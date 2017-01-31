/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2017
 *
 * Created by maximeallex on 2017-01-30.
 */
'use strict';

module.exports = function(echidna) {
  const exec = echidna.utils.exec;

  // 1) Download and build linkurious.js
  return echidna.get('Linkurious/linkurious-server')
    .then(echidnaServer => {

    // 4) Start Neo4j and elasticsearch
    exec('docker run --name="neo4j_test_client" -d -p 7484:7474 -e NEO4J_AUTH=none neo4j:3.0');
    exec('docker run --name="es_test_client" -d -p 9200:9200 elasticsearch:1.7');
    // note: docker has bound the service to the host machine (the one running strider)
    // we need to bind the service to the docker container running this script

    exec('redir --lport=9200 --laddr=0.0.0.0 --cport=9200 ' +
      '--caddr=$(ip route show | awk \'/default/ {print $3}\') &'); // caddr is the host machine IP
    exec('redir --lport=7484 --laddr=0.0.0.0 --cport=7484 ' +
      '--caddr=$(ip route show | awk \'/default/ {print $3}\') &');

    // 5) Run grunt build
    exec('npm run test');
  }).finally(() => {
    // 6) Stop Neo4j and elasticsearch
    exec('docker rm -vf neo4j_test_client es_test_client || true');
  });
};
