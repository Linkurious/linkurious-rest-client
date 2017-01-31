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

import {INode, Linkurious} from '../index';
import {FetcherSpec} from './fetcher_spec';
import {LinkuriousErrorSpec} from './LinkuriousError_spec';
import {DefaultLoggerDriverSpec} from './DefaultLoggerDriver_spec';
import { link } from 'fs';

FetcherSpec.test();
LinkuriousErrorSpec.test();
DefaultLoggerDriverSpec.test();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;

describe('Linkurious class', () => {

  let visu:any, widget:any, node:INode, linkurious:Linkurious, testLog:boolean, logDriver:any, edgeID:string|number, nodeId:string|number, sourceKey:string, graphQueryId:number, sourceId:string|number, targetId:string|number, nodeToDelete:string|number;
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
      return linkurious.initSources().then(function(){
        return linkurious.search.nodes({
          q : 'Keanu Reeves'
        });
      }).then(function(res: any){
        expect(res.type).toEqual('node');
        expect(res.totalHits).toEqual(1);
        expect(res.results[0].title).toEqual('Person');

        nodeId = res.results[0].children[0].id;
        done();
      });
    });

    it('must return an edge', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.search.edges({
          q : 'ACTED_IN'
        });
      }).then(function(res: any){
        expect(res.type).toEqual('edge');
        expect(res.totalHits).toEqual(7);
        edgeID = res.results[0].children[0].id;
        done();
      });
    });
  });

  describe('initSources method', function(){
    it('must set the right dataSource', function(done){
      return linkurious.initSources().then(function(res: any){
        expect(res).toEqual(jasmine.objectContaining({
          configIndex: 0
        }));
        sourceKey = res.key;
        done();
      });
    });
  });

  describe('createAlert method', () => {
    it('must create an alert', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.createAlert({
          dataSourceKey : sourceKey,
          title:'testAlert',
          query:'MATCH (n1:Movie) WHERE n1.released < 2000 RETURN n1, n1.released',
          dialect:'cypher',
          enabled:true,
          cron:'* * * * *'
        }).then((res: any) => {
          expect(res.id).toEqual(1);
          expect(res.matchTTL).toEqual(30);
          setTimeout(() => {
            done();
          }, 5000);
        })
      })
    });
  });

  describe('getAlerts for user method', () => {
    it('must return an array of alerts', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getAlerts({
          dataSourceKey : sourceKey
        }).then((res: any) => {
          expect(res.length).toEqual(1);
          expect(res[0].title).toEqual('testAlert');
          done()
        })
      })
    });
  });

  describe('getAlert for user method', () => {
    it('must return an alert', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getAlert({
          sourceKey : sourceKey,
          id : 1
        }).then((res: any) => {
          expect(res.title).toEqual('testAlert');
          done();
        })
      })
    });
  });

  describe('getMatches method', () => {
    it('must return an array of matches', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getMatches({
          dataSourceKey : sourceKey,
          id : 1,
          offset:0,
          limit:20
        }).then((res: any) => {
          expect(res.matches.length).toEqual(2);
          done();
        })
      })
    });
  });

  describe('updateAlert method', () => {
    it('must update an alert', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.updateAlert({
          id : 1,
          title:'testAlertModified'
        }).then((res: any) => {
          expect(res.id).toEqual(1);
          expect(res.title).toEqual('testAlertModified');
          done();
        })
      })
    });
  });

  describe('addActionToMatch method', () => {
    it('must return true', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.addActionToMatch({
          dataSourceKey : sourceKey,
          id : 1,
          action : 'confirm',
          matchId : 1
        }).then((res: any) => {
          expect(res).toBeTruthy();
          done();
        })
      })
    });
  });

  describe('getMatch method', () => {
    it('must return the match', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getMatch({
          dataSourceKey : sourceKey,
          id : 1,
          matchId : 1
        }).then((res: any) => {
          expect(res.nodes.length).toEqual(1);
          expect(res.status).toEqual('confirmed');
          done();
        })
      })
    });
  });

  describe('getMatchActions method', () => {
    it('must return all actions of specified match', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getMatchActions({
          dataSourceKey : sourceKey,
          id : 1,
          matchId : 1
        }).then((res: any) => {
          expect(res.length).toEqual(1);
          expect(res[0].action).toEqual('confirm');
          done();
        })
      })
    });
  });

  describe('getAlerts method', () => {
    it('must return an array of alerts', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.getAlerts({
          dataSourceKey : sourceKey
        }).then((res: any) => {
          expect(res.length).toEqual(1);
          expect(res[0].title).toEqual('testAlertModified');
          done();
        })
      })
    });
  });

  describe('getAlert method', () => {
    it('must return an alert', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.getAlert({
          dataSourceKey : sourceKey,
          id : 1
        }).then((res: any) => {
          expect(res.title).toEqual('testAlertModified');
          done();
        })
      })
    });
  });

  describe('deleteAlert method', () => {
    it('must return true', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.deleteAlert({
          dataSourceKey : sourceKey,
          id : 1
        }).then((res: any) => {
          expect(res).toBeTruthy();
          done();
        })
      })
    });
  });

  describe('resetDefaults method', () => {
    it('must return true', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.resetDefaults({
          dataSourceKey : sourceKey
        }).then((res: any) => {
          expect(res).toBeTruthy();
          done();
        })
      })
    });
  });

  describe('setCurrentSource method', function(){
    it('must set the dataSource by ConfigIndex', function(done){
      return linkurious.setCurrentSource(0).then(function(res){
        expect(res).toEqual(jasmine.objectContaining({
          configIndex: 0
        }));
        done();
      })
    });

    it('must set the dataSource by key', function(done){
      return linkurious.setCurrentSource(sourceKey).then(function(res){
        expect(res).toEqual(jasmine.objectContaining({
          configIndex: 0
        }));
        done();
      })
    });

    it('must return undefined', (done) => {
      return linkurious.setCurrentSource(2).then(function(res){
        expect(res).toBeUndefined();
        done();
      })
    })
  });

  describe('getAppVersion', () => {
    it('must return linkurious version', (done) => {
      return linkurious.getAppVersion().then((res: any) => {
        expect(res).toEqual(jasmine.objectContaining({
          prerelease:false,
        }));
        expect(res).toEqual(jasmine.objectContaining({
          enterprise: true,
        }));
        done();
      })
    });
  });

  describe('getAppStatus', () => {
    it('must return linkurious status', (done) => {
      return linkurious.getAppStatus().then((res: any) => {
        expect(res).toEqual(jasmine.objectContaining({
          message: 'Linkurious ready to go :)'
        }));

        expect(res).toEqual(jasmine.objectContaining({
          name: 'initialized'
        }));
        done();
      })
    });
  });

  describe('getAdjacentEdges method', function(){
    it('must return correct value for in orientation', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.edge.getAdjacentFromNode({orientation:'in', nodeId:nodeId, withVersion:true}).then(function(res){
          expect(res.length).toBe(3);
          done();
        });
      });
    });

    it('must return correct value for out orientation', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.edge.getAdjacentFromNode({orientation:'out',nodeId:nodeId,withVersion:true}).then(function(res){
          expect(res.length).toBe(0);
          done();
        });
      });
    });

    it('must return correct value for both orientation', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.edge.getAdjacentFromNode({orientation:'both',nodeId:nodeId,withVersion:true}).then(function(res){
          expect(res.length).toBe(3);
          done();
        });
      });
    });
  });

  describe('getNodesByQuery method', function(){
    it('must return the right nodes for the query', function(done){
      return linkurious.initSources().then(function(){
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
        expect(res).toEqual([
          {
            id: 3,
            username: 'adminUser',
            email: 'adminUser@example.com',
            groups: [{builtin : true, id : 4, name:'admin'}],
            source: 'local',
            admin: true,
            preferences: {},
            visCount: 0
          }
        ]);
        done();
      })
    })
  });

  describe('getEdge method', () => {
    it('must return a edge', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.edge.getOne(edgeID);
      }).then((res:any) => {
        expect(res).toEqual(jasmine.objectContaining({
          type : 'ACTED_IN'
        }));
        done();
      });
    });
  });

  describe('getNode method', function(){
    it('must return the right node', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.node.getOne({
          id:nodeId,
          withVersion : true,
          withEdges : true
        });
      }).then(function(res){
        node = res;
        expect(res.id).toEqual(nodeId);
        expect(res.data).toEqual({ name: 'Keanu Reeves', born: 1964 });
        expect(res.edges.length).toEqual(3);
        done();
      });
    });
  });

  describe('expandNode method', function(){
    it('must return the right array of nodes and edges', function(done){
      return linkurious.initSources().then(function(){
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
      return linkurious.initSources().then(function(){
        return linkurious.node.update({
          id:nodeId,
          addedCategories : [],
          deletedCategories : [],
          deletedData : [],
          data : {name : 'Keanu Reeves', born : 1964, test:'test update'},
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
      return linkurious.initSources().then(function(){
        return linkurious.edge.getProperties({
          omitNoindex : true
        });
      }).then(function(res){
        expect(res).toEqual([{ key: 'roles', count: 4 }, { key: 'altEdgeID', count: 1 }]);
        done();
      });
    });
  });

  describe('getNodeProperties', function(){
    it('must return a list of node properties', function(done){
      return linkurious.initSources().then(function(){
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
      return linkurious.initSources().then(function(){
        return linkurious.edge.getTypes({
          includeType : true
        });
      }).then(function(res){
        expect(res[0]).toEqual({ name: 'DIRECTED', count: 7, properties: [  ] });
        done();
      });
    });
  });

  describe('getNodeTypes method', function(){
    it('must return node types', function(done){
      return linkurious.initSources().then(function(){
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
      return linkurious.initSources().then(function(){
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

  describe('updateSandBox method', () => {
    it('must update the sandbox', (done) => {
      return linkurious.initSources().then(function(){
        return linkurious.visualization.updateSandbox({
          visualization : {
            nodeFields : {
              captions : {},
              fields : [{
                name : 'Keanu Reeves',
                active : true
              }]
            }
          }
        });
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('createWidget method', () => {
    it('must create a widget', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.visualization.getTree();
      }).then((res:any) => {
        visu = res[2];
        return linkurious.visualization.createWidget({
          visualization_id : visu.id,
          content : {
            graph:{
              nodes:[node],
              edges:[]
            }
          }
        });
      }).then((res:any) => {
        widget = res;
        expect(typeof res).toEqual('string');
        done();
      });
    });
  });

  describe('get widget method', () => {
    it('must return a widget', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.visualization.getWidget(widget);
      }).then((res:any) => {
        expect(res.key).toEqual(widget);
        expect(res.userId).toEqual(1);
        done();
      })
    });
  });

  describe('deleteWidget method', () => {
    it('must delete a widget', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.visualization.deleteWidget(widget);
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      })
    });
  });

  describe('create visu method', () => {
    it('musr return a visualization', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.visualization.create({
          title : 'newVizuTest',
          nodes:[{
            id : nodeId,
            nodelink:{
              x:50,
              y:50,
            }
          }],
          edges:[{
            id : edgeID
          }],
          nodeFields:{
            captions : {},
            fields : [{
              name:'Keanu Reeves',
              active:true
            }]
          },
          edgeFields:{
            captions : {},
            fields : [{
              name:'ACTED_IN',
              active:false
            }]
          }
        });
      }).then((res:any) => {
        visu = res;
        expect(res.title).toEqual('newVizuTest');
        expect(res.createdAt).toBeTruthy();
        done();
      });
    });
  });

  describe('get a visu method', () => {
    xit('must return a visu', (done) => {
      return linkurious.initSources().then(function(){
        return linkurious.visualization.getOne(visu.id);
      }).then((res:any) => {
        expect(res.title).toEqual('newVizuTest');
        done();
      });
    });
  });

  describe('shareVisualization method', function(){
    it('must share a visualization', function(done){
      return linkurious.initSources().then(function(){
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
          source: 'local',
          admin: true,
          preferences: {}
        });
        done();
      });
    });
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
          source: 'local',
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
            source: 'local',
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

  describe('init method', function(){
    it('must set current user and default source', function(done){
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        expect(linkurious.state.user).toEqual({
          id: 6,
          username: 'testName',
          email: 'testName@test.fr',
          groups: [{'builtin':true, id : 4, name : 'admin'}],
          source: 'local',
          admin: true,
          preferences: {},
          actions: { all: ['rawReadQuery', 'rawWriteQuery'] }
        });
        expect(linkurious.state.currentSource).toEqual(jasmine.objectContaining({
          configIndex: 0
        }));
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
        done();
      });
    });
  });

  describe('processIndexation method', function(){
    it('must start indexation and return true when finish', function(done){
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.processIndexation(50, function(res){
          expect(res.indexing).toEqual('ongoing');
        })
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });

    it('must start an indexation with 50ms timedOut', (done) => {
      let linkurious50 = new Linkurious('http://localhost:3001', 'debug', logDriver);
      return linkurious50.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious50.admin.processIndexation(50, function(res){
          expect(res.indexing).toEqual('ongoing');
        });
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });

    it('must start an indexation with 3000ms timedOut', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.processIndexation(4000, function(res){
          expect(res.indexing).toEqual('ongoing');
        });
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('createDataSourceConfig method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'})
        .then(function(){
          return linkurious.admin.createDataSourceConfig({
            graphDb : {
              vendor:'neo4j',
              url:'http://127.0.0.2',
              user : 'test',
              password : 'test'
            },
            index : {
              vendor:'elasticSearch',
              host:'127.0.0.3',
              port:7878,
              forceReindex:false,
              dynamicMapping:false
            },
            name : 'test config'
          });
        }).then(function(res){
          expect(res).toBeTruthy();
          setTimeout(() => {
            done();
          }, 5000);
        });
      });
  });

  describe('connectDataSource method', () => {
    xit('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.connectDataSource({dataSourceIndex : 0});
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  /*describe('deleteDataSourceConfig method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.getSourceList();
      }).then(function(res){
        console.log(res);
        return linkurious.admin.deleteDataSourceConfig({dataSourceIndex : 1});
      }).then((res:any) => {
        console.log(res);
      })
    });
  });*/

  describe('getHiddenEdgeProperties method', () => {
    it('must return an array of edge Properties', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.getHiddenEdgeProperties();
      }).then(function(res){
        expect(res.length).toEqual(1);
        expect(res[0]).toBe('edgeHiddenProp');
        done();
      });
    });
  });

  describe('getHiddenNodeProperties method', () => {
    it('must return an array of node Properties', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.getHiddenNodeProperties();
      }).then(function(res){
        expect(res.length).toEqual(1);
        expect(res[0]).toBe('nodeHiddenProp');
        done();
      });
    });
  });

  describe('getNonIndexedEdgeProperties method', () => {
    it('must return an array of edge Properties', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.getNonIndexedEdgeProperties();
      }).then(function(res){
        expect(res.length).toEqual(2);
        expect(res[1]).toBe('edgeNoIndexProp');
        done();
      });
    });
  });

  describe('getNonIndexedNodeProperties method', () => {
    it('must return an array of node Properties', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.getNonIndexedNodeProperties();
      }).then(function(res){
        expect(res.length).toEqual(2);
        expect(res[1]).toBe('nodeNoIndexProp');
        done();
      });
    });
  });

  describe('setHiddenEdgeProperties method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.setHiddenEdgeProperties({properties : ['testHiddenEdgeProp']});
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('setHiddenNodeProperties method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.setHiddenNodeProperties({properties : ['testHiddenNodeProp']});
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('setNonIndexedEdgeProperties method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.admin.setNotIndexedEdgeProperties({properties : ['testNonIndexedEdgeProp']});
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('setNonIndexedNodeProperties method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged',password:'testPass'}).then(function(){
        return linkurious.getSourceList();
      }).then(sources => {
        console.log(linkurious.state.currentSource);
        linkurious.setCurrentSource(sources[0].key);
        console.log(linkurious.state.currentSource);
        return linkurious.admin.setNotIndexedNodeProperties({properties : ['testNonIndexedNodeProp'], dataSourceKey:'66a2bc71'});
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('deleteUser method', () => {
    it('must delete a user', (done) => {
      return linkurious.admin.createUser({
        username:'testdelete',
        email:'testDelete@test.fr',
        groups : [4],
        password:'testPass'
      }).then((res:any) => {
        return linkurious.admin.deleteUser(res.id);
      }).then((res: any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('createGroup method', () => {
    it('must return a group', (done) => {
      return linkurious.admin.createGroup({
        name:'testGroup',
        dataSourceKey:'66a2bc71'
      }).then((res:any) => {
        expect(res).toEqual(jasmine.objectContaining({
          id : 7
        }));
        expect(res).toEqual(jasmine.objectContaining({
          name : 'testGroup'
        }));
        done();
      });
    });
  });

  describe('deleteGroup method', () => {
    it('must return true', (done) => {
      return linkurious.admin.deleteGroup(7).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('getGroup method', () => {
    it('must return a group', (done) => {
      return linkurious.admin.getGroup({id:4, dataSourceKey:'66a2bc71'}).then((res:any) => {
        expect(res).toEqual(jasmine.objectContaining({
          id : 4
        }));
        expect(res).toEqual(jasmine.objectContaining({
          name : 'admin'
        }));
        done();
      });
    });
  });

  describe('getGroups method', () => {
    it('must return a group list', (done) => {
      return linkurious.admin.getGroups({dataSourceKey:'66a2bc71'}).then((res:any) => {
        expect(res.length).toEqual(4);
        done();
      });
    });
  });

  describe('getSimplegroups method', () => {
    it('must return a group list', (done) => {
      return linkurious.admin.getSimpleGroups().then((res:any) => {
        expect(res.length).toEqual(4);
        done();
      });
    });
  });
  
  describe('getGroupsRights method', () => {
    it('must return groups rights', (done) => {
      return linkurious.admin.getGroupsRights({dataSourceKey:'66a2bc71'}).then((res:any) => {
        expect(res.types.length).toEqual(4);
        expect(res.targetTypes.length).toEqual(4);
        done();
      })
    });
  });

  describe('updateBatchGroupsRights method', () => {
    it('must return true', (done) => {
      return linkurious.admin.updateBatchGroupsRights({
        dataSourceKey : '66a2bc71',
        groupIds : [5],
        rightType : 'none',
        targetType : 'nodeCategory'
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      })
    });
  });

  describe('updateGroupRights', () => {
    it('must return access rights modified', (done) => {
      return linkurious.admin.updateGroupRights({
        id : 5,
        dataSourceKey : '66a2bc71',
        type : 'write',
        targetType : 'nodeCategory',
        targetName : 'test'
      }).then((res:any) => {
        expect(res).toEqual(jasmine.objectContaining({
          type : 'write'
        }));
        expect(res).toEqual(jasmine.objectContaining({
          targetType : 'nodeCategory'
        }));
        done();
      })
    });
  });

  describe('updateBatchUser method', () => {
    it('must return true', (done) => {
      return linkurious.admin.updateBatchUser({
        users : [6],
        addGroups : [3],
        rmGroups : []
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      })
    });
  });

  describe('getDataSourcesList method', () => {
    it('must resturn a list of all dataSource', (done) => {
      return linkurious.admin.getDataSourcesList().then((res:any) => {
        expect(res.length).toEqual(2);
        expect(res[0].state).toEqual('needReindex');
        expect(res[1].state).toEqual('connecting');
        done();
      })
    });
  });

  describe('updateUser method', () => {
    it('must return user', (done) => {
      return linkurious.admin.updateUser({
        id:6,
        username:'testName'
      }).then((res:any) => {
        expect(res.username).toEqual('testName');
        expect(res.email).toEqual('testName@test.fr');
        done();
      })
    });
  });

  describe('countEdge method', () => {
    it('must return the number of edges', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.edge.count();
      }).then((res:any) => {
        expect(res).toEqual(17);
        done();
      });
    });
  });

  let edgeToDelete:number|string;

  describe('create Edge method', () => {
    it('must create an edge', (done) => {
      return linkurious.initSources().then(function(){
        return linkurious.search.nodes({
          q : 'Carrie-Anne Moss'
        });
      }).then((res:any) => {
        sourceId = res.results[0].children[0].id;
        return linkurious.search.nodes({
          q : 'Keanu Reeves'
        });
      }).then((res:any) => {
        targetId = res.results[0].children[0].id;
        return linkurious.edge.create({
          source : sourceId,
          target : targetId,
          type : 'PLAYS_WITH',
          data : {}
        });
      }).then((res:any) => {
        edgeToDelete = res.id;
        expect(res.type).toEqual('PLAYS_WITH');
        done();
      })
    });
  });

  describe('update edge method', () => {
    it('must return an edge updated', (done) => {
      return linkurious.initSources().then(function(){
        return linkurious.edge.update({
          id : edgeID,
          deletedData : [],
          data : {tralala:'test'},
          version : 1
        });
      }).then((res:any) => {
        expect(res.data).toEqual(jasmine.objectContaining({
          tralala : 'test'
        }));
        done();
      });
    });
  });

  describe('delete edge method', () => {
    it('must return true', (done) => {
      return linkurious.initSources().then(function(){
        return linkurious.edge.deleteOne(edgeToDelete);
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('isAuth method', () => {
    it('must return true if user is auth', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(() => {
        return linkurious.my.IsAuth();
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('isAdmin method', () => {
    it('must return true if user is admin', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(() => {
        return linkurious.my.IsAdmin();
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('getAllGraphQuery method', () => {
    it('must return an array of graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(() => {
        return linkurious.my.getAllGraphQueries();
      }).then((res:any) => {
        expect(res.length).toEqual(0);
        done();
      });
    });
  });

  describe('saveGraphQuery method', () => {
    it('must save a graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(() => {
        return linkurious.my.saveGraphQuery({
          name : 'mygraphQuery',
          dialect : 'cypher',
          content : 'MATCH(Person {name: \'Keanu Reeves\'})\nRETURN(Person)'
        });
      }).then((res:any) => {
        expect(res.id).toEqual(1);
        graphQueryId = res.id;
        done();
      });
    });
  });

  describe('update GraphQuery', () => {
    it('must update the graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(() => {
        return linkurious.my.updateGraphQuery({
          content : 'MATCH(Person {name: \'Carrie Anne Moss\'})\nRETURN(Person)',
          id : graphQueryId
        });
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('get a graphQuery method', () => {
    it('must return the right graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(() => {
        return linkurious.my.getGraphQuery(graphQueryId);
      }).then((res:any) => {
        expect(res.id).toEqual(1);
        done();
      });
    });
  });

  describe('delete a graphQuery method', () => {
    it('must delete the right graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(() => {
        return linkurious.my.deleteGraphQuery(graphQueryId);
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('getShortestsPaths method', () => {
    it('must return an array of nodes', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(() => {
        return linkurious.graph.getShortestPaths({
          startNode : sourceId,
          endNode : targetId,
          withVersion : true
        });
      }).then((res:any) => {
        expect(res.length).toEqual(3);
        done();
      })
    });
  });

  describe('countNode method', () => {
    it('must return thos number of nodes', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.node.count();
      }).then((res:any) => {
        expect(res).toEqual(12);
        done();
      });
    });
  });

  describe('createNode method', () => {
    it('must create a node', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.node.create({
          data : {
            name : 'Robert Mitchum'
          },
          categories : ['actor']
        });
      }).then((res:any) => {
        nodeToDelete = res.id;
        expect(res.data.name).toEqual('Robert Mitchum');
        expect(res.version).toEqual(1);
        done();
      });
    });
  });

  describe('deleteNode method', () => {
    it('must delete a node', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.node.deleteOne(nodeToDelete);
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('getNeighborsCategories method', () => {
    it('must return an array of digest', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.node.getNeighborsCategories({ids:[nodeId]});
      }).then((res:any) => {
        expect(res.length).toEqual(3);
        done();
      })
    });
  });

  describe('searchFullNodes method', () => {
    it('must return an array of nodes', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.search.fullNodes({q:'matrix'});
      }).then((res:any) => {
        expect(res.length).toEqual(3);
        done();
      });
    });
  });

  describe('searchFullEdges method', () => {
    it('must return a array of edges', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.search.fullEdges({q:'ACTED_IN'});
      }).then((res:any) => {
        expect(res.length).toEqual(7);
        done();
      });
    });
  });

  describe('search NodesInDirectory method', () => {
    it('must return a search result', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.search.NodesInDirectory({
          categoriesOrTypes : ['Person'],
          properties : ['name']
        });
      }).then((res:any) => {
        expect(res.totalHits).toEqual(7);
        expect(res.type).toEqual('nodes');
        expect(res.results.length).toEqual(7);
        done();
      });
    });
  });

  describe('search EdgesInDirectory method', () => {
    it('must return a search result', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.search.EdgesInDirectory({
          properties : ['roles', 'altEdgeID']
        });
      }).then((res:any) => {
        expect(res.totalHits).toEqual(17);
        expect(res.type).toEqual('edges');
        expect(res.results.length).toEqual(17);
        done();
      });
    });
  });

  describe('count visualization method', () => {
    it('must return the number of visualization', (done) => {
      return linkurious.init({usernameOrEmail:'testName',password:'testPass'}).then(function(){
        return linkurious.visualization.count();
      }).then((res:any) => {
        expect(res).toEqual(7);
        done();
      });
    });
  });

  describe('getTree method', () => {
    it('must return visualizations', (done) => {
      return linkurious.init({usernameOrEmail:'simpleUser',password:'123'}).then(function(){
        return linkurious.visualization.getTree();
      }).then((res:any) => {
        expect(res[1].id).toEqual(5);
        expect(res[1].type).toEqual('visu');
        visu = res[1];
        done();
      });
    });
  });

  let folderId:number;

  describe('createFolder method', () => {
    it('must create a folder', (done) => {
      return linkurious.init({usernameOrEmail:'simpleUser',password:'123'}).then(function(){
        return linkurious.visualization.createFolder({parent : 0, title : 'testFolder'});
      }).then((res:any) => {
        expect(res.title).toEqual('testFolder');
        folderId = res.id;
        done();
      })
    });
  });

  describe('updateFolder method', () => {
    it('must update te folder', (done) => {
      return linkurious.init({usernameOrEmail:'simpleUser',password:'123'}).then(function(){
        return linkurious.visualization.updateFolder({
          id : folderId,
          key : 'title',
          value : 'newFolderName'
        });
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('delete folder method', () => {
    it('must delete a folder', (done) => {
      return linkurious.init({usernameOrEmail:'simpleUser',password:'123'}).then(function(){
        return linkurious.visualization.deleteFolder(folderId);
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  let visuToDelete:number;

  describe('duplicate visu method', () => {
    xit('must return the created visu', (done) => {
      return linkurious.init({usernameOrEmail:'simpleUser',password:'123'}).then(function(){
        return linkurious.visualization.duplicate(visu.id);
      }).then((res:any) => {
        expect(res.title).toEqual('Copy of youpi vizu');
        visuToDelete = res.id;
        done();
      });
    });
  });

  describe('delete a visu method', () => {
    xit('must delete a visu', (done) => {
      return linkurious.init({usernameOrEmail:'simpleUser',password:'123'}).then(function(){
        return linkurious.visualization.deleteOne(visuToDelete);
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('get share rights of a visu method', () => {
    it('must return sharers', (done) => {
      return linkurious.init({usernameOrEmail:'simpleUser',password:'123'}).then(function(){
        return linkurious.visualization.getShares(visu.id);
      }).then((res:any) => {
        expect(res.shares.length).toEqual(0);
        expect(res.owner.id).toEqual(2);
        done();
      })
    });
  });

  describe('updateVisu method', () => {
    xit('must update the visu', (done) => {
      return linkurious.init({usernameOrEmail:'simpleUser',password:'123'}).then(function(){
        return linkurious.visualization.update({
          id : visu.id,
          forceLock : false,
          visualization : {
            title : 'youpla visu'
          }
        });
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      })
    });
  });
});

