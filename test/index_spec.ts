/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-06-08.
 */

import {expect} from 'chai';
import 'mocha';
import {
  IFullUser,
  IItemType,
  IOgmaEdge,
  IOgmaNode,
  IProperty,
  IShare,
  IVisualization,
  Linkurious,
  TypeAccessRight
} from '../index';

describe('Linkurious class', () => {
  let visu: any;
  let widget: any;
  let node: IOgmaNode;
  let linkurious: Linkurious;
  let testLog: boolean;
  let logDriver: any;
  let edgeID: string | number;
  let nodeId: string | number;
  let sourceKey: string;
  let graphQueryId: number;
  let sourceId: string | number;
  let targetId: string | number;
  let nodeToDelete: string | number;
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

  describe('searchNodes method', function() {
    it('must return a node', function() {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.search.simple({
            type: 'nodes',
            q: 'Keanu Reeves'
          });
        })
        .then(function(res: any) {
          expect(res.type).to.equal('node');
          expect(res.totalHits).to.eql(1);
          expect(res.results[0].data.categories).to.eql(['Person']);

          nodeId = res.results[0].id;
        });
    });

    it('must return an edge', function() {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.search.simple({
            type: 'edges',
            q: 'ACTED_IN'
          });
        })
        .then(function(res: any) {
          expect(res.type).to.eql('edge');
          expect(res.totalHits).to.eql(7);
          edgeID = res.results[0].id;
        });
    });
  });

  describe('initSources method', function() {
    it('must set the right dataSource', function() {
      return linkurious.initSources().then(function(res: any) {
        expect(res.configIndex).to.eql(0);
        sourceKey = res.key;
      });
    });
  });

  let alertId: number;

  describe('createAlert method', () => {
    it('must create an alert', () => {
      return linkurious.initSources().then(() => {
        return linkurious.admin
          .createAlert(
            {
              title: 'testAlert',
              query: 'MATCH (n1:Movie) WHERE n1.released < 2000 RETURN n1, n1.released',
              dialect: 'cypher',
              enabled: true,
              cron: '* * * * *'
            },
            sourceKey
          )
          .then((res: any) => {
            alertId = res.id;
            expect(res.matchTTL).to.eql(0);
          });
      });
    });
  });

  describe('getAlerts for user method', () => {
    it('must return an array of alerts', () => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts.getAlerts(sourceKey).then((res: any) => {
          expect(res.length).to.eql(1);
          expect(res[0].title).to.eql('testAlert');
        });
      });
    });
  });

  describe('getAlert for user method', () => {
    it('must return an alert', () => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts
          .getAlert(
            {
              id: alertId
            },
            sourceKey
          )
          .then((res: any) => {
            expect(res.title).to.eql('testAlert');
          });
      });
    });
  });

  let matchId: number;

  describe('getMatches method', () => {
    it('must return an array of matches', () => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts
          .getMatches(
            {
              id: alertId,
              offset: 0,
              limit: 20
            },
            sourceKey
          )
          .then((res: any) => {
            matchId = res.matches[0].id;
            expect(res.counts.unconfirmed).to.equal(2);
          });
      });
    });
  });

  describe('updateAlert method', () => {
    it('must update an alert', () => {
      return linkurious.initSources().then(() => {
        return linkurious.admin
          .updateAlert({
            id: alertId,
            title: 'testAlertModified'
          })
          .then((res: any) => {
            expect(res.id).to.eql(alertId);
            expect(res.title).to.eql('testAlertModified');
          });
      });
    });
  });

  describe('addActionToMatch method', () => {
    it('must return true', () => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts
          .addActionToMatch(
            {
              alertId: alertId,
              action: 'confirm',
              matchId: matchId
            },
            sourceKey
          )
          .then((res: any) => {
            expect(res).to.eql('');
          });
      });
    });
  });

  describe('getMatch method', () => {
    it('must return the match', () => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts
          .getMatch(
            {
              alertId: alertId,
              matchId: matchId
            },
            sourceKey
          )
          .then((res: any) => {
            expect(res.nodes.length).to.eql(1);
            expect(res.status).to.eql('confirmed');
          });
      });
    });
  });

  describe('getMatchActions method', () => {
    it('must return all actions of specified match', () => {
      return linkurious.initSources().then(() => {
        return linkurious.alerts
          .getMatchActions(
            {
              alertId: alertId,
              matchId: matchId
            },
            sourceKey
          )
          .then((res: any) => {
            expect(res.length).to.eql(1);
            expect(res[0].action).to.eql('confirm');
          });
      });
    });
  });

  describe('getAlerts method', () => {
    it('must return an array of alerts', () => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.getAlerts(sourceKey).then((res: any) => {
          expect(res.length).to.eql(1);
          expect(res[0].title).to.eql('testAlertModified');
        });
      });
    });
  });

  describe('getAlert method', () => {
    it('must return an alert', () => {
      return linkurious.initSources().then(() => {
        return linkurious.admin
          .getAlert(
            {
              id: alertId
            },
            sourceKey
          )
          .then((res: any) => {
            expect(res.title).to.eql('testAlertModified');
          });
      });
    });
  });

  describe('deleteAlert method', () => {
    it('must return true', () => {
      return linkurious.initSources().then(() => {
        return linkurious.admin
          .deleteAlert(
            {
              id: alertId
            },
            sourceKey
          )
          .then((res: any) => {
            expect(res).to.eql('');
          });
      });
    });
  });

  describe('resetDefaults method', () => {
    it('must return true', () => {
      return linkurious.initSources().then(() => {
        return linkurious.admin.resetDefaults({design: true}, sourceKey).then((res: any) => {
          expect(res).to.eql('');
        });
      });
    });
  });

  describe('setCurrentSource method', function() {
    it('must set the dataSource by ConfigIndex', function() {
      return linkurious.getSourceList().then(sources => {
        linkurious.setCurrentSource(sources[0]);
        expect(linkurious.state.currentSource.configIndex).to.eql(0);
      });
    });
  });

  describe('getAppStatus', () => {
    it('must return linkurious status', () => {
      return linkurious.getAppStatus().then((res: any) => {
        expect(res.message).to.eql('Linkurious ready to go :)');

        expect(res.name).to.eql('initialized');
      });
    });
  });

  describe('getNodesByQuery method', function() {
    it('must return the right nodes for the query', function() {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.graph.run({
            dialect: 'cypher',
            query: 'MATCH (n)\n WHERE ID(n)=' + nodeId + ' return n LIMIT 1'
          });
        })
        .then(function(res) {
          if (res.isSuccess()) {
            expect(res.response.nodes[0].data.properties.name).to.eql('Keanu Reeves');
          }
        });
    });
  });

  describe('searchUsers method', function() {
    it('must return a list of users', function() {
      return linkurious.search
        .getUsers({groupId: 4, limit: 4, offset: 0, startsWith: ''})
        .then(function(res: any) {
          expect(res.found).to.eql(0);
        });
    });
  });

  describe('getCustomFiles method', function() {
    it('must return an array of files', function() {
      return linkurious.getCustomFiles().then(function(res) {
        expect(res.results.length).to.be.greaterThan(0);
      });
    });
  });

  describe('getEdge method', () => {
    it('must return an edge', () => {
      return linkurious
        .initSources()
        .then(() => {
          return linkurious.edge.getOne({id: edgeID});
        })
        .then((res: any) => {
          expect(res.edges[0].data.type).to.eql('ACTED_IN');
        });
    });
  });

  describe('getNode method', function() {
    it('must return the right node', function() {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.node.getOne({
            id: nodeId
          });
        })
        .then(function(res: {nodes: IOgmaNode[]; edges: IOgmaEdge[]}) {
          node = res.nodes[0];
          expect(res.nodes[0].id).to.eql(nodeId);
          expect(res.nodes[0].data.properties).to.eql({name: 'Keanu Reeves', born: 1964});
          expect(res.edges.length).to.eql(0);
        });
    });
  });

  describe('expandNode method', function() {
    it('must return the right array of nodes and edges', function() {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.node.expand({
            ids: [nodeId],
            edgesTo: [nodeId]
          });
        })
        .then(function(res: {nodes: IOgmaNode[]; edges: IOgmaEdge[]}) {
          expect(res.nodes.length).to.be.greaterThan(0);
        });
    });
  });

  describe('updateNode method', function() {
    it('must return true', function() {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.node.update({
            id: nodeId,
            addedCategories: [],
            deletedCategories: [],
            deletedProperties: [],
            properties: {name: 'Keanu Reeves', born: 1964, test: 'test update'},
            readAt: node.data.readAt
          });
        })
        .catch(function(res) {
          expect(res).to.be.true;
        });
    });
  });

  describe('getSandbox method', function() {
    it('must return a visualization object', function() {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.visualization.getSandbox({
            doLayout: false
          });
        })
        .then(function(res: IVisualization) {
          expect(res.id).to.not.be.undefined;
          expect(res.title).to.not.be.undefined;
          expect(res.nodes.length).to.eql(0);
          expect(res.edges.length).to.eql(0);
          expect(res.layout).to.not.be.undefined;
        });
    });
  });

  describe('updateSandBox method', () => {
    it('must update the sandbox', () => {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.visualization.updateSandbox({
            nodeFields: {
              captions: {
                COMPANY: {
                  displayName: false,
                  active: true,
                  properties: ['name']
                }
              },
              types: {}
            }
          });
        })
        .then((res: any) => {
          expect(res).to.eql('');
        });
    });
  });

  let userId: number;

  describe('createUser method', function() {
    it('must create a new user', function() {
      return linkurious.admin
        .getGroups({withAccessRights: false}, sourceKey)
        .then(success => {
          if (success.isSuccess()) {
            return linkurious.admin.createUser({
              username: 'testName',
              email: 'testName@test.fr',
              groups: success.response.filter(g => g.name === 'admin').map(g => g.id),
              password: 'testPass'
            });
          }
          return Promise.reject(success);
        })
        .then(function(res: IFullUser) {
          userId = res.id;
          expect(res.username).to.eql('testName');
        });
    });
  });

  describe('updateConfig method', function() {
    it('must change app config', function() {
      return linkurious.admin
        .updateConfig({
          path: 'access.authRequired',
          configuration: true
        })
        .then(function() {
          return linkurious.getAppConfig();
        })
        .then(function(res: any) {
          expect(res.access.authRequired).to.be.true;
        });
    });
  });

  describe('login method', function() {
    it('must log a user and hydrate app state', function() {
      return linkurious
        .login({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function(res) {
          expect(linkurious.state.user.id).to.eql(userId);
          expect(res.username).to.equal('testName');
        });
    });

    it('must logout before login if another user is currently authenticated', function() {
      return linkurious.login({usernameOrEmail: 'testName', password: 'testPass'}).then(function() {
        return linkurious
          .login({usernameOrEmail: 'testName', password: 'testPass'})
          .then(function(res) {
            expect(linkurious.state.user.id).to.eql(userId);
            expect(res.username).to.equal('testName');
          });
      });
    });
  });

  describe('logout method', function() {
    it('must disconnect user and reset client state', function() {
      return linkurious
        .login({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.logout();
        })
        .then(function(res) {
          expect(res).to.eql('user disconnected');
          expect(linkurious.state.user).to.be.undefined;
        });
    });
  });

  describe('init method', function() {
    it('must set current user and default source', function() {
      return linkurious.init({usernameOrEmail: 'testName', password: 'testPass'}).then(function() {
        expect(linkurious.state.user.id).to.eql(userId);
        expect(linkurious.state.currentSource.configIndex).to.eql(0);
      });
    });
  });

  describe('updateCurrentUser', function() {
    it('must update current user and reflect it in state', function() {
      return linkurious
        .login({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.updateCurrentUser({
            id: userId,
            username: 'nameChanged'
          });
        })
        .then(function() {
          expect(linkurious.state.user.username).to.eql('nameChanged');
          expect(linkurious.state.user.id).to.eql(userId);
          expect(linkurious.state.user.email).to.eql('testName@test.fr');
        });
    });
  });

  let vizId: number;

  describe('createWidget method', () => {
    it('must create a widget', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(() => {
          return linkurious.visualization.getSandbox();
        })
        .then((response: any) => {
          response.title = 'test';
          return linkurious.visualization.create(response);
        })
        .then(res => {
          vizId = res.id;
        })
        .then(() => {
          return linkurious.visualization.createWidget({
            visualizationId: vizId
          });
        })
        .then((res: any) => {
          widget = res;
          expect(typeof res).to.eql('string');
        });
    });
  });

  describe('get widget method', () => {
    it('must return a widget', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(() => {
          return linkurious.visualization.getWidget({id: widget});
        })
        .then((res: any) => {
          expect(res.key).to.eql(widget);
          expect(res.userId).to.eql(userId);
        });
    });
  });

  describe('deleteWidget method', () => {
    it('must delete a widget', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(() => {
          return linkurious.visualization.deleteWidget({id: widget});
        })
        .then((res: any) => {
          expect(res).to.eql('');
        });
    });
  });

  describe('create visu method', () => {
    it('must return a visualization', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(() => {
          return linkurious.visualization.create({
            title: 'newVizuTest',
            nodes: [
              {
                id: nodeId,
                nodelink: {
                  x: 50,
                  y: 50
                }
              }
            ],
            edges: [
              {
                id: edgeID
              }
            ],
            nodeFields: {
              captions: {},
              types: {}
            },
            edgeFields: {
              captions: {},
              types: {}
            }
          });
        })
        .then((res: any) => {
          visu = res;
          expect(res.title).to.eql('newVizuTest');
        });
    });
  });

  let visuToDelete: number;

  describe('duplicate visu method', () => {
    it('must return the created visu', () => {
      linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.duplicate({id: visu.id, title: 'Copy of newVizuTest'});
        })
        .then(res => {
          visuToDelete = res.visualizationId;
        });
    });
  });

  describe('delete a visu method', () => {
    it('must delete a visu', () => {
      linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.deleteOne({id: visuToDelete});
        })
        .then((res: any) => {
          expect(res).toBe('');
        });
    }).timeout(5000);
  });

  describe('get share rights of a visu method', () => {
    it('must return sharers', () => {
      linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.getShares({id: visu.id});
        })
        .then((res: any) => {
          expect(res.shares.length).toEqual(0);
          expect(res.owner.id).toEqual(116);
        });
    }).timeout(5000);
  });

  describe('get a visu method', () => {
    it('must return a visu', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.getOne({id: visu.id, populated: true});
        })
        .then((res: any) => {
          expect(res.title).to.eql('newVizuTest');
        });
    });
  });

  describe('shareVisualization method', function() {
    it('must share a visualization', function() {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.share({
            userId: userId,
            right: 'read',
            vizId: vizId
          });
        })
        .then(function(res: IShare) {
          expect(res.visualizationId).to.eql(vizId);
          expect(res.userId).to.eql(userId);
        });
    });
  });

  describe('getNonIndexedEdgeProperties method', () => {
    it('must return an array of edge Properties', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(function() {
          return linkurious.admin.getNonIndexedEdgeProperties();
        })
        .then(function(res: any) {
          expect(res.length).to.eql(2);
          expect(res[1]).to.equal('edgeNoIndexProp');
        });
    });
  });

  describe('getNonIndexedNodeProperties method', () => {
    it('must return an array of node Properties', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(function() {
          return linkurious.admin.getNonIndexedNodeProperties();
        })
        .then(function(res: any) {
          expect(res.length).to.eql(2);
          expect(res[1]).to.equal('nodeNoIndexProp');
        });
    });
  });

  describe('setNonIndexedEdgeProperties method', () => {
    it('must return true', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(() => {
          return linkurious.admin.setNotIndexedEdgeProperties({
            properties: ['testNonIndexedEdgeProp']
          });
        })
        .then(function(res) {
          expect(res).to.not.be.undefined;
        });
    });
  });

  describe('setNonIndexedNodeProperties method', () => {
    it('must return true', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(() => {
          return linkurious.admin.setNotIndexedNodeProperties(
            {properties: ['testNonIndexedNodeProp']},
            sourceKey
          );
        })
        .then(function(res) {
          expect(res).to.not.be.undefined;
        });
    });
  });

  describe('createDataSourceConfig method', () => {
    it('must return true', () => {
      return linkurious
        .init({usernameOrEmail: 'nameChanged', password: 'testPass'})
        .then(function() {
          return linkurious.admin.createDataSourceConfig({
            graphDb: {
              vendor: 'neo4j',
              url: 'http://127.0.0.2',
              user: 'test',
              password: 'test'
            },
            index: {
              vendor: 'elasticSearch',
              host: '127.0.0.3',
              port: 7878,
              forceReindex: false,
              dynamicMapping: false
            },
            name: 'test config'
          });
        })
        .then(function(res) {
          expect(res).to.not.be.undefined;
          setTimeout(() => {}, 5000);
        });
    });
  });

  describe('connectDataSource method', () => {
    it('must return true', () => {
      return linkurious
        .initSources()
        .then(() => {
          return linkurious.admin.connectDataSource(0);
        })
        .then(function(res) {
          expect(res).to.equal('');
        });
    });
  });

  describe('deleteUser method', () => {
    it('must delete a user', () => {
      return linkurious.admin
        .getGroups({withAccessRights: false}, sourceKey)
        .then(success => {
          if (success.isSuccess()) {
            return linkurious.admin.createUser({
              username: 'testdelete',
              email: 'testDelete@test.fr',
              groups: success.response.filter(g => g.name === 'admin').map(g => g.id),
              password: 'testPass'
            });
          }
          return Promise.reject(success);
        })
        .then((res: any) => {
          return linkurious.admin.deleteUser(res.id);
        })
        .then((res: any) => {
          expect(res).to.not.be.undefined;
        });
    });
  });

  let groupId: number;

  describe('createGroup method', () => {
    it('must return a group', () => {
      return linkurious.admin
        .createGroup(
          {
            name: 'testGroup'
          },
          sourceKey
        )
        .then(success => {
          if (success.isSuccess()) {
            groupId = success.response.id;
            expect(success.response.name).to.eql('testGroup');
          }
        });
    });
  });

  describe('deleteGroup method', () => {
    it('must return true', () => {
      return linkurious.admin.deleteGroup({id: groupId}, sourceKey).then(success => {
        if (success.isSuccess()) {
          expect(success.response).to.eql('');
        }
      });
    });
  });

  describe('getGroup method', () => {
    it('must return a group', () => {
      return linkurious.admin
        .getGroups({withAccessRights: false}, sourceKey)
        .then(success => {
          if (success.isSuccess()) {
            const adminId: number = success.response
              .filter(g => g.name === 'admin')
              .map(g => g.id)[0];
            return linkurious.admin.getGroup({id: adminId}, sourceKey);
          }
          return Promise.reject(success);
        })
        .then(success => {
          if (success.isSuccess()) {
            expect(success.response.name).to.eql('admin');
          }
        });
    });
  });

  describe('getGroups method', () => {
    it('must return a group list', () => {
      return linkurious.admin.getGroups(undefined, sourceKey).then(success => {
        if (success.isSuccess()) {
          expect(Array.isArray(success.response)).to.be.true;
        }
      });
    });
  });

  describe('getGroupsRights method', () => {
    it('must return groups rights', () => {
      return linkurious.admin.getGroupsRights().then(success => {
        if (success.isSuccess()) {
          expect(success.response.types.length).to.eql(5);
          expect(success.response.targetTypes.length).to.eql(4);
        }
      });
    });
  });

  describe('getDataSourcesList method', () => {
    it('must resturn a list of all dataSource', () => {
      return linkurious.admin.getDataSourcesList().then((res: any) => {
        expect(res.length).to.eql(2);
        expect(res[0].state).to.eql('needReindex');
        expect(res[1].state).to.eql('connecting');
      });
    });
  });

  describe('updateUser method', () => {
    it('must return user', () => {
      return linkurious.admin
        .updateUser({
          id: userId,
          username: 'testName'
        })
        .then((res: any) => {
          expect(res.username).to.eql('testName');
          expect(res.email).to.eql('testName@test.fr');
        });
    });
  });

  describe('countEdge method', () => {
    it('must return the number of edges', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.edge.count();
        })
        .then((res: any) => {
          expect(res).to.eql(20);
        });
    });
  });

  let edgeToDelete: number | string;

  describe('create Edge method', () => {
    it('must create an edge', () => {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.search.simple({
            type: 'nodes',
            q: 'Carrie-Anne Moss'
          });
        })
        .then((res: any) => {
          sourceId = res.results[0].id;
          return linkurious.search.simple({
            type: 'nodes',
            q: 'Keanu Reeves'
          });
        })
        .then((res: any) => {
          targetId = res.results[0].id;
          return linkurious.edge.create({
            source: sourceId,
            target: targetId,
            type: 'PLAYS_WITH',
            properties: {}
          });
        })
        .then((res: any) => {
          edgeToDelete = res.id;
          expect(res.data.type).to.eql('PLAYS_WITH');
        });
    });
  });

  describe('update edge method', () => {
    it('must return an edge updated', () => {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.edge.update({
            id: edgeID,
            deletedProperties: [],
            properties: {tralala: 'test'},
            readAt: '2018-04-16T09:57:31.949Z'
          });
        })
        .then((res: any) => {
          expect(res.data.properties.tralala).to.eql('test');
        });
    });
  });

  describe('delete edge method', () => {
    it('must return true', () => {
      return linkurious
        .initSources()
        .then(function() {
          return linkurious.edge.deleteOne({id: edgeToDelete});
        })
        .then((res: any) => {
          expect(res).to.eql('');
        });
    });
  });

  describe('isAuth method', () => {
    it('must return true if user is auth', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(() => {
          return linkurious.my.IsAuth();
        })
        .then((res: any) => {
          expect(res).to.eql('');
        });
    });
  });

  describe('getAllGraphQuery method', () => {
    it('must return an array of graphQuery', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(() => {
          return linkurious.graph.getAllGraphQueries({type: 'static'});
        })
        .then(res => {
          if (res.isSuccess()) {
            expect(res.response.length).to.eql(1);
          }
        });
    });
  });

  describe('saveGraphQuery method', () => {
    it('must save a graphQuery', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(() => {
          return linkurious.graph.saveGraphQuery({
            name: 'mygraphQuery',
            description: 'trololo',
            sharing: 'source',
            dialect: 'cypher',
            content: 'MATCH(Person {name: \'Keanu Reeves\'})\nRETURN(Person)'
          });
        })
        .then(res => {
          if (res.isSuccess()) {
            graphQueryId = res.response.id;
            expect(res.response.id).to.eql(6);
          }
        });
    });
  });

  describe('update GraphQuery', () => {
    it('must update the graphQuery', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(() => {
          return linkurious.graph.updateGraphQuery({
            content: 'MATCH(Person {name: \'Carrie Anne Moss\'})\nRETURN(Person)',
            id: graphQueryId
          });
        })
        .then(() => {
          return linkurious.graph.getGraphQuery({id: graphQueryId});
        })
        .then(res => {
          if (res.isSuccess()) {
            expect(res.response.content).to.eql(
              'MATCH(Person {name: \'Carrie Anne Moss\'})\nRETURN(Person)'
            );
          }
        });
    });
  });

  describe('get a graphQuery method', () => {
    it('must return the right graphQuery', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(() => {
          return linkurious.graph.getGraphQuery({id: graphQueryId});
        })
        .then(res => {
          if (res.isSuccess()) {
            expect(res.response.id).to.eql(6);
          }
        });
    });
  });

  describe('countNode method', () => {
    it('must return thos number of nodes', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.node.count();
        })
        .then((res: any) => {
          expect(res).to.eql(14);
        });
    });
  });

  describe('createNode method', () => {
    it('must create a node', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.node.create({
            properties: {
              name: 'Robert Mitchum'
            },
            categories: ['actor']
          });
        })
        .then((res: any) => {
          nodeToDelete = res.id;
          expect(res.data.properties.name).to.eql('Robert Mitchum');
        });
    });
  });

  describe('deleteNode method', () => {
    it('must delete a node', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.node.deleteOne({id: nodeToDelete});
        })
        .then((res: any) => {
          expect(res).to.eql('');
        })
        .catch(e => console.log(e));
    });
  });

  describe('getNeighborsCategories method', () => {
    it('must return an array of digest', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.node.getNeighborsCategories({ids: [nodeId]});
        })
        .then((res: any) => {
          expect(res).to.eql({});
        });
    });
  });

  describe('searchFullNodes method', () => {
    it('must return an array of nodes', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.search.advanced({type: 'nodes', q: 'matrix'});
        })
        .then((res: any) => {
          expect(res.results.length).to.eql(3);
        });
    });
  });

  describe('searchFullEdges method', () => {
    it('must return a array of edges', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.search.advanced({type: 'edges', q: 'ACTED_IN'});
        })
        .then((res: any) => {
          expect(res.results.length).to.eql(7);
        });
    });
  });

  describe('count visualization method', () => {
    it('must return the number of visualization', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.count();
        })
        .then((res: any) => {
          expect(res).to.eql(13);
        });
    });
  });

  describe('getTree method', () => {
    it('must return visualizations', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.getTree();
        })
        .then((res: any) => {
          expect(res[1].id).to.eql(15);
          expect(res[1].type).to.eql('visu');
          visu = res[1];
        });
    });
  });

  let folderId: number;

  describe('createFolder method', () => {
    it('must create a folder', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.createFolder({parent: 0, title: 'testFolder'});
        })
        .then((res: any) => {
          expect(res.title).to.eql('testFolder');
          folderId = res.id;
        });
    });
  });

  describe('updateFolder method', () => {
    it('must update te folder', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.updateFolder({
            id: folderId,
            key: 'title',
            value: 'newFolderName'
          });
        })
        .then((res: any) => {
          expect(res).to.not.be.undefined;
        });
    });
  });

  describe('delete folder method', () => {
    it('must delete a folder', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.deleteFolder({id: folderId});
        })
        .then((res: any) => {
          expect(res).to.eql('');
        });
    });
  });

  describe('duplicate visu method', () => {
    it('must return the created visu', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.duplicate({id: visu.id, title: 'Copy of newVizuTest'});
        })
        .then(res => {
          expect(res.visualizationId).to.not.be.undefined;
          visuToDelete = res.visualizationId;
        });
    });
  });

  describe('delete a visu method', () => {
    it('must delete a visu', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.deleteOne({id: visuToDelete});
        })
        .then((res: any) => {
          expect(res).to.equal('');
        });
    });
  });

  describe('get share rights of a visu method', () => {
    it('must return sharers', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.getShares({id: visu.id});
        })
        .then((res: any) => {
          expect(res.shares.length).to.eql(0);
          expect(res.owner.id).to.eql(118);
        });
    });
  });

  describe('updateVisu method', () => {
    it('must update the visu', () => {
      return linkurious
        .init({usernameOrEmail: 'testName', password: 'testPass'})
        .then(function() {
          return linkurious.visualization.update({
            id: visu.id,
            forceLock: false,
            title: 'youpla visu'
          });
        })
        .then((res: any) => {
          expect(res).to.equal('');
        });
    });
  });
});
