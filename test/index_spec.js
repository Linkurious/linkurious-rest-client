/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-10.
 *
 * File:
 * Description :
 */
'use strict';

const should = require('should');
const Linkurious = require('../built/index');
const Logger = require('../built/log/Logger').Logger;
const Fetcher = require('../built/http/fetcher').default;
const AdminModule = require('../built/module/AdminModule').default;

describe('Linkurious class', function(){

  let linkurious, testLog, logDriver, edgeID, nodeId, sourceKey;

  beforeEach(function(){
    testLog = false;
    logDriver = {
      debug: () => {},
      error: () => {
        testLog = true;
      }
    };
    linkurious = new Linkurious('http://localhost:3001', 'error', logDriver);
    sourceKey = global.sourceKey;
  });

  describe('constructor', function(){

    it('log must be an instance of logDriver', function(){
      linkurious._logger.should.be.an.instanceOf(Logger);
    });

    it('fetcher must be an instance of fetcher', function(){
      linkurious._fetcher.should.be.an.instanceOf(Fetcher);
    });

    it('admin must be an instance of admin', function(){
      linkurious.admin.should.be.an.instanceOf(AdminModule);
    });
  });

  describe('searchNodes method', function(){
    it('must return a node', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.search.nodes({
          q : 'Keanu Reeves'
        });
      }).then(function(res){
        res.type.should.equal('node');
        res.totalHits.should.equal(1);
        res.results[0].title.should.equal('Person');

        nodeId = res.results[0].children[0].id;
      });
    });

    it('must return an edge', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.search.edges({
          q : 'ACTED_IN'
        });
      }).then(function(res){
        res.type.should.equal('edge');
        res.totalHits.should.equal(7);
        edgeID = res.results[0].children[0].id;
      });
    });
  });

  describe('transformUrl method', function(){

    it('must throw a console if no dataSource is set', function(){
      linkurious._fetcher.transformUrl.bind(null, '/{dataSource}/api/test').should.throw()
    });

    it('must construct the url without sourceKey if no variable present in the url fragment', function(){
      let url = linkurious._fetcher.transformUrl('/test');

      url.should.equal('http://localhost:3001/api/test');
    })
  });

  describe('initCurrentSource method', function(){
    it('must set the right dataSource', function(){
      return linkurious.initCurrentSource().then(function(res){
        // todo: detect the sourceKey in beforeAll (is not fixed)
        res.should.eql({ name: 'Database #0', key: sourceKey, configIndex: 0 });
      });
    });
  });

  describe('setCurrentSource method', function(){
    it('must set the dataSource by ConfigIndex', function(){
      return linkurious.setCurrentSource(0).then(function(res){
        res.should.eql({ name: 'Database #0', key: sourceKey, configIndex: 0 });
      })
    });

    it('must set the dataSource by key', function(){
      return linkurious.setCurrentSource(sourceKey).then(function(res){
        should(res).eql({name: 'Database #0', key: sourceKey, configIndex: 0});
      })
    });
  });
  
  describe('getAdjacentEdges method', function(){
    it('must return correct value for in orientation', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.edge.getAdjacentFromNode({
          orientation:'in',
          nodeId:nodeId,
          withVersion :true
        }).then(function(res){
          res.should.have.length(3);
        });
      });
    });
  });

  describe('getNodesByQuery method', function(){
    it('must return the right nodes for the query', function(){
      return linkurious.initCurrentSource().then(function(){

        return linkurious.graph.getNodeList({
          dialect : 'cypher',
          query : 'MATCH (n)\nreturn n LIMIT 1',
          withVersion : true
        });
      }).then(function(res){
        res[0].data.name.should.eql('Andy Wachowski');
      })
    });
  });

  describe('searchUsers method', function(){
    it('must return a list of users', function(){
      return linkurious.search.users({
        groupId:4,
        size:20,
        start:0
      }).then(function(res){
        res.should.eql({
          found: 1,
          results: [
            {
              id: 3,
              username: 'adminUser',
              email: 'adminUser@example.com',
              groups: [{builtin : true, id : 4, name:'admin'}],
              ldap: false,
              admin: true,
              preferences: {},
              visCount: 0
            }
          ]
        });
      })
    })
  });

  describe('getNode method', function(){
    it('must return the right node', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.getOne(nodeId, {
          withVersion : true,
          withEdges : true
        });
      }).then(function(res){
        res.id.should.equal(nodeId);
        res.data.should.eql({ name: 'Keanu Reeves', born: 1964 });
        res.edges.should.have.length(3);
      });
    });
  });

  describe('expandNode method', function(){
    it('must return the right array of nodes and edges', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.expand({
          ids : [nodeId],
          ignoredNodes : [],
          visibleNodes : [nodeId],
          withVersion : false
        });
      }).then(function(res){
        res.should.have.length(4);
      });
    });
  });

  describe('updateNode method', function(){
    it('must return an error object', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.update(nodeId, {
          addedCategories : [],
          deletedCategories : [],
          deletedProperties : [],
          properties : {name : 'Keanu Reeves', born : 1964, test:'test update'},
          version : 1
        });
      }).catch(function(res){
        res.should.eql({
          key: 'edit_conflict',
          message: 'Node edit conflict. (client version: 1, server version: 2)',
          status: 409,
          type: 'business'
        })
      })
    });

    it('must return true', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.update(nodeId, {
          addedCategories : [],
          deletedCategories : [],
          deletedProperties : [],
          properties : {name : 'Keanu Reeves', born : 1964, test:'test update'},
          version : 2
        });
      }).catch(function(res){
        res.should.be.true();
      });
    });
  });

  describe('getEdgeProperties', function(){
    it('must return a list of edges properties', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.edge.getProperties({
          omitNoindex : true
        });
      }).then(function(res){
        res.should.eql({ properties: [ { key: 'altEdgeID', count: 1 }, { key: 'roles', count: 4 } ] });
      });
    });
  });

  describe('getNodeProperties', function(){
    it('must return a list of node properties', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.getProperties({
          omitNoindex : true
        });
      }).then(function(res){
        res.properties.should.have.length(6);
        res.properties[0].key.should.equal('born');
        res.properties[0].count.should.equal(8);
      });
    });
  });

  describe('getEdgeTypes method', function(){
    it('must return edges types', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.edge.getTypes({
          includeType : true
        });
      }).then(function(res){
        res.should.eql({
          edgeTypes: [
            { name: 'DIRECTED', count: 7, properties: [] },
            { name: 'IS_BRO_OF', count: 2, properties: [{count:1, key:'altEdgeID', type:'string'}] },
            { name: 'ACTED_IN', count: 7, properties: [{count:1, key:'edgeHiddenProp'}, {count:1, key:'edgeNoIndexProp'}, {count:4, key:'roles', type:'string'}] },
            { name: 'SON_OF', count: 1, properties: [] }
          ]}
        )
      });
    });
  });

  describe('getNodeTypes method', function(){
    it('must return node types', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.getTypes();
      }).then(function(res){
        res.nodeTypes.should.have.length(7);
        res.nodeTypes[0].name.should.equal('Person');
      });
    })
  });

  describe('getSandbox method', function(){
    it('must return a visualization object', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.visualization.getSandbox({
          doLayout : false
        });
      }).then(function(res){
        res.visualization.should.have.property('id');
        res.visualization.should.have.property('title', 'SandBox');
        res.visualization.nodes.should.have.length(0);
        res.visualization.edges.should.have.length(0);
        res.visualization.should.have.property('layout', {});
      });
    });
  });

  describe('shareVisualization method', function(){
    it('must share a visualization', function(){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.visualization.share({
          userId:3,
          right :'read',
          vizId:4
        });
      }).then(function(res){
        res.visualizationId.should.equal(4);
        res.userId.should.equal(3);
      });
    });
  });

  describe('createUser method', function(){
    it('must create a new user', function(){
      return linkurious.admin.createUser({
        username:'testName',
        email:'testName@test.fr',
        groups : [4],
        password:'testPass'
      }).then(function(res){
        res.should.eql({
          id: 6,
          username: 'testName',
          email: 'testName@test.fr',
          groups: [ { id: 4, name: 'admin', builtin: true } ],
          ldap: false,
          admin: true,
          preferences: {}
        });
      });
    });
  });

  describe('updateConfig method', function(){
    let test = false;
    it('must change app config', function(){
      return linkurious.admin.updateConfig({
        path : 'access.authRequired',
        configuration : true
      }).then(function(){
        return test = true;
      }).then(function(res){
        res.should.be.true();
      });
    });
  });

  describe('login method', function(){
  it('must log a user and hydrate app state', function(){
      return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(res){
        linkurious.user.should.eql({
          id: 6,
          username: 'testName',
          email: 'testName@test.fr',
          groups: [ { id: 4, name: 'admin', builtin: true } ],
          ldap: false,
          admin: true,
          preferences: {},
          actions: { all: [ 'rawReadQuery', 'rawWriteQuery' ] }
        });
        res.should.be.true();
      })
    });

    it('must logout before login if another user is currently authenticated', function(){
      return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(res){
          linkurious.user.should.eql({
            id: 6,
            username: 'testName',
            email: 'testName@test.fr',
            groups: [ { id: 4, name: 'admin', builtin: true } ],
            ldap: false,
            admin: true,
            preferences: {},
            actions: { all: [ 'rawReadQuery', 'rawWriteQuery' ] }
          });
          res.should.be.true();
        });
      })
    })
  });

  describe('logout method', function(){
    it('must disconnect user and reset client state', function(){
      return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.logout();
      }).then(function(res){
        res.should.equal('user disconnected');
        should(linkurious.user).not.ok();
      })
    })
  });

  describe('startClient method', function(){
    it('must set current user and default source', function(){
      return linkurious.startClient({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        linkurious.user.should.eql({
            id: 6,
            username: 'testName',
            email: 'testName@test.fr',
            groups: [{'builtin':true, id : 4, name : 'admin'}],
            ldap: false,
            admin: true,
            preferences: {},
            actions: { all: ['rawReadQuery', 'rawWriteQuery'] }
        });

        linkurious.currentSource.should.eql({ name: 'Database #0', key: global.sourceKey, configIndex: 0 });
      });
    });
  });

  describe('updateCurrentUser', function(){
    it('must update current user and reflect it in state', function(){
      return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.updateCurrentUser({
          username : 'nameChanged'
        });
      }).then(function(){
        linkurious.user.username.should.equal('nameChanged');
        linkurious.user.id.should.equal(6);
        linkurious.user.email.should.equal('testName@test.fr');
        linkurious.user.should.eql({
          id: 6,
          username: 'nameChanged',
          email: 'testName@test.fr',
          groups: [{'builtin':true, id : 4, name : 'admin'}],
          ldap: false,
          admin: true,
          preferences: {},
          actions: { all: ['rawReadQuery', 'rawWriteQuery'] }
        });
      });
    });
  });

});
