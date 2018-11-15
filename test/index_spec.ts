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

import {
    IFullUser, IItemType, IOgmaEdge, IOgmaNode, IProperty, IShare, IVisualization,
    Linkurious, TypeAccessRight
} from '../index';
import {FetcherSpec} from './fetcher_spec';
import {LinkuriousErrorSpec} from './LinkuriousError_spec';
import {DefaultLoggerDriverSpec} from './DefaultLoggerDriver_spec';

FetcherSpec.test();
LinkuriousErrorSpec.test();
DefaultLoggerDriverSpec.test();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('Linkurious class', () => {

  let visu:any;
  let widget:any;
  let node:IOgmaNode;
  let linkurious:Linkurious;
  let testLog:boolean;
  let logDriver:any;
  let edgeID:string|number;
  let nodeId:string|number;
  let sourceKey:string;
  let graphQueryId:number;
  let sourceId:string|number;
  let targetId:string|number;
  let nodeToDelete:string|number;
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
        return linkurious.search.simple({
          type: 'nodes',
          q : 'Keanu Reeves'
        });
      }).then(function(res:any){
        expect(res.type).toEqual('node');
        expect(res.totalHits).toEqual(1);
        expect(res.results[0].data.categories).toEqual(['Person']);

        nodeId = res.results[0].id;
        done();
      });
    });

    it('must return an edge', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.search.simple({
          type: 'edges',
          q : 'ACTED_IN'
        });
      }).then(function(res:any){
        expect(res.type).toEqual('edge');
        expect(res.totalHits).toEqual(7);
        edgeID = res.results[0].id;
        done();
      });
    });
  });

  describe('initSources method', function(){
    it('must set the right dataSource', function(done){
      return linkurious.initSources().then(function(res:any){
        expect(res).toEqual(jasmine.objectContaining({
          configIndex: 0
        }));
        sourceKey = res.key;
        done();
      });
    });
  });

  let alertId:number;

  describe('createAlert method', () => {
    it('must create an alert', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.createAlert({
          title:'testAlert',
          query:'MATCH (n1:Movie) WHERE n1.released < 2000 RETURN n1, n1.released',
          dialect:'cypher',
          enabled:true,
          cron:'* * * * *'
        }, sourceKey).then((res:any) => {
          alertId = res.id;
          expect(res.matchTTL).toEqual(0);
          setTimeout(() => {
            done();
          }, 5000);
        });
      });
    });
  });

  describe('getAlerts for user method', () => {
    it('must return an array of alerts', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getAlerts(sourceKey).then((res:any) => {
          expect(res.length).toEqual(1);
          expect(res[0].title).toEqual('testAlert');
          done();
        });
      });
    });
  });

  describe('getAlert for user method', () => {
    it('must return an alert', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getAlert({
          id : alertId
        }, sourceKey).then((res:any) => {
          expect(res.title).toEqual('testAlert');
          done();
        });
      });
    });
  });

  let matchId:number;

  describe('getMatches method', () => {
    it('must return an array of matches', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getMatches({
          id : alertId,
          offset:0,
          limit:20
        }, sourceKey).then((res:any) => {
          matchId = res.matches[0].id;
          expect(Array.isArray(res.matches)).toBeTruthy();
          done();
        });
      });
    });
  });

  describe('updateAlert method', () => {
    it('must update an alert', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.updateAlert({
          id : alertId,
          title:'testAlertModified'
        }).then((res:any) => {
          expect(res.id).toEqual(alertId);
          expect(res.title).toEqual('testAlertModified');
          done();
        });
      });
    });
  });

  describe('addActionToMatch method', () => {
    it('must return true', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.addActionToMatch({
          alertId : alertId,
          action : 'confirm',
          matchId : matchId
        }, sourceKey).then((res:any) => {
          expect(res).toEqual('');
          done();
        });
      });
    });
  });

  describe('getMatch method', () => {
    it('must return the match', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getMatch({
          alertId : alertId,
          matchId : matchId
        }, sourceKey).then((res:any) => {
          expect(res.nodes.length).toEqual(1);
          expect(res.status).toEqual('confirmed');
          done();
        });
      });
    });
  });

  describe('getMatchActions method', () => {
    it('must return all actions of specified match', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getMatchActions({
          alertId : alertId,
          matchId : matchId
        }, sourceKey).then((res:any) => {
          expect(res.length).toEqual(1);
          expect(res[0].action).toEqual('confirm');
          done();
        });
      });
    });
  });

  describe('getAlerts method', () => {
    it('must return an array of alerts', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.getAlerts(sourceKey).then((res:any) => {
          expect(res.length).toEqual(1);
          expect(res[0].title).toEqual('testAlertModified');
          done();
        });
      });
    });
  });

  describe('getAlert method', () => {
    it('must return an alert', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.getAlert({
          id : alertId
        }, sourceKey).then((res:any) => {
          expect(res.title).toEqual('testAlertModified');
          done();
        });
      });
    });
  });

  describe('deleteAlert method', () => {
    it('must return true', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.deleteAlert({
          id : alertId
        }, sourceKey).then((res:any) => {
          expect(res).toEqual('');
          done();
        });
      });
    });
  });

  describe('resetDefaults method', () => {
    it('must return true', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.resetDefaults({design: true}, sourceKey).then((res:any) => {
          expect(res).toEqual('');
          done();
        });
      });
    });
  });

  describe('setCurrentSource method', function(){
    it('must set the dataSource by ConfigIndex', function(done){
      return linkurious.getSourceList().then(sources => {
        linkurious.setCurrentSource(sources[0]);
        expect(linkurious.state.currentSource.configIndex).toEqual(0);
        done();
      });
    });
  });

  describe('getAppStatus', () => {
    it('must return linkurious status', (done) => {
      return linkurious.getAppStatus().then((res:any) => {
        expect(res).toEqual(jasmine.objectContaining({
          message: 'Linkurious ready to go :)'
        }));

        expect(res).toEqual(jasmine.objectContaining({
          name: 'initialized'
        }));
        done();
      });
    });
  });

  describe('getNodesByQuery method', function(){
    it('must return the right nodes for the query', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.graph.runQuery({
          dialect : 'cypher',
          query : 'MATCH (n)\n WHERE ID(n)=' + nodeId + ' return n LIMIT 1'
        });
      }).then(function(res:any){
        expect(res.nodes[0].data.properties.name).toEqual('Keanu Reeves');
        done();
      }).catch(e => console.log(e));
    });
  });

  describe('searchUsers method', function(){
    it('must return a list of users', function(done){
      return linkurious.search.getUsers({groupId:4, limit:4, offset:0, startsWith: ''}).then(function(res:any){
        expect(res.found).toEqual(0);
        done();
      });
    });
  });

  describe('getCustomFiles method', function () {
    it('must return an array of files', function(done){
      return linkurious.getCustomFiles().then(function(res){
        expect(res.results.length).toBeGreaterThan(0);
        done();
      });
    });
  });

  describe('getEdge method', () => {
    it('must return a edge', (done) => {
      return linkurious.initSources().then(() => {
        return linkurious.edge.getOne({id: edgeID});
      }).then((res:any) => {
        expect(res.edges[0].data.type).toEqual('ACTED_IN');
        done();
      });
    });
  });

  describe('getNode method', function(){
    it('must return the right node', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.node.getOne({
          id:nodeId
        });
      }).then(function(res:{nodes:Array<IOgmaNode>, edges:Array<IOgmaEdge>}){
        node = res.nodes[0];
        expect(res.nodes[0].id).toEqual(nodeId);
        expect(res.nodes[0].data.properties).toEqual({ name: 'Keanu Reeves', born: 1964 });
        expect(res.edges.length).toEqual(0);
        done();
      });
    });
  });

  describe('expandNode method', function(){
    it('must return the right array of nodes and edges', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.node.expand({
          ids:[nodeId],
          edgesTo:[nodeId]
        });
      }).then(function(res:{nodes:Array<IOgmaNode>, edges:Array<IOgmaEdge>}){
        expect(res.nodes.length).toBeGreaterThan(0);
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
          deletedProperties : [],
          properties : {name : 'Keanu Reeves', born : 1964, test:'test update'},
          readAt: ''
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
        expect(res.sort((a, b) => {
          return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0;
        })).toEqual([{ key: 'altEdgeID', count: 1 }, { key: 'roles', count: 4 }]);
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
      }).then(function(res:Array<IProperty>){
        expect(res.length).toBeGreaterThan(0);
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
      }).then(function(res:{any:{access:TypeAccessRight}; results:Array<IItemType>}){
        let sortedResponse:Array<IItemType> = res.results.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        expect(sortedResponse[0].name).toEqual('ACTED_IN');
        done();
      });
    });
  });

  describe('getNodeTypes method', function(){
    it('must return node types', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.node.getTypes();
      }).then(function(res:{any:{access:TypeAccessRight}; results:Array<IItemType>}){
        expect(res.results.length).toEqual(8);
        done();
      });
    });
  });

  describe('getSandbox method', function(){
    it('must return a visualization object', function(done){
      return linkurious.initSources().then(function(){
        return linkurious.visualization.getSandbox({
          doLayout : false
        });
      }).then(function(res:IVisualization){
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
          nodeFields: {
            captions: {
              'COMPANY': {
                displayName: false,
                active: true,
                properties: ['name']
              }
            },
            types: {}
          }
        });
      }).then((res:any) => {
        expect(res).toEqual('');
        done();
      });
    });
  });

  let userId:number;

  describe('createUser method', function(){
    it('must create a new user', function(done){
      return linkurious.admin.getGroups({withAccessRights: false}, sourceKey)
        .then((groups:Array<any>) => {
          return linkurious.admin.createUser({
            username:'testName',
            email:'testName@test.fr',
            groups : groups.filter(g => g.name === 'admin').map(g => g.id),
            password:'testPass'
          });
        })
        .then(function(res:IFullUser){
        userId = res.id;
        expect(res.username).toEqual('testName');
        done();
      });
    });
  });

  describe('updateConfig method', function(){
    it('must change app config', function(done){
      return linkurious.admin.updateConfig({
        path : 'access.authRequired',
        configuration : true
      }).then(function(){
        return linkurious.getAppConfig();
      }).then(function(res:any){
        expect(res.access.authRequired).toBeTruthy();
        done();
      });
    });
  });

  describe('login method', function(){
    it('must log a user and hydrate app state', function(done){
      return linkurious.login({usernameOrEmail:'testName', password: 'testPass'}).then(function(res){
        expect(linkurious.state.user.id).toEqual(userId);
        expect(res).toBeTruthy();
        done();
      });
    });

    it('must logout before login if another user is currently authenticated', function(done){
      return linkurious.login({usernameOrEmail:'testName', password: 'testPass'}).then(function(){
        return linkurious.login({usernameOrEmail:'testName', password: 'testPass'}).then(function(res){
          expect(linkurious.state.user.id).toEqual(userId);
          expect(res).toBeTruthy();
          done();
        });
      });
    });
  });

  describe('logout method', function(){
    it('must disconnect user and reset client state', function(done){
      return linkurious.login({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.logout();
      }).then(function(res){
        expect(res).toEqual('user disconnected');
        expect(linkurious.state.user).toBeUndefined();
        done();
      });
    });
  });

  describe('init method', function(){
    it('must set current user and default source', function(done){
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        expect(linkurious.state.user.id).toEqual(userId);
        expect(linkurious.state.currentSource.configIndex).toEqual(0);
        done();
      });
    });
  });

  describe('updateCurrentUser', function(){
    it('must update current user and reflect it in state', function(done){
      return linkurious.login({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.updateCurrentUser({
          id : userId,
          username : 'nameChanged'
        });
      }).then(function(){
        expect(linkurious.state.user.username).toEqual('nameChanged');
        expect(linkurious.state.user.id).toEqual(userId);
        expect(linkurious.state.user.email).toEqual('testName@test.fr');
        done();
      });
    });
  });

  let vizId:number;

  describe('createWidget method', () => {
    it('must create a widget', (done) => {

      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'})
        .then(() => {
          return linkurious.visualization.getSandbox();
        })
        .then((response:any) => {
          response.title = 'test';
          return linkurious.visualization.create(response);
        })
        .then((res) => {
          vizId = res.id;
        })
        .then(() => {
          return linkurious.visualization.createWidget({
            visualizationId : vizId
          });
        })
        .then((res:any) => {
          widget = res;
          expect(typeof res).toEqual('string');
          done();
        });
    });
  });

  describe('get widget method', () => {
    it('must return a widget', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'})
        .then(() => {
        return linkurious.visualization.getWidget({id:widget});
      }).then((res:any) => {
        expect(res.key).toEqual(widget);
        expect(res.userId).toEqual(userId);
        done();
      });
    });
  });

  describe('deleteWidget method', () => {
    it('must delete a widget', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'})  .then(() => {
        return linkurious.visualization.deleteWidget({id:widget});
      }).then((res:any) => {
        expect(res).toEqual('');
        done();
      });
    });
  });

  describe('create visu method', () => {
    it('must return a visualization', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'})  .then(() => {
        return linkurious.visualization.create({
          title : 'newVizuTest',
          nodes:[{
            id : nodeId,
            nodelink:{
              x:50,
              y:50
            }
          }],
          edges:[{
            id : edgeID
          }],
          nodeFields:{
            captions : {},
            types: {}
          },
          edgeFields:{
            captions : {},
            types: {}
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
    it('must return a visu', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'})
        .then(function(){
        return linkurious.visualization.getOne({id:visu.id, populated : true});
      }).then((res:any) => {
        expect(res.title).toEqual('newVizuTest');
        done();
      });
    });
  });

  describe('shareVisualization method', function(){
    it('must share a visualization', function(done){
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'}).then(function(){
        return linkurious.visualization.share({
          userId:userId,
          right :'read',
          vizId:vizId
        });
      }).then(function(res:IShare){
        expect(res.visualizationId).toEqual(vizId);
        expect(res.userId).toEqual(userId);
        done();
      });
    });
  });

  describe('getHiddenEdgeProperties method', () => {
    it('must return an array of edge Properties', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'}).then(function(){
        return linkurious.admin.getHiddenEdgeProperties();
      }).then(function(res:any){
        expect(res.length).toEqual(1);
        expect(res[0]).toBe('edgeHiddenProp');
        done();
      });
    });
  });

  describe('getHiddenNodeProperties method', () => {
    it('must return an array of node Properties', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'}).then(function(){
        return linkurious.admin.getHiddenNodeProperties();
      }).then(function(res:any){
        expect(res.length).toEqual(1);
        expect(res[0]).toBe('nodeHiddenProp');
        done();
      });
    });
  });

  describe('getNonIndexedEdgeProperties method', () => {
    it('must return an array of edge Properties', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'}).then(function(){
        return linkurious.admin.getNonIndexedEdgeProperties();
      }).then(function(res:any){
        expect(res.length).toEqual(2);
        expect(res[1]).toBe('edgeNoIndexProp');
        done();
      });
    });
  });

  describe('getNonIndexedNodeProperties method', () => {
    it('must return an array of node Properties', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'}).then(function(){
        return linkurious.admin.getNonIndexedNodeProperties();
      }).then(function(res:any){
        expect(res.length).toEqual(2);
        expect(res[1]).toBe('nodeNoIndexProp');
        done();
      });
    });
  });

  describe('setHiddenEdgeProperties method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'}).then(function(){
        return linkurious.admin.setHiddenEdgeProperties({properties : ['testHiddenEdgeProp']});
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('setHiddenNodeProperties method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'}).then(function(){
        return linkurious.admin.setHiddenNodeProperties({properties : ['testHiddenNodeProp']});
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('setNonIndexedEdgeProperties method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'})
      .then(() => {
        return linkurious.admin.setNotIndexedEdgeProperties({properties : ['testNonIndexedEdgeProp']});
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('setNonIndexedNodeProperties method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'})
      .then(() => {
        return linkurious.admin.setNotIndexedNodeProperties({properties : ['testNonIndexedNodeProp']}, sourceKey);
      }).then(function(res){
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  describe('createDataSourceConfig method', () => {
    it('must return true', (done) => {
      return linkurious.init({usernameOrEmail:'nameChanged', password:'testPass'})
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
    it('must return true', (done) => {
      return linkurious.initSources()
        .then(() => {
          return linkurious.admin.connectDataSource(0);
        })
        .then(function(res){
          expect(res).toBe('');
          done();
        });
    });
  });

  describe('deleteUser method', () => {
    it('must delete a user', (done) => {
      return linkurious.admin.getGroups({withAccessRights: false}, sourceKey)
        .then((groups) => {
          return linkurious.admin.createUser({
            username:'testdelete',
            email:'testDelete@test.fr',
            groups : groups.filter(g => g.name === 'admin').map(g => g.id),
            password:'testPass'
          });
        })
      .then((res:any) => {
        return linkurious.admin.deleteUser(res.id);
      }).then((res:any) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });

  let groupId:number;

  describe('createGroup method', () => {
    it('must return a group', (done) => {
      return linkurious.admin.createGroup({
        name:'testGroup'
      }, sourceKey).then((res:any) => {
        groupId = res.id;
        expect(res.name).toEqual('testGroup');
        done();
      });
    });
  });

  describe('deleteGroup method', () => {
    it('must return true', (done) => {
      return linkurious.admin.deleteGroup({id: groupId}, sourceKey).then((res:any) => {
        expect(res).toEqual('');
        done();
      });
    });
  });

  describe('getGroup method', () => {
    it('must return a group', (done) => {
      return linkurious.admin.getGroups({withAccessRights: false}, sourceKey)
        .then((groups) => {
          let adminId:number = groups.filter(g => g.name === 'admin').map(g => g.id)[0];
          return linkurious.admin.getGroup({id:adminId}, sourceKey);
        })
        .then((res:any) => {
          expect(res.name).toEqual('admin');
          done();
        });
    });
  });

  describe('getGroups method', () => {
    it('must return a group list', (done) => {
      return linkurious.admin.getGroups(undefined, sourceKey).then((res:any) => {
        expect(Array.isArray(res)).toBeTruthy();
        done();
      });
    });
  });

  describe('getGroupsRights method', () => {
    it('must return groups rights', (done) => {
      return linkurious.admin.getGroupsRights().then((res:any) => {
        expect(res.types.length).toEqual(5);
        expect(res.targetTypes.length).toEqual(4);
        done();
      });
    });
  });

  describe('getDataSourcesList method', () => {
    it('must resturn a list of all dataSource', (done) => {
      return linkurious.admin.getDataSourcesList().then((res:any) => {
        expect(res.length).toEqual(2);
        expect(res[0].state).toEqual('needReindex');
        expect(res[1].state).toEqual('connecting');
        done();
      });
    });
  });

  describe('updateUser method', () => {
    it('must return user', (done) => {
      return linkurious.admin.updateUser({
        id:userId,
        username:'testName'
      }).then((res:any) => {
        expect(res.username).toEqual('testName');
        expect(res.email).toEqual('testName@test.fr');
        done();
      });
    });
  });

  describe('countEdge method', () => {
    it('must return the number of edges', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.edge.count();
      }).then((res:any) => {
        expect(res).toEqual(19);
        done();
      });
    });
  });

  let edgeToDelete:number|string;

  describe('create Edge method', () => {
    it('must create an edge', (done) => {
      return linkurious.initSources().then(function(){
        return linkurious.search.simple({
          type: 'nodes',
          q : 'Carrie-Anne Moss'
        });
      }).then((res:any) => {
        sourceId = res.results[0].id;
        return linkurious.search.simple({
          type: 'nodes',
          q : 'Keanu Reeves'
        });
      }).then((res:any) => {
        targetId = res.results[0].id;
        return linkurious.edge.create({
          source : sourceId,
          target : targetId,
          type : 'PLAYS_WITH',
          properties : {}
        });
      }).then((res:any) => {
        edgeToDelete = res.id;
        expect(res.data.type).toEqual('PLAYS_WITH');
        done();
      });
    });
  });

  describe('update edge method', () => {
    it('must return an edge updated', (done) => {
      return linkurious.initSources().then(function(){
        return linkurious.edge.update({
          id : edgeID,
          deletedProperties : [],
          properties : {tralala:'test'},
          readAt: '2018-04-16T09:57:31.949Z'
        });
      }).then((res:any) => {
        expect(res.data.properties.tralala).toEqual('test');
        done();
      });
    });
  });

  describe('delete edge method', () => {
    it('must return true', (done) => {
      return linkurious.initSources().then(function(){
        return linkurious.edge.deleteOne({id:edgeToDelete});
      }).then((res:any) => {
        expect(res).toEqual('');
        done();
      });
    });
  });

  describe('isAuth method', () => {
    it('must return true if user is auth', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(() => {
        return linkurious.my.IsAuth();
      }).then((res:any) => {
        expect(res).toEqual('');
        done();
      });
    });
  });

  describe('getAllGraphQuery method', () => {
    it('must return an array of graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(() => {
        return linkurious.my.getAllGraphQueries({type: 'static'});
      }).then((res:any) => {
        expect(res.length).toEqual(0);
        done();
      });
    });
  });

  describe('saveGraphQuery method', () => {
    it('must save a graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(() => {
        return linkurious.my.saveGraphQuery({
          name : 'mygraphQuery',
          description : 'trololo',
          sharing: 'source',
          type: 'static',
          dialect : 'cypher',
          content : 'MATCH(Person {name: \'Keanu Reeves\'})\nRETURN(Person)'
        });
      }).then((res:any) => {
        graphQueryId = res.id;
        expect(res.id).toEqual(1);
        done();
      });
    });
  });

  describe('update GraphQuery', () => {
    it('must update the graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(() => {
        return linkurious.my.updateGraphQuery({
          content : 'MATCH(Person {name: \'Carrie Anne Moss\'})\nRETURN(Person)',
          id : graphQueryId
        });
      }).then((res:any) => {
        expect(res.content).toEqual('MATCH(Person {name: \'Carrie Anne Moss\'})\nRETURN(Person)');
        done();
      });
    });
  });

  describe('get a graphQuery method', () => {
    it('must return the right graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(() => {
        return linkurious.my.getGraphQuery({id:graphQueryId});
      }).then((res:any) => {
        expect(res.id).toEqual(1);
        done();
      });
    });
  });

  describe('delete a graphQuery method', () => {
    it('must delete the right graphQuery', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(() => {
        return linkurious.my.deleteGraphQuery({id:graphQueryId});
      }).then((res:any) => {
        expect(res).toEqual('');
        done();
      });
    });
  });

  describe('getShortestsPaths method', () => {
    it('must return an array of nodes', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(() => {
        return linkurious.graph.getShortestPaths({
          startNode : sourceId,
          endNode : targetId
        });
      }).then((res:any) => {
        expect(res.results.length).toEqual(3);
        done();
      });
    });
  });

  describe('countNode method', () => {
    it('must return thos number of nodes', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(function(){
        return linkurious.node.count();
      }).then((res:any) => {
        expect(res).toEqual(14);
        done();
      });
    });
  });

  describe('createNode method', () => {
    it('must create a node', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(function(){
        return linkurious.node.create({
          properties : {
            name : 'Robert Mitchum'
          },
          categories : ['actor']
        });
      }).then((res:any) => {
        nodeToDelete = res.id;
        expect(res.data.properties.name).toEqual('Robert Mitchum');
        done();
      });
    });
  });

  describe('deleteNode method', () => {
    it('must delete a node', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(function(){
        return linkurious.node.deleteOne({id:nodeToDelete});
      }).then((res:any) => {
        expect(res).toEqual('');
        done();
      }).catch(e => console.log(e));
    });
  });

  describe('getNeighborsCategories method', () => {
    it('must return an array of digest', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(function(){
        return linkurious.node.getNeighborsCategories({ids:[nodeId]});
      }).then((res:any) => {
        expect(res).toEqual({});
        done();
      });
    });
  });

  describe('searchFullNodes method', () => {
    it('must return an array of nodes', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password: 'testPass'}).then(function(){
        return linkurious.search.advanced({type: 'nodes', q:'matrix'});
      }).then((res:any) => {
        expect(res.results.length).toEqual(3);
        done();
      });
    });
  });

  describe('searchFullEdges method', () => {
    it('must return a array of edges', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.search.advanced({type: 'edges', q:'ACTED_IN'});
      }).then((res:any) => {
        expect(res.results.length).toEqual(7);
        done();
      });
    });
  });

  describe('count visualization method', () => {
    it('must return the number of visualization', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.visualization.count();
      }).then((res:any) => {
        expect(res).toEqual(2);
        done();
      });
    });
  });

  describe('getTree method', () => {
    it('must return visualizations', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.visualization.getTree();
      }).then((res:any) => {
        expect(res[1].id).toEqual(4);
        expect(res[1].type).toEqual('visu');
        visu = res[1];
        done();
      });
    });
  });

  let folderId:number;

  describe('createFolder method', () => {
    it('must create a folder', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.visualization.createFolder({parent : 0, title : 'testFolder'});
      }).then((res:any) => {
        expect(res.title).toEqual('testFolder');
        folderId = res.id;
        done();
      });
    });
  });

  describe('updateFolder method', () => {
    it('must update te folder', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
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
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.visualization.deleteFolder({id:folderId});
      }).then((res:any) => {
        expect(res).toEqual('');
        done();
      });
    });
  });

  let visuToDelete:number;

  describe('duplicate visu method', () => {
    it('must return the created visu', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.visualization.duplicate({id:visu.id});
      }).then((res:any) => {
        expect(res.title).toEqual('newVizuTest');
        visuToDelete = res.id;
        done();
      });
    });
  });

  describe('delete a visu method', () => {
    it('must delete a visu', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.visualization.deleteOne({id:visuToDelete});
      }).then((res:any) => {
        expect(res).toBe('');
        done();
      });
    });
  });

  describe('get share rights of a visu method', () => {
    it('must return sharers', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.visualization.getShares({id:visu.id});
      }).then((res:any) => {
        expect(res.shares.length).toEqual(0);
        expect(res.owner.id).toEqual(4);
        done();
      });
    });
  });

  describe('updateVisu method', () => {
    it('must update the visu', (done) => {
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.visualization.update({
          id : visu.id,
          forceLock : false,
          title : 'youpla visu'
        });
      }).then((res:any) => {
        expect(res).toBe('');
        done();
      });
    });
  });

  describe('processIndexation method', function(){
    it('cannot start indexation', function(done){
      let key:string;
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        key = linkurious.state.currentSource.key;
        return linkurious.admin.startIndexation();
      }).catch((e) => {
        expect(e.message).toEqual('You can\'t do action "admin.index" on any data-source.');
        done();
      });
    });
  });

  describe('processIndexation method', function(){
    it('cannot start indexation', function(done){
      return linkurious.init({usernameOrEmail:'testName', password:'testPass'}).then(function(){
        return linkurious.admin.startIndexation();
      }).then(function(){
        return linkurious.admin.processIndexation(50, function(res){
          expect(res.indexing).toEqual('ongoing');
        });
      }).then((res) => {
        expect(res).toBeTruthy();
        done();
      });
    });
  });
});
