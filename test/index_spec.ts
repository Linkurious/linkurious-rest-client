/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-06-08.
 *
 * File:
 * Description :
 */
'use strict';

import {Linkurious} from '../src/index';




describe('Linkurious class', () => {

  let linkurious:Linkurious, testLog:boolean, logDriver:any, edgeID:string|number, nodeId:string|number, sourceKey:string;

  beforeEach(() => {
    testLog = false;
    logDriver = {
      debug: () => {},
      error: () => {
        testLog = true;
      }
    };
    linkurious = new Linkurious('http://localhost:3001', 'error', logDriver);
  });

  describe('searchNodes method', function(){
    it('must return a node', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.search.nodes({
          q : 'Keanu Reeves'
        });
      }).then(function(res){
        expect(res.type).toEqual('node');
        expect(res.totalHits).toEqual(1);
        expect(res.results[0].title).toEqual('Person');

        nodeId = res.results[0].children[0].id;
        done();
      });
    });

    it('must return an edge', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.search.edges({
          q : 'ACTED_IN'
        });
      }).then(function(res){
        expect(res.type).toEqual('edge');
        expect(res.totalHits).toEqual(7);
        edgeID = res.results[0].children[0].id;
        done();
      });
    });
  });

  describe('initCurrentSource method', function(){
    it('must set the right dataSource', function(done){
      return linkurious.initCurrentSource().then(function(res){
        expect(res).toEqual({ name: 'Database #0', key: '66a2bc71', configIndex: 0 });
        sourceKey = res.key;
        done();
      });
    });
  });

  describe('setCurrentSource method', function(){
    it('must set the dataSource by ConfigIndex', function(done){
      return linkurious.setCurrentSource(0).then(function(res){
        expect(res).toEqual({ name: 'Database #0', key: sourceKey, configIndex: 0 });
        done();
      })
    });

    it('must set the dataSource by key', function(done){
      return linkurious.setCurrentSource(sourceKey).then(function(res){
        expect(res).toEqual({name: 'Database #0', key: sourceKey, configIndex: 0});
        done();
      })
    });
  });

  describe('getAdjacentEdges method', function(){
    it('must return correct value for in orientation', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.edge.getAdjacentFromNode({orientation:'in',nodeId:nodeId,withVersion:true}).then(function(res){
          expect(res.length).toBe(3);
          done();
        });
      });
    });
  });

  describe('getNodesByQuery method', function(){
    it('must return the right nodes for the query', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.graph.getNodeList({
          dialect : 'cypher',
          query : 'MATCH (n)\nreturn n LIMIT 1',
          withVersion : true
        });
      }).then(function(res){
        expect(res[0].data.name).toEqual('Andy Wachowski');
        done();
      })
    });
  });

  describe('searchUsers method', function(){
    it('must return a list of users', function(done){
      return linkurious.search.users({groupId:[4], size:4, start:0}).then(function(res){
        expect(res).toEqual({
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
        done();
      })
    })
  });

  describe('getNode method', function(){
    it('must return the right node', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.getOne({
          id:nodeId,
          withVersion : true,
          withEdges : true
        });
      }).then(function(res){
        expect(res.id).toEqual(nodeId);
        expect(res.data).toEqual({ name: 'Keanu Reeves', born: 1964 });
        expect(res.edges.length).toEqual(3);
        done();
      });
    });
  });

  describe('expandNode method', function(){
    it('must return the right array of nodes and edges', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.expand({
          ids:[nodeId],
          ignoredNodes:[],
          visibleNodes:[nodeId],
          withVersion:false
        });
      }).then(function(res){
        expect(res.length).toEqual(4);
        done();
      });
    });
  });

  describe('updateNode method', function(){

    it('must return true', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.update({
          id:nodeId,
          addedCategories : [],
          deletedCategories : [],
          deletedProperties : [],
          properties : {name : 'Keanu Reeves', born : 1964, test:'test update'},
          version : 2
        });
      }).catch(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('getEdgeProperties', function(){
    it('must return a list of edges properties', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.edge.getProperties({
          omitNoindex : true
        });
      }).then(function(res){
        expect(res).toEqual([ { key: 'altEdgeID', count: 1 }, { key: 'roles', count: 4 } ]);
        done();
      });
    });
  });

  describe('getNodeProperties', function(){
    it('must return a list of node properties', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.getProperties({
          omitNoindex : true
        });
      }).then(function(res){
        expect(res.length).toEqual(5);
        expect(res[0].key).toEqual('born');
        expect(res[0].count).toEqual(8);
        done();
      });
    });
  });

  describe('getEdgeTypes method', function(){
    it('must return edges types', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.edge.getTypes({
          includeType : true
        });
      }).then(function(res){
        expect(res).toEqual([
            { name: 'DIRECTED', count: 7, properties: [] },
            { name: 'IS_BRO_OF', count: 2, properties: [{count:1, key:'altEdgeID', type:'string'}] },
            { name: 'ACTED_IN', count: 7, properties: [{count:1, key:'edgeHiddenProp'}, {count:1, key:'edgeNoIndexProp'}, {count:4, key:'roles', type:'string'}] },
            { name: 'SON_OF', count: 1, properties: [] }
          ]
        );
        done();
      });
    });
  });

  describe('getNodeTypes method', function(){
    it('must return node types', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.node.getTypes();
      }).then(function(res){
        expect(res.length).toEqual(7);
        expect(res[0].name).toEqual('Person');
        done();
      });
    })
  });

  describe('getSandbox method', function(){
    it('must return a visualization object', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.visualization.getSandbox({
          doLayout : false
        });
      }).then(function(res){
        expect(res.id).toBeTruthy();
        expect(res.title).toBeTruthy();
        expect(res.nodes.length).toEqual(0);
        expect(res.edges.length).toEqual(0);
        expect(res.layout).toBeTruthy();
        done();
      });
    });
  });

  describe('shareVisualization method', function(){
    it('must share a visualization', function(done){
      return linkurious.initCurrentSource().then(function(){
        return linkurious.visualization.share({
          userId:3,
          right :'read',
          vizId:4
        });
      }).then(function(res){
        expect(res.visualizationId).toEqual(4);
        expect(res.userId).toEqual(3);
        done();
      });
    });
  });

  describe('createUser method', function(){
    it('must create a new user', function(done){
      return linkurious.admin.createUser({
        username:'testName',
        email:'testName@test.fr',
        groups : [4],
        password:'testPass'
      }).then(function(res){
        expect(res).toEqual({
          id: 6,
          username: 'testName',
          email: 'testName@test.fr',
          groups: [ { id: 4, name: 'admin', builtin: true } ],
          ldap: false,
          admin: true,
          preferences: {}
        });
        done();
      });
    } );
  });

  describe('updateConfig method', function(){
    let test = false;
    it('must change app config', function(done){
      return linkurious.admin.updateConfig({
        path : 'access.authRequired',
        configuration : true
      }).then(function(){
        return test = true;
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('login method', function(){
    it('must log a user and hydrate app state', function(done){
      return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(res){
        expect(linkurious.state.user).toEqual({
          id: 6,
          username: 'testName',
          email: 'testName@test.fr',
          groups: [ { id: 4, name: 'admin', builtin: true } ],
          ldap: false,
          admin: true,
          preferences: {},
          actions: { all: [ 'rawReadQuery', 'rawWriteQuery' ] }
        });
        expect(res).toBeTruthy();
        done();
      })
    });

    it('must logout before login if another user is currently authenticated', function(done){
      return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(res){
          expect(linkurious.state.user).toEqual({
            id: 6,
            username: 'testName',
            email: 'testName@test.fr',
            groups: [ { id: 4, name: 'admin', builtin: true } ],
            ldap: false,
            admin: true,
            preferences: {},
            actions: { all: [ 'rawReadQuery', 'rawWriteQuery' ] }
          });
          expect(res).toBeTruthy();
          done();
        });
      })
    })
  });

  describe('logout method', function(){
    it('must disconnect user and reset client state', function(done){
      return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.logout();
      }).then(function(res){
        expect(res).toEqual('user disconnected');
        expect(linkurious.state.user).toBeUndefined();
        done();
      })
    })
  });

  describe('startClient method', function(){
    it('must set current user and default source', function(done){
      return linkurious.startClient({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        expect(linkurious.state.user).toEqual({
          id: 6,
          username: 'testName',
          email: 'testName@test.fr',
          groups: [{'builtin':true, id : 4, name : 'admin'}],
          ldap: false,
          admin: true,
          preferences: {},
          actions: { all: ['rawReadQuery', 'rawWriteQuery'] }
        });

        expect(linkurious.state.currentSource).toEqual({ name: 'Database #0', key: sourceKey, configIndex: 0 });
        done();
      });
    });
  });

  describe('updateCurrentUser', function(){
    it('must update current user and reflect it in state', function(done){
      return linkurious.login({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.updateCurrentUser({
          id : 6,
          username : 'nameChanged'
        });
      }).then(function(){
        expect(linkurious.state.user.username).toEqual('nameChanged');
        expect(linkurious.state.user.id).toEqual(6);
        expect(linkurious.state.user.email).toEqual('testName@test.fr');
        expect(linkurious.state.user).toEqual({
          id: 6,
          username: 'nameChanged',
          email: 'testName@test.fr',
          groups: [{'builtin':true, id : 4, name : 'admin'}],
          ldap: false,
          admin: true,
          preferences: {},
          actions: { all: ['rawReadQuery', 'rawWriteQuery'] }
        });
        done();
      });
    });
  });

  describe('processIndexation method', function(){
    it('must start indexation and return true when finish', function(done){
      return linkurious.startClient({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.processIndexation(50, function(res){
          expect(res.indexing).toEqual('ongoing');
        })
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  })

});

