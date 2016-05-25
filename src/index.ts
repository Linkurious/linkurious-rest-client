/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-25.
 *
 * File:
 * Description :
 */

/// <reference path="./../node_modules/typescript/lib/lib.es6.d.ts" />
/// <reference path="./../typings/main/ambient/node/index.d.ts" />

import HTTPDriver from './HTTPDriver';
import LogDriver from './logDriver';
import {Utils} from './utils';
import {LoggerPlugin, LogDriverInterface} from './logDriver.interfaces';
import {HTTPDriverInterface} from './HTTPDriver.interfaces';
import {
  ILinkurious,
  User,
  Group,
  Source,
  Edge,
  Query,
  Schema,
  Graph,
  Node,
  App,
  Count,
  Item,
  Directory,
  Visualization,
  IState,
  ItemId
} from './interfaces';

class Linkurious implements ILinkurious {

  public host:string;
  public state:IState;
  public log:LogDriverInterface;
  public httpDriver:HTTPDriverInterface;

  /**
   *
   * @param {string} host           - Host URL of the linkurious server
   * @param {string} log            - Level of log wanted
   * @param {object} [logger]       - logger object
   */
  constructor(host:string, log:string, logger?:LoggerPlugin) {
    this.host       = host;
    this.state      = <IState>{};
    this.log        = <LogDriverInterface>new LogDriver(log, logger);
    this.httpDriver = <HTTPDriverInterface>new HTTPDriver();
  }

  /**
   *
   * @param source:Source.model
   * @param property:string
   * @param matchValue:any
   * @returns {Source.clientModel}
   */
  private storeSource(source:Source.model, property:string, matchValue:string|number|boolean):Source.clientModel {
    if (source[property] === matchValue) {
      this.state.currentSource = {
        name       : source.name,
        key        : source.key,
        configIndex: source.configIndex
      };
      return this.state.currentSource;
    } else {
      return null;
    }
  }

  /**
   * construct the API URL with sourceId if needed and throw error if doesn't exists.
   *
   * @param uri:string     - the url fragment to format the API url
   * @returns {string}      - return the API url formatted
   */
  private transformUrl(uri:string):string {

    const dataSourceTest = /\{dataSource}/;

    if (dataSourceTest.test(uri)) {
      if (this.state.currentSource && this.state.currentSource.key) {
        return this.host + '/api' + uri.replace(dataSourceTest, this.state.currentSource.key);
      } else {
        this.log.error({
          key    : 'Configuration error',
          message: 'You need to set a current source to fetch this API.'
        });
        throw new Error('You need to set a current source to fetch this API.');
      }
    } else {
      return this.host + '/api' + uri;
    }
  }

  /**
   * HTTPDriver wrapper method
   *
   * @param method{string}    - the method for the HTTP request to send
   * @param uri{string}       - the url fragment to format
   * @param data{object}     -
   * @returns {Promise}
   */
  private fetch(method:string, uri:string, data?:any):Promise<any> {

    let url = this.transformUrl(uri),
        fetch = this.httpDriver[method](url, data);

    return fetch
      .then((res) => res)
      .catch((err) => {
        this.log.error({
          key    : err.status + ' - ' + err.type,
          message: err.message
        });

        return Promise.reject(err);
      });
  }

  // ----------------------------------------------------- //
  //                                                       //
  //                 LINKURIOUS METHODS                    //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Get the status of the all data-sources.
   *
   * @returns {Promise<Source.list>}
   */
  public getSources():Promise<Source.list> {
    return this.fetch('GET', '/dataSources');
  }

  /**
   * Set the currentSource to the first source connected
   *
   * @returns {Promise<Source.clientModel>}
   */
  public initCurrentSource():Promise<Source.clientModel> {
    return this.getSources()
      .then((res) => {
        for (let i = 0, l = res.sources.length; i < l; ++i) {
          let sourceIteration = res.sources[i];

          if (this.storeSource(sourceIteration, 'connected', true)) {
            return this.state.currentSource;
          }
        }
      });
  }

