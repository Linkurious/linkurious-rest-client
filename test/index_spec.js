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
const Linkurious = require('./../built/index');
const LogDriver = require('./../built/logDriver');
const HTTPDriver = require('./../built/HTTPDriver');

describe('Linkurious class', function(){

  let linkurious, testLog, logFunctions, edgeID, nodeId;

  beforeEach(function(){
    testLog = false;
    logFunctions = {
      error: () => {
        testLog = true;
      }
    };
    linkurious = new Linkurious('http://localhost:3001', 'error', logFunctions);
  });

  describe('constructor', function(){
    it('host must be "http://localhost:3001"', function(){
      linkurious.host.should.equal('http://localhost:3001');
    });

    it('state must be empty', function(){
      linkurious.state.should.eql({});
    });

    it('log must be an instance of logDriver', function(){
      linkurious.log.should.be.an.instanceOf(LogDriver.default);
    });

    it('httpDriver mus be an instance of httpDriver', function(){
      linkurious.httpDriver.should.be.an.instanceOf(HTTPDriver.default);
    });
  });

  describe('searchNodes method', function(){
    it('must return a node', function(){
      return linkurious.setDefaultSource().then(function(){
        return linkurious.searchNodes('nodes', {
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
      return linkurious.setDefaultSource().then(function(){
        return linkurious.searchNodes('edges', {
          q : 'ACTED_IN'
        });
      }).then(function(res){
        res.type.should.equal('edge');
        res.totalHits.should.equal(7);
        edgeID = res.results[0].children[0].id;
      });
    });
  });

  describe('setStateSource method', function(){
    it('must return a new client state if condition is verified', function(){
      let source = {
        name : 'test',
        key : 'treuio45',
        configIndex : 1
      };

      let test = linkurious.setStateSource(source, 'key', 'treuio45');
      linkurious.state.currentSource.should.eql({
        name : 'test',
        key : 'treuio45',
        configIndex : 1
      });
    });

    it('must return false if condition isn\'t verified', function(){
      let source = {
        name : 'test',
        key : 'treuio45',
        configIndex : 1
      };

      let test = linkurious.setStateSource(source, 'configIndex', 2);
      test.should.equal(false);
    });

    it('state must be unmodified if condition isn\'t verified', function(){
      let source = {
        name : 'test',
        key : 'treuio45',
        configIndex : 1
      };

      let test = linkurious.setStateSource(source, 'configIndex', 2);
      linkurious.state.should.eql({});
    });
  });

  describe('transformUrl method', function(){

    it('must replace value in url by the right data', function(){
      linkurious.state.currentSource = {
        name : 'test',
        key : 'treuio45',
        configIndex : 1
      };

      let url = linkurious.transformUrl('/{dataSource}/api/test');

      url.should.equal('http://localhost:3001/api/treuio45/api/test');

    });

    it('must throw a console if no dataSource is set', function(){
      linkurious.transformUrl.bind(null, '/{dataSource}/api/test').should.throw()
    });

    it('must construct the url without sourceKey if no variable present in the url fragment', function(){
      let url = linkurious.transformUrl('/test');

      url.should.equal('http://localhost:3001/api/test');
    })
  });
  
  describe('linkuriousFetch method', function(){
    it('must return value', function(){
      return linkurious.linkuriousFetch('GET', '/auth/me').then(function(res){
        res.should.have.property('user');
      });
    });

    it('must return an error 404 if API does\'nt exists', function(){
      return linkurious.linkuriousFetch('GET', '/test').catch(function(res){
        res.should.eql({
          status: 404,
          type: 'business',
          key: 'api_not_found',
          message: 'API not found.'
        });
      })
    });
  });

  describe('setDefaultSource method', function(){
    it('must set the right dataSource', function(){
      return linkurious.setDefaultSource().then(function(res){
        res.should.eql({ name: 'Database #0', key: '66a2bc71', configIndex: 0 });
      });
    });
  });

  describe('setCurrentSource method', function(){
    it('must set the dataSource by ConfigIndex', function(){
      return linkurious.setCurrentSource(0).then(function(res){
        res.should.eql({ name: 'Database #0', key: '66a2bc71', configIndex: 0 });
      })
    });

    it('must set the dataSource by key', function(){
      return linkurious.setCurrentSource('66a2bc71').then(function(res){
        res.should.eql({ name: 'Database #0', key: '66a2bc71', configIndex: 0 });
      })
    });
  });

  describe('getCurrentUser method', function(){
    it('must set the user state', function(){
      return linkurious.getCurrentUser().then(function(){
        linkurious.state.user.should.eql({
          id: 1,
          builtin: true,
          email: 'user@linkurio.us',
          username: 'Unique user',
          groups:
            [ { id: 2, name: 'admin', builtin: true },
              { id: 1, name: 'default', builtin: true } ],
          ldap: false,
          admin: true,
          actions: { all: [ 'rawReadQuery', 'rawWriteQuery' ] },
          preferences: { pinOnDrag: true } })
      });
    });
  });
  
  describe('getAdjacentEdges method', function(){
    it('must return correct value for in orientation', function(){
      return linkurious.setDefaultSource().then(function(){
        return linkurious.getAdjacentEdges({
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
      return linkurious.setDefaultSource().then(function(){
        return linkurious.getNodesByQuery({
          dialect : 'cypher',
          query : 'MATCH n\nreturn n LIMIT 1',
          withVersion : true
        });
      }).then(function(res){
        res[0].data.name.should.eql('Andy Wachowski');
      })
    });
  });

  describe('searchUsers method', function(){
    it('must return a list of users', function(){
      return linkurious.searchUsers({
        groupId:4,
        size:20,
        start:0
      }).then(function(res){
        res.should.eql({
          found: 1,
          results:
            [ {
              id: 3,
              username: 'adminUser',
              email: 'adminUser@example.com',
              groups: [{builtin : true, id : 4, name:'admin'}],
              ldap: false,
              admin: true,
              preferences: {},
              visCount: 0 }
            ]
        })
      })
    })
  });

  describe('getNode method', function(){
    it('must return the right node', function(){
      return linkurious.setDefaultSource().then(function(){
        return linkurious.getNode(nodeId, {
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
      return linkurious.setDefaultSource().then(function(){
        return linkurious.expandNode({
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
      return linkurious.setDefaultSource().then(function(){
        return linkurious.updateNode(nodeId, {
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
      return linkurious.setDefaultSource().then(function(){
        return linkurious.updateNode(nodeId, {
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
      return linkurious.setDefaultSource().then(function(){
        return linkurious.getEdgeProperties({
          omitNoindex : true
        });
      }).then(function(res){
        res.should.eql({ properties: [ { key: 'altEdgeID', count: 1 }, { key: 'roles', count: 4 } ] });
      });
    });
  });

  describe('getNodeProperties', function(){
    it('must return a list of node properties', function(){
      return linkurious.setDefaultSource().then(function(){
        return linkurious.getNodeProperties({
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
      return linkurious.setDefaultSource().then(function(){
        return linkurious.getEdgeTypes({
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
      return linkurious.setDefaultSource().then(function(){
        return linkurious.getNodeTypes();
      }).then(function(res){
        res.nodeTypes.should.have.length(7);
        res.nodeTypes[0].name.should.equal('Person');
      });
    })
  });

  describe('getSandbox method', function(){
    it('must return a visualization object', function(){
      return linkurious.setDefaultSource().then(function(){
        return linkurious.getSandbox({
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
      return linkurious.setDefaultSource().then(function(){
        return linkurious.shareVisualization({
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
      return linkurious.createUser({
        username:'testName',
        email:'testName@test.fr',
        password:'testPass'
      }).then(function(res){
        res.should.eql({
          id: 6,
          username: 'testName',
          email: 'testName@test.fr',
          groups: [ { id: 3, name: 'default', builtin: true } ],
          ldap: false,
          admin: false,
          preferences: {}
        });
      });
    });
  });

  describe('updateConfig method', function(){
    let test = false;
    it('must change app config', function(){
      return linkurious.updateConfig({
        key : 'access.authRequired',
        configuration : true
      }).then(function(){
        return test = true;
      }).then(function(res){
        res.should.be.true();
      });
    });
  });

  describe('userIsAuth method', function(){
    it('user must not be authenticated', function(){
      return linkurious.userIsAuth().then(function(res){
        res.should.be.false();
      });
    });
  });

  describe('userLogin method', function(){
    it('must log a user and hydrate app state', function(){
      return linkurious.userLogin('testName','testPass').then(function(res){
        linkurious.state.user.should.eql({
          id: 6,
          username: 'testName',
          email: 'testName@test.fr',
          groups: [ { id: 3, name: 'default', builtin: true } ],
          ldap: false,
          admin: false,
          preferences: {},
          actions: { all: [ 'rawReadQuery' ] }
        });
        res.should.be.true();
      })
    });
  });

  describe('logout method', function(){
    it('must disconnect user and reset client state', function(){
      return linkurious.userLogin('testName','testPass').then(function(){
        return linkurious.logout();
      }).then(function(res){
        res.should.equal('user disconnected');
        linkurious.state.should.eql({user:null});
      })
    })
  });

  describe('startClient method', function(){
    it('must set current user and default source', function(){
      return linkurious.startClient('testName','testPass').then(function(){
        linkurious.state.should.eql({
          user: {
            id: 6,
            username: 'testName',
            email: 'testName@test.fr',
            groups: [{'builtin':true, id : 3, name : 'default'}],
            ldap: false,
            admin: false,
            preferences: {},
            actions: { all: ['rawReadQuery'] }
          },
          currentSource: { name: 'Database #0', key: '66a2bc71', configIndex: 0 }
        });
      });
    });
  });

  describe('updateCurrentUser', function(){
    it('must update current user and reflect it in state', function(){
      return linkurious.userLogin('testName','testPass').then(function(){
        return linkurious.updateCurrentUser({
          username : 'nameChanged'
        });
      }).then(function(){
        linkurious.state.user.username.should.equal('nameChanged');
        linkurious.state.user.id.should.equal(6);
        linkurious.state.user.email.should.equal('testName@test.fr');
        linkurious.state.user.should.eql({
          id: 6,
          username: 'nameChanged',
          email: 'testName@test.fr',
          groups: [{'builtin':true, id : 3, name : 'default'}],
          ldap: false,
          admin: false,
          preferences: {},
          actions: { all: ['rawReadQuery'] }
        });
      });
    });
  });

});