  /**
   * Set the currentSource by passing the sourceKey or configIndex
   *
   * @param keyOrConfig : string|number
   * @returns {Promise<Source.clientModel>}
   */
  public setCurrentSource(keyOrConfig:string | number):Promise<Source.clientModel> {
    return this.getSources()
      .then((res) => {
        for (let i = 0, l = res.sources.length; i < l; ++i) {
          let sourceIteration = res.sources[i],
              sourceComparator;

          if (typeof keyOrConfig === 'string') {
            sourceComparator = 'key';
          } else {
            sourceComparator = 'configIndex';
          }

          if (this.storeSource(sourceIteration, sourceComparator, keyOrConfig)) {
            return this.state.currentSource;
          }
        }
      });
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                     AUTH METHODS                      //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Process to login of the corresponding user and return it.
   *
   * @param userLogin : string
   * @param password : string
   * @returns {Promise<boolean>}
   */
  public login(userLogin:string, password:string):Promise<boolean> {

    let data = {
      usernameOrEmail: userLogin,
      password       : password
    };

    if(this.state.user && this.state.user !== null){
      return this.logout().then(() => {
        return this.fetch('POST', '/auth/login', data);
      }).then(res => {
        this.state.user = res.user;
        return true;
      });
    } else {
      return this.fetch('POST', '/auth/login', data).then(res => {
        this.state.user = res.user;
        return true;
      });
    }
  }

  /**
   * Check if the user is authenticated.
   *
   * @returns {Promise<boolean>}
   */
  public userIsAuth():Promise<boolean> {
    return this.fetch('GET', '/auth/authenticated')
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Check if the user is authenticated as an admin.
   *
   * @returns {Promise<boolean>}
   */
  public userIsAdmin():Promise<boolean> {
    return this.fetch('GET', '/auth/admin')
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Clear the user session.
   *
   * @returns {Promise<string>}
   */
  public logout():Promise<string> {
    return this.fetch('GET', '/auth/logout')
      .then(() => {
        this.state.user = <User.model>null;
        return 'user disconnected';
      });
  }

  /**
   * Update the current user connected
   *
   * @param data {user.form.update}
   * @returns {Promise}
   */
  public updateCurrentUser(data:User.form.update):Promise<any> {
    return this.fetch('PATCH', '/auth/me', data)
      .then((res) => {
        this.state.user = Object.assign(this.state.user, res);
        return res;
      })
      .catch((err) => Promise.reject(err));
  }

  /**
   * Process to login and set the default source state and return the REST client state.
   *
   * @param userLogin:string
   * @param password:string
   * @returns {Promise<IState>}
   */
  public startClient(userLogin:string, password:string):Promise<IState> {
    return this.login(userLogin, password).then(() => this.initCurrentSource())
      .then(() => this.state);
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                    EDGES METHODS                      //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * return the number of edges in the graph.
   *
   * @returns {Promise}
   */
  public countEdges():Promise<any> {
    return this.fetch('GET', '/{dataSource}/graph/edges/count');
  }

  /**
   * Add an edge in the graph.
   *
   * @param data : object
   * @returns {Promise<Edge>}
   */
  public createEdge(data:Edge.form.create):Promise<Edge.model> {
    return this.fetch('POST', '/{dataSource}/graph/edges', data);
  }

  /**
   * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
   * the edge unchanged.
   *
   * @param edgeId : ItemId
   * @param data : Edge.form.update
   * @returns {Promise<Edge>}
   */
  public updateEdge(edgeId:ItemId, data:Edge.form.update):Promise<Edge.model> {
    return this.fetch('PATCH', '/{dataSource}/graph/edges/' + edgeId, data);
  }

  /**
   * Delete a edge from the graph.
   *
   * @param edgeId : ItemId
   * @returns {Promise<string>}
   */
  public deleteEdge(edgeId:ItemId):Promise<string> {
    return this.fetch('DELETE', '/{dataSource}/graph/edges/' + edgeId)
      .then(() => 'edge ' + edgeId + ' deleted');
  }

  /**
   * Get the adjacent edges of a node from the graph.
   * If source is provided, return outgoing edges only.
   * Else if target is provided, return incoming edges only.
   * Else if adjacent is provided, return all adjacent edges.
   *
   * @param data : object
   * @returns {Promise<Array<Edge.model>>}
   */
  public getAdjacentEdges(data:Edge.request.getAdjacent):Promise<Array<Edge.model>> {
    let query;

    if (data.orientation === 'in') {
      data['source'] = data.nodeId;
    } else if (data.orientation === 'out') {
      data['target'] = data.nodeId;
    } else if (data.orientation === 'both') {
      data['adjacent'] = data.nodeId;
    }

    delete data.nodeId;
    delete data.orientation;

    query = Utils.sanitizeQuery(data);

    return this.fetch('GET', '/{dataSource}/graph/edges', query);
  }

  /**
   * Get an edge of the graph.
   *
   * @param edgeId : ItemId
   * @returns {Promise<Edge.model>}
   */
  public getEdge(edgeId:ItemId):Promise<Edge.model> {
    return this.fetch('GET', '/{dataSource}/graph/edges/' + edgeId);
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                    GRAPH METHODS                      //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Delete a saved Graph Query owned by the current user
   *
   * @param graphQueryId : number
   * @returns {Promise<string>}
   */
  public deleteGraphQuery(graphQueryId:number):Promise<string> {
    return this.fetch('DELETE', '/{dataSource}/graph/my/rawQuery/' + graphQueryId)
      .then(() => 'graph query ' + graphQueryId + ' deleted');
  }

  /**
   * Returns a saved Graph Query owned by the current user
   *
   * @param graphQueryId : number
   * @returns {Promise<Query.model>}
   */
  public getGraphQuery(graphQueryId:number):Promise<Query.model> {
    return this.fetch('GET', '/{dataSource}/graph/my/rawQuery/' + graphQueryId);
  }

  /**
   * Get the edit-versions for nodes and edges.
   *
   * @param nodesAndEdgesVersions : Schema.lists
   * @returns {Promise}
   */
  public getVersions(nodesAndEdgesVersions:Schema.lists):Promise<any> {
    return this.fetch('POST', '/{dataSource}/graph/versions', nodesAndEdgesVersions);
  }

  /**
   * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
   *
   * @param nodesConfig : Graph.request.shortestPath
   * @returns {Promise}
   */
  public getShortestPaths(nodesConfig:Graph.request.shortestPath):Promise<Array<Node.model>> {
    return this.fetch('GET', '/{dataSource}/graph/shortestPaths', Utils.sanitizeQuery(nodesConfig));
  }

  /**
   * Returns all saved Graph Queries owned by the current user
   *
   * @returns {Promise<Array<Query.model>>}
   */
  public getAllGraphQueries():Promise<Array<Query.model>> {
    return this.fetch('GET', '/{dataSource}/graph/my/rawQuery/all');
  }

  /**
   * Save and Returns the created GraphQuery
   * @param data : Query.form.create
   * @returns {Promise<Query.model>}
   */
  public saveGraphQuery(data:Query.form.create):Promise<Query.model> {
    return this.fetch('POST', '/{dataSource}/graph/my/rawQuery', data);
  }

  /**
   * Returns an array of LkNode[] matching the sent query.
   *
   * @param data:RequestGraphWithQueryInterface
   * @returns {Promise}
   */
  public getNodesByQuery(data:Query.form.request):Promise<Array<Node.model>> {
    return this.fetch('POST', '/{dataSource}/graph/rawQuery', Utils.sanitizeQuery(data));
  }

  /**
   * Update a graph query owned but the current user
   * @param graphQueryId : number
   * @param data : Query.form.update
   * @returns {Promise<Query.model>}
   */
  public updateGraphQuery(graphQueryId:number, data:Query.form.update):Promise<Query.model> {
    return this.fetch('PATCH', '/{dataSource}/graph/my/rawQuery' + graphQueryId, data);
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                 LINKURIOUS METHODS                    //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Find a list of users matching a filter (on username or email)
   *
   * @param data : User.request.list
   * @returns {Promise<Array<User.model>>}
   */
  public searchUsers(data:User.request.list):Promise<Array<User.model>> {
    return this.fetch('GET', '/findUsers', Utils.sanitizeQuery(data));
  }

  /**
   * Get the status of the Linkurious API.
   *
   * @returns {Promise<App.status>}
   */
  public getAppStatus():Promise<App.status> {
    return this.fetch('GET', '/status');
  }

  /**
   * Get Linkurious' current version information
   *
   * @returns {Promise<App.version>}
   */
  public getAppVersion():Promise<App.version> {
    return this.fetch('GET', '/version');
  }

  /**
   * Return the configuration of the application.
   *
   * @param sourceIndex:number
   * @returns {Promise<App.config>}
   */
  public getAppConfig(sourceIndex?:number):Promise<App.config> {
    return this.fetch('GET', '/config', sourceIndex);
  }

  /**
   * Sets the configuration of the application
   *
   * @param data:Interface.Form.config.update
   * @returns {Promise<string>}
   */
  public updateConfig(data:App.form.update):Promise<string> {
    return this.fetch('POST', '/config', data);
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                    NODES METHODS                      //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Number of nodes in the graph.
   *
   * @returns {Promise<Interface.count>}
   */
  public countNodes():Promise<Count> {
    return this.fetch('GET', '/{dataSource}/graph/nodes/count');
  }

  /**
   * Add a node in the graph.
   *
   * @param data:Interface.Form.node.create
   * @returns {Promise<Node.model>}
   */
  public createNode(data:Node.form.create):Promise<Node.model> {
    return this.fetch('POST', '/{dataSource}/graph/nodes', data);
  }

  /**
   * Delete the node and its adjacent edges from the graph.
   *
   * @param nodeId:ItemId
   * @returns {Promise<string>}
   */
  public deleteNode(nodeId:ItemId):Promise<string> {
    return this.fetch('DELETE', '/{dataSource}/graph/nodes/' + nodeId)
      .then(() => 'node ' + nodeId + ' deleted');
  }

  /**
   * Get a node from the graph.
   *
   * @param nodeId:ItemId
   * @param params:Interface.RequestNode
   * @returns {Promise<Node.model>}
   */
  public getNode(nodeId:ItemId, params?:Node.request.one):Promise<Node.model> {
    return this.fetch('GET', '/{dataSource}/graph/nodes/' + nodeId, Utils.sanitizeQuery(params));
  }

  /**
   * Get all adjacent nodes and edges for one or many source nodes (ids). The result is an array of
   * nodes containing the sources nodes (ids) and their neighbors. Edges between sources nodes and
   * neighbors - as well as edges between neighbors themselves - are returned in each node's edges
   * field. If visible_nodes was specified, edges between source nodes or their neighbors and
   * visible nodes are also included.
   *
   * @param data:Interface.RequestNodeAdjacentItems
   * @returns {Promise<Array<Node.model>>}
   */
  public expandNode(data:Node.request.adjacentItems):Promise<Array<Node.model>> {
    return this.fetch('POST', '/{dataSource}/graph/nodes/expand', Utils.sanitizeQuery(data));
  }

  /**
   * Get node-categories and edge-types of neighbors
   *
   * @param data:Interface.RequestNodeNeighbors
   * @returns {Promise<Array<Schema.digest>>}
   */
  public getNodeNeighborsCategories(data:Node.request.neighborsCategories):Promise<Array<Schema.digest>> {
    return this.fetch('POST', '/{dataSource}/graph/neighborhood/digest', data);
  }

  /**
   * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
   *
   * @param nodeId:ItemId
   * @param data:Interface.Form.node.update
   * @returns {Promise<Node>}
   */
  public updateNode(nodeId:ItemId, data:Node.form.update):Promise<Node.model> {
    return this.fetch('PATCH', '/{dataSource}/graph/nodes/' + nodeId, Utils.sanitizeQuery(data));
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                    SCHEMA METHODS                     //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
   *
   * @returns {Promise<Schema.model>}
   */
  public getSchema():Promise<Schema.model> {
    return this.fetch('GET', '/{dataSource}/graph/schema/simple');
  }

  /**
   * List all edgeType properties (aggregated from all edgeTypes)
   *
   * @param params:Interface.RequestProperties
   * @returns {Promise<Schema.propertyList>}
   */
  public getEdgeProperties(params?:Schema.request.properties):Promise<Schema.propertyList> {
    return this.fetch('GET', '/{dataSource}/graph/schema/edgeTypes/properties', Utils.sanitizeQuery(params));
  }

  /**
   * List all node-type properties (aggregated from all nodeTypes)
   *
   * @param params:Interface.RequestProperties
   * @returns {Promise<Schema.propertyList>}
   */
  public getNodeProperties(params?:Schema.request.properties):Promise<Schema.propertyList> {
    return this.fetch('GET', '/{dataSource}/graph/schema/nodeTypes/properties', Utils.sanitizeQuery(params));
  }

  /**
   * List edge-types indexed by linkurious
   *
   * @param params:Interface.RequestEdgeType
   * @returns {Promise<Schema.typesList>}
   */
  public getEdgeTypes(params?:Edge.request.types):Promise<Schema.typesList> {
    return this.fetch('GET', '/{dataSource}/graph/schema/edgeTypes', Utils.sanitizeQuery(params));
  }

  /**
   * List node-types indexed by Linkurious
   *
   * @param params:Interface.RequestNodeType
   * @returns {Promise<Schema.typesList>}
   */
  public getNodeTypes(params?:Node.request.types):Promise<Schema.typesList> {
    return this.fetch('GET', '/{dataSource}/graph/schema/nodeTypes', Utils.sanitizeQuery(params));
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                    SEARCH METHODS                     //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @returns {Promise<Source.indexationStatus>}
   */
  public getIndexationStatus():Promise<Source.indexationStatus> {
    return this.fetch('GET', '/{dataSource}/search/status')
      .then((res) => {
        if (res.indexed_source !== this.state.currentSource.key) {
          this.log.error({
            key    : 'Indexation error',
            message: 'Server is indexing another source.'
          });

          return Promise.reject(res);
        }

        return res;
      })
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @returns {Promise<boolean>}
   */
  public launchIndexation():Promise<boolean> {
    return this.fetch('GET', '/{dataSource}/search/reindex')
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Launch the indexation and return true when finish. Possibility to had callback called each 300ms during indexation.
   *
   * @param callback:Function
   * @returns {Promise<boolean>}
   */
  public processIndexation(callback?:Function):Promise<boolean> {
    return this.launchIndexation()
      .then(() => this.listenIndexation(callback))
      .then(() => true);
  }

  /**
   * return true when indexation if finished, else launch callback.
   *
   * @param callback:Function
   * @returns {Promise<boolean>}
   */
  private listenIndexation(callback?:Function):Promise<boolean> {
    return this.getIndexationStatus()
      .then((res) => {
        if (res.indexing !== 'done') {
          setTimeout(() => {
            if (callback) {
              callback(res);
            }
            this.listenIndexation(callback);
          }, 300);
        } else {
          return true;
        }
      });
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return formatted results for the Linkurious client or full node object.
   *
   * @param item:Interface.Item
   * @param params:Interface.RequestSearchItems
   * @param isFormatted:boolean true => return raw results.
   * @returns {Promise<Schema.itemsList|Array<Node.model>>}
   */
  public searchNodes(item:Item, params:Schema.request.itemsList, isFormatted:boolean):Promise<Schema.itemsList|Array<Node.model>> {
    if (!isFormatted) {
      return this.fetch('GET', '/{dataSource}/search/' + item, params);
    } else {
      return this.fetch('GET', '/{dataSource}/search/' + item + '/full', Utils.sanitizeQuery(params));
    }

  }

  /**
   * get a list of items for directory.
   *
   * @param data:Interface.RequestDirectory
   * @returns {Promise<Directory.list>}
   */
  public getDirectoryList(data:Directory.request.list):Promise<Directory.list> {
    return this.fetch('POST', '/{dataSource}/directory', data);
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                  SOURCE-ADMIN METHODS                 //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Connect a disconnected data-source
   *
   * @param sourceIndex:number
   * @returns {Promise<boolean>}
   */
  public connectDataSource(sourceIndex:number):Promise<boolean> {
    return this.fetch('POST', '/admin/source/' + sourceIndex + '/connect')
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Create a new data-source configuration (contains a graph database configuration and an index configuration).
   *
   * @param data:Interface.Form.dataSource.create
   * @returns {Promise<boolean>}
   */
  public createDataSource(data:Source.form.create):Promise<boolean> {
    return this.fetch('POST', '/admin/sources/config', data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Delete a data-source configuration that has currently no connected data-source.
   *
   * @param sourceIndex:number
   * @returns {Promise<boolean>}
   */
  public deleteDataSource(sourceIndex:number):Promise<boolean> {
    return this.fetch('DELETE', '/admin/sources/config/' + sourceIndex)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Delete all data of data-source (visualizations, access-rights, widgets, full-text indexes).
   * Optionally merge visualizations and widgets into another data-source instead of deleting them.
   * Warning: when merging into another data-source, visualizations may break if node and edge IDs
   * are not the same in to target data-source.
   *
   * @param data:Interface.RequestDeleteDatas
   * @returns {Promise<Source.deletedDatas>}
   */
  public deleteDatas(data:Source.form.Delete):Promise<Source.deletedDatas> {

    let mergeOptions = (data.mergeInto) ? {mergeInto: data.mergeInto} : null;

    return this.fetch('DELETE', '/admin/sources/data/' + data.sourceKey, Utils.sanitizeQuery(mergeOptions));
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   *
   * @returns {Promise<Array<Source.adminModel>>}
   */
  public getDataSourcesList():Promise<Array<Source.adminModel>> {
    return this.fetch('GET', '/admin/sources');
  }

  /**
   * Get the list of edge-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenEdgeProperties(dataSource?:string):Promise<Array<string>> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetch('GET', '/admin/source/' + dataSource + '/hidden/edgeProperties');
  }

  /**
   * Get the list of node-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenNodeProperties(dataSource?:string):Promise<Array<string>> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetch('GET', '/admin/source/' + dataSource + '/hidden/nodeProperties');
  }

  /**
   * Get the list of edge-properties that re not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedEdgeProperties(dataSource?:string):Promise<Array<string>> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetch('GET', '/admin/source/' + dataSource + '/noIndex/edgeProperties');
  }

  /**
   * Get the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedNodeProperties(dataSource?:string):Promise<Array<string>> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetch('GET', '/admin/source/' + dataSource + '/noIndex/nodeProperties');
  }

  /**
   * Set the list of edge-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenEdgeProperties(data:Source.form.setProperties, dataSource?:string):Promise<boolean> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetch('PUT', '/admin/source/' + dataSource + '/hidden/edgeProperties', data);
  }

  /**
   * Set the list of node-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenNodeProperties(data:Source.form.setProperties, dataSource?:string):Promise<boolean> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetch('PUT', '/admin/source/' + dataSource + '/hidden/nodeProperties', data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Set the list of edge-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setNotIndexedEdgeProperties(data:Source.form.setProperties, dataSource?:string):Promise<boolean> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetch('PUT', '/admin/source/' + dataSource + '/noIndex/edgeProperties', data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Set the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setNotIndexedNodeProperties(data:Source.form.setProperties, dataSource?:string):Promise<boolean> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }
    return this.fetch('PUT', '/admin/source/' + dataSource + '/noIndex/nodeProperties', data)
      .then(() => true)
      .catch(() => false);
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                   USER-ADMIN METHODS                  //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Add a new user to the application.
   *
   * @param data:User.form.create
   * @returns {Promise<User.model>}
   */
  public createUser(data:User.form.create):Promise<User.model> {
    return this.fetch('POST', '/admin/users', data);
  }

  /**
   * Deletes a user in the application.
   *
   * @param userId:number
   * @returns {Promise<string>}
   */
  public deleteUser(userId:number):Promise<string> {
    return this.fetch('DELETE', '/admin/users/' + userId)
      .then(() => 'User ' + userId + ' deleted');
  }

  /**
   * Adds a new group to the application.
   * @param data:Group.form.create
   * @returns {Promise<Group.model>}
   */
  public createGroup(data:Group.form.create):Promise<Group.model> {
    return this.fetch('POST', 'admin/groups', data);
  }

  /**
   * Deletes a group in the application.
   *
   * @param groupId:number
   * @returns {Promise<string>}
   */
  public deleteGroup(groupId:number):Promise<string> {
    return this.fetch('DELETE', '/admin/groups/' + groupId)
      .then(() => 'group ' + groupId + 'deleted');
  }

  /**
   * List a group already defined in the database.
   *
   * @param groupId:number
   * @returns {Promise<Group.model>}
   */
  public getGroup(groupId:number):Promise<Group.model> {
    return this.fetch('GET', '/admin/groups/' + groupId);
  }

  /**
   * List all the groups already defined in the database.
   *
   * @param dataSource:string
   * @returns {Promise<Array<Group.model>>}
   */
  public getGroupsList(dataSource?:string):Promise<Array<Group.model>> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }

    return this.fetch('GET', '/admin/' + dataSource + '/groups');
  }

  /**
   * Get possible targetType, type and action names.
   *
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<Group.sourceAccessRights>}
   */
  public getGroupsRights(dataSource ?:string):Promise<Group.sourceAccessRights> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }

    return this.fetch('GET', '/admin/' + dataSource + '/groups/rights_info');
  }

  /**
   * Bulk-set rights for a whole targetType on one or many groups.
   *
   * @param data:Group.form.batchRights
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<boolean>}
   */
  public updateBatchGroupsRights(data:Group.form.batchRights, dataSource?:string):Promise<boolean> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }

    return this.fetch('PUT', '/admin/' + dataSource + '/groups/group_rights', data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Overrides a given right with the one specified.
   *
   * @param data:Group.form.updateRights
   * @param groupId:number
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<Group.accessRights>}
   */
  public updateGroupRights(data:Group.form.updateRights, groupId:number, dataSource?:string):Promise<Group.accessRights> {
    if (!dataSource) {
      dataSource = '{dataSource}';
    }

    return this.fetch('PUT', '/admin/' + dataSource + 'groups/' + groupId + '/group_rights', data);
  }

  /**
   * Patches users in the application. Beware, if all the groups for a given user are deleted, the user is added to the default group.
   *
   * @param data:User.form.batch
   * @returns {Promise<boolean>}
   */
  public updateBatchUser(data:User.form.batch):Promise<boolean> {
    return this.fetch('PATCH', '/admin/users', data)
      .then(() => true);
  }

  /**
   * Patches a user in the application
   *
   * @param data:User.form.update
   * @param userId:number
   * @returns {Promise<User.model>}
   */
  public updateUser(data:User.form.update, userId:number):Promise<User.model> {
    return this.fetch('PATCH', '/admin/users/' + userId, data);
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                 VISUALIZATION METHODS                 //
  //                                                       //
  // ----------------------------------------------------- //

  /**
   * Get the number of visualizations for this data-source.
   *
   * @returns {Promise<Count>}
   */
  public countVisualizations():Promise<Count> {
    return this.fetch('GET', '/{dataSource}/visualizations/count');
  }

  /**
   * Create a widget for a visualization.
   *
   * @param data:Interface.Form.visualization.createWidget
   * @returns {Promise<string>}
   */
  public createWidget(data:Visualization.form.createWidget):Promise<string> {
    return this.fetch('POST', '/widget', data);
  }

  /**
   * Create a folder for visualizations
   *
   * @param data:Interface.Form.visualization.createFolder
   * @returns {Promise<boolean>}
   */
  public createFolder(data:Visualization.form.createFolder):Promise<boolean> {
    return this.fetch('POST', '/{dataSource}/visualizations/folder', data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Create a new visualization.
   *
   * @param data:Interface.Form.visualization.create
   * @returns {Promise<Visualization.model>}
   */
  public createVisualization(data:Visualization.form.create):Promise<Visualization.model> {
    return this.fetch('POST', '/{dataSource}/visualization', data);
  }

  /**
   * Delete a widget for a visualization.
   *
   * @param widgetKey:string
   * @returns {Promise<string>}
   */
  public deleteWidget(widgetKey:string):Promise<string> {
    return this.fetch('DELETE', '/widget/' + widgetKey)
      .then(() => 'Widget ' + widgetKey + ' deleted');
  }

  /**
   * Remove the specified folder and its children (visualizations and sub-folders)
   *
   * @param folderId:number
   * @returns {Promise<string>}
   */
  public deleteFolder(folderId:number):Promise<string> {
    return this.fetch('DELETE', '/{dataSource}/visualizations/folder/' + folderId)
      .then(() => 'folder ' + folderId + ' deleted');
  }

  /**
   * Duplicates a visualization.
   *
   * @param vizId:number
   * @returns {Promise<Visualization.model>}
   */
  public duplicateVisualization(vizId:number):Promise<Visualization.model> {
    return this.fetch('POST', '/{dataSource}/visualizations/' + vizId + '/duplicate');
  }

  /**
   * Get a visualization widget's data by key
   *
   * @param widgetKey:string
   * @returns {Promise<Visualization.widget>}
   */
  public getWidget(widgetKey:string):Promise<Visualization.widget> {
    return this.fetch('GET', '/widget/' + widgetKey);
  }

  /**
   * Return the visualization sandbox of the current user for a given data-source
   *
   * @param params:Interface.RequestSandbox
   * @returns {Promise<Visualization.model>}
   */
  public getSandbox(params:Visualization.request.sandbox):Promise<Visualization.model> {
    return this.fetch('GET', '/{dataSource}/sandbox', Utils.sanitizeQuery(params));
  }

  /**
   * Return one visualizations selected by ID.
   *
   * @param vizId:number
   * @returns {Promise<Visualization.model>}
   */
  public getVisualization(vizId:number):Promise<Visualization.model> {
    return this.fetch('GET', '/{dataSource}/visualizations/' + vizId);
  }

  /**
   * Return visualizations ordered with folders hierarchy.
   *
   * @returns {Promise<Visualization.tree>}
   */
  public getTree():Promise<Visualization.tree> {
    return this.fetch('GET', '/{dataSource}/visualizations/tree');
  }

  /**
   * Remove visualization selected by id.
   *
   * @param vizId:number
   * @returns {Promise<string>}
   */
  public deleteVisualization(vizId:number):Promise<string> {
    return this.fetch('DELETE', '/{dataSource}/visualizations/' + vizId)
      .then(() => 'Visualization ' + vizId + ' deleted');
  }

  /**
   * Get all share rights on a visualization
   * @param vizId:number
   * @returns {Promise<Visualization.Shares>}
   */
  public getShares(vizId:number):Promise<Visualization.Shares> {
    return this.fetch('GET', '/{dataSource}/visualizations/' + vizId + '/shares');
  }

  /**
   * Set the share right of a user on a visualization
   *
   * @param data:Interface.Form.visualization.share
   * @returns {Promise<Visualization.shareRights>}
   */
  public shareVisualization(data:Visualization.form.setShareRights):Promise<Visualization.shareRights> {

    let shareParams = {
      right: data.right
    };

    return this.fetch('PUT', '/{dataSource}/visualizations/' + data.vizId + '/share/' + data.userId, shareParams);
  }

  /**
   * Remove a share right of a user on a visualization
   *
   * @param data:Interface.Form.visualization.share
   * @returns {Promise<string>}
   */
  public unshareVisualization(data:Visualization.form.setShareRights):Promise<string> {
    return this.fetch('DELETE', '/{dataSource}/visualizations/' + data.vizId + '/shared/' + data.userId)
      .then(() => 'Visualization ' + data.vizId + 'unshared');
  }

  /**
   * Update a property of a folder
   *
   * @param folderId:number
   * @param data:Interface.Form.visualization.updateFolder
   * @returns {Promise<boolean>}
   */
  public updateFolder(folderId:number, data:Visualization.form.updateFolder):Promise<boolean> {
    return this.fetch('PATCH', '/{dataSource}/visualizations/folder/' + folderId, data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Update the sandbox of the current user for a given data-source.
   *
   * @param data:Interface.Form.visualization.updateSandbox
   * @returns {Promise<boolean>}
   */
  public updateSandbox(data:Visualization.form.updateSandbox):Promise<boolean> {
    return this.fetch('PATCH', '/{dataSource}/sandbox', data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Update visualization selected by id.
   *
   * @param vizId:number
   * @param data:Interface.Form.visualization.update
   * @returns {Promise<boolean>}
   */
  public updateVisualization(vizId:number, data:Visualization.form.update):Promise<boolean> {
    return this.fetch('PATCH', '/{dataSource}/visualizations/' + vizId, data)
      .then(() => true)
      .catch(() => false);
  }
}

export = Linkurious;