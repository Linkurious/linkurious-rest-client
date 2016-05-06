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
/// <reference path="./../typings/main/definitions/request/index.d.ts" />

import HTTPDriver from './HTTPDriver';
import LogDriver from './logDriver';
import {Utils} from './utils';
import * as Interface from './interfaces';
import {User} from "./interfaces";

class Linkurious implements Interface.LinkuriousInterface {

  public host:string;
  public state:Interface.clientState;
  public log:Interface.LogDriverInterface;
  public httpDriver:Interface.HTTPDriverInterface;

  constructor(host:string, log:string, logger?:Interface.LoggerPlugin) {
    this.host       = host;
    this.state      = <Interface.clientState>{};
    this.log        = <Interface.LogDriverInterface>new LogDriver(log, logger);
    this.httpDriver = <Interface.HTTPDriverInterface>new HTTPDriver();
  }

  /**
   * test if condition is verified and return new currentSource
   *
   * @param source : StateSource
   * @param comparator : string
   * @param condition
   * @returns {StateSource}
   */
  private setStateSource(source:Interface.Source, comparator:string, condition:any):any {
    if (source[comparator] === condition) {
      this.state.currentSource = {
        name       : source.name,
        key        : source.key,
        configIndex: source.configIndex
      };
      return this.state.currentSource;
    } else {
      return false;
    }
  }

  /**
   * construct the API URL with sourceId if needed and throw error if doesn't exists.
   *
   * @param uri:string
   * @returns {string}
   */
  private transformUrl(uri:string):string {

    const dataSourceTest = /\{dataSource}/;

    if (uri.match(dataSourceTest)) {
      if (this.state.currentSource.key) {
        return this.host + '/api' + uri.replace(dataSourceTest, this.state.currentSource.key);
      } else {
        this.log.error({
          key    : 'Configuration error',
          message: 'You need to set a current source to fetch this API.'
        });
      }
    } else {
      return this.host + '/api' + uri;
    }
  }

  /**
   * HTTPDriver wrapper method
   *
   * @param method : string ('GET'|'POST'|'PATCH')
   * @param uri : string
   * @param data : object
   * @returns {Promise}
   */
  private linkuriousFetch(method:string, uri:string, data?:any):Promise<any> {

    let url = this.transformUrl(uri),
        fetch;

    if (!data) {
      fetch = this.httpDriver[method](url);
    } else {
      fetch = this.httpDriver[method](url, data);
    }

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
   * @returns {Promise<SourcesList>}
   */
  public getSources():Promise<Interface.SourcesList> {
    return this.linkuriousFetch('GET', '/dataSources');
  }

  /**
   * Set the currentSource to the first source connected
   *
   * @returns {Promise<StateSource>}
   */
  public setDefaultSource():Promise<Interface.StateSource> {
    return this.getSources()
      .then((res) => {
        res.sources = [res.sources[1], res.sources[0]];
        for (let i = 0, l = res.sources.length; i < l; ++i) {
          let sourceIteration = res.sources[i];

          if (this.setStateSource(sourceIteration, 'connected', true)) {
            return this.state.currentSource;
          }
        }
      });
  }

  /**
   * Set the currentSource by passing the sourceKey or configIndex
   *
   * @param keyOrConfig : string|number
   * @returns {Promise<StateSource>}
   */
  public setCurrentSource(keyOrConfig:string | number):Promise<Interface.StateSource> {
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

          if (this.setStateSource(sourceIteration, sourceComparator, keyOrConfig)) {
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
  public userLogin(userLogin:string, password:string):Promise<boolean> {
    let data = {
      usernameOrEmail: userLogin,
      password       : password
    };
    return this.linkuriousFetch('POST', '/auth/login', data)
      .then(res => {
        this.state.user = res.user;
        return true;
      });
  }

  /**
   * Check if the user is authenticated.
   *
   * @returns {Promise<boolean>}
   */
  public userIsAuth():Promise<boolean> {
    return this.linkuriousFetch('GET', '/auth/authenticated')
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Check if the user is authenticated as an admin.
   *
   * @returns {Promise<boolean>}
   */
  public userIsAdmin():Promise<boolean> {
    return this.linkuriousFetch('GET', '/auth/admin')
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Clear the user session.
   *
   * @returns {Promise<string>}
   */
  public logout():Promise<string> {
    return this.linkuriousFetch('GET', '/auth/logout')
      .then(() => 'user disconnected');
  }

  /**
   * Retrieve the current user only if they are authenticated.
   *
   * @returns {Promise<User>}
   */
  public getCurrentUser():Promise<Interface.User> {
    return this.linkuriousFetch('GET', '/auth/me');
  }

  /**
   * Update the current user connected
   *
   * @param data : object
   * @returns {Promise}
   */
  public updateCurrentUser(data:Interface.Form.user.update):Promise<any> {
    return this.linkuriousFetch('PATCH', '/auth/me', data)
      .then((res) => {
        this.state.user = Object.assign(this.state.user, res);
        return res;
      })
      .catch((err) => Promise.reject(err));
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
  public edgesCount():Promise<any> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/edges/count');
  }

  /**
   * Add an edge in the graph.
   *
   * @param data : object
   * @returns {Promise<Edge>}
   */
  public createEdge(data:Interface.Form.edge.create):Promise<Interface.Edge> {
    return this.linkuriousFetch('POST', '/{dataSource}/graph/edges', data);
  }

  /**
   * Modify the properties of an edge in the graph by the given ones. Keeps the other properties of
   * the edge unchanged.
   *
   * @param edgeId : number
   * @param data : Form.edge.update
   * @returns {Promise<Edge>}
   */
  public updateEdge(edgeId:number, data:Interface.Form.edge.update):Promise<Interface.Edge> {
    return this.linkuriousFetch('PATCH', '/{dataSource}/graph/edges/' + edgeId, data);
  }

  /**
   * Delete a edge from the graph.
   *
   * @param edgeId : number
   * @returns {Promise<string>}
   */
  public deleteEdge(edgeId:number):Promise<string> {
    return this.linkuriousFetch('DELETE', '/{dataSource}/graph/edges/' + edgeId)
      .then(() => 'edge ' + edgeId + ' deleted');
  }

  /**
   * Get the adjacent edges of a node from the graph.
   * If source is provided, return outgoing edges only.
   * Else if target is provided, return incoming edges only.
   * Else if adjacent is provided, return all adjacent edges.
   *
   * @param data : object
   * @returns {Promise<EdgesList>}
   */
  public getAdjacentEdges(data:Interface.Form.edge.getAdjacent):Promise<Interface.EdgesList> {
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

    return this.linkuriousFetch('GET', '/{dataSource}/graph/edges', query);
  }

  /**
   * Get an edge of the graph.
   *
   * @param edgeId : number
   * @returns {Promise<Edge>}
   */
  public getEdge(edgeId:number):Promise<Interface.Edge> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/edges/' + edgeId);
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
    return this.linkuriousFetch('DELETE', '/{dataSource}/graph/my/rawQuery/' + graphQueryId)
      .then(() => 'graph query ' + graphQueryId + ' deleted');
  }

  /**
   * Returns a saved Graph Query owned by the current user
   *
   * @param graphQueryId : number
   * @returns {Promise<GraphQuery>}
   */
  public getGraphQuery(graphQueryId:number):Promise<Interface.GraphQuery> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/my/rawQuery/' + graphQueryId);
  }

  /**
   * Get the edit-versions for nodes and edges.
   *
   * @param nodesAndEdgesVersions : RequestNodesAndEdgesVersionsInterface
   * @returns {Promise}
   */
  public getVersions(nodesAndEdgesVersions:Interface.RequestNodesAndEdgesVersionsInterface):Promise<any> {
    return this.linkuriousFetch('POST', '/{dataSource}/graph/versions', nodesAndEdgesVersions);
  }

  /**
   * Returns an array of <LkNode[]> corresponding to all the shortest paths between two nodes that the user can read.
   *
   * @param nodesConfig : RequestShortestPathInterface
   * @returns {Promise}
   */
  public getShortestPaths(nodesConfig:Interface.RequestShortestPathInterface):Promise<any> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/shortestPaths', Utils.sanitizeQuery(nodesConfig));
  }

  /**
   * Returns all saved Graph Queries owned by the current user
   *
   * @returns {Promise}
   */
  public getAllGraphQueries():Promise<any> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/my/rawQuery/all');
  }

  /**
   * Save and Returns the created GraphQuery
   * @param data : Form.rawQuery.create
   * @returns {Promise<GraphQuery>}
   */
  public saveGraphQuery(data:Interface.Form.rawQuery.create):Promise<Interface.GraphQuery> {
    return this.linkuriousFetch('POST', '/{dataSource}/graph/my/rawQuery', data);
  }

  /**
   * Returns an array of LkNode[] matching the sent query.
   *
   * @param data:RequestGraphWithQueryInterface
   * @returns {Promise}
   */
  public requestGraphWithQuery(data:Interface.RequestGraphWithQueryInterface):Promise<any> {
    return this.linkuriousFetch('POST', '/{dataSource}/graph/rawQuery', Utils.sanitizeQuery(data));
  }

  /**
   * Update a graph query owned but the current user
   * @param graphQueryId : number
   * @param data : Form.rawQuery.update
   * @returns {Promise<GraphQuery>}
   */
  public updateGraphQuery(graphQueryId:number, data:Interface.Form.rawQuery.update):Promise<Interface.GraphQuery> {
    return this.linkuriousFetch('PATCH', '/{dataSource}/graph/my/rawQuery' + graphQueryId, data);
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                 LINKURIOUS METHODS                    //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Find a list of users matching a filter (on username or email)
   *
   * @param data : Interface.Form.user.search
   * @returns {Promise<Interface.SearchUserResult>}
   */
  public searchUsers(data:Interface.Form.user.search):Promise<Interface.SearchUserResult> {
    return this.linkuriousFetch('GET', '/findUsers', Utils.sanitizeQuery(data));
  }

  /**
   * Get the status of the Linkurious API.
   *
   * @returns {Promise<Interface.AppStatus>}
   */
  public getAppStatus():Promise<Interface.AppStatus> {
    return this.linkuriousFetch('GET', '/status');
  }

  /**
   * Get Linkurious' current version information
   *
   * @returns {Promise<Interface.AppVersion>}
   */
  public getAppVersion():Promise<Interface.AppVersion> {
    return this.linkuriousFetch('GET', '/version');
  }

  /**
   * Return the configuration of the application.
   *
   * @param sourceIndex:number
   * @returns {Promise<Interface.AppConfig>}
   */
  public getSourceConfig(sourceIndex?:number):Promise<Interface.AppConfig> {

    let data = (sourceIndex) ? {sourceIndex: sourceIndex} : null;

    return this.linkuriousFetch('GET', '/config', data);
  }

  /**
   * Sets the configuration of the application
   *
   * @param data:Interface.Form.config.update
   * @returns {Promise<string>}
   */
  public updateConfiguration(data:Interface.Form.config.update):Promise<string> {
    return this.linkuriousFetch('POST', '/config', data);
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
  public countNodes():Promise<Interface.Count> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/nodes/count');
  }

  /**
   * Add a node in the graph.
   *
   * @param data:Interface.Form.node.create
   * @returns {Promise<Interface.Node>}
   */
  public createNode(data:Interface.Form.node.create):Promise<Interface.Node> {
    return this.linkuriousFetch('POST', '/{dataSource}/graph/nodes', data);
  }

  /**
   * Delete the node and its adjacent edges from the graph.
   *
   * @param nodeId:number
   * @returns {Promise<string>}
   */
  public deleteNode(nodeId:number):Promise<string> {
    return this.linkuriousFetch('DELETE', '/{dataSource}/graph/nodes/' + nodeId)
      .then(() => 'node ' + nodeId + ' deleted');
  }

  /**
   * Get a node from the graph.
   *
   * @param nodeId:number
   * @param params:Interface.RequestNode
   * @returns {Promise<Interface.Node>}
   */
  public getNode(nodeId:number, params?:Interface.RequestNode):Promise<Interface.Node> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/nodes/' + nodeId, Utils.sanitizeQuery(params));
  }

  /**
   * Get all adjacent nodes and edges for one or many source nodes (ids). The result is an array of
   * nodes containing the sources nodes (ids) and their neighbors. Edges between sources nodes and
   * neighbors - as well as edges between neighbors themselves - are returned in each node's edges
   * field. If visible_nodes was specified, edges between source nodes or their neighbors and
   * visible nodes are also included.
   *
   * @param data:Interface.RequestNodeAdjacentItems
   * @returns {Promise<Interface.NodesWithEdges>}
   */
  public expandNode(data:Interface.RequestNodeAdjacentItems):Promise<Interface.Node> {
    return this.linkuriousFetch('POST', '/{dataSource}/graph/nodes/expand', Utils.sanitizeQuery(data));
  }

  /**
   * Get node-categories and edge-types of neighbors
   *
   * @param data:Interface.RequestNodeNeighbors
   * @returns {Promise<Array<Interface.DigestItem>>}
   */
  public getNodeNeighbors(data:Interface.RequestNodeNeighbors):Promise<Array<Interface.DigestItem>> {
    return this.linkuriousFetch('POST', '/{dataSource}/graph/neighborhood/digest', data);
  }

  /**
   * Modify the properties of a node in the graph by the given ones, and keeps the other properties of the node.
   *
   * @param nodeId:number
   * @param data:Interface.Form.node.update
   * @returns {Promise<Node>}
   */
  public updateNode(nodeId:number, data:Interface.Form.node.update):Promise<Node> {
    return this.linkuriousFetch('PATCH', '/{dataSource}/graph/nodes/' + nodeId, Utils.sanitizeQuery(data));
  }


  // ----------------------------------------------------- //
  //                                                       //
  //                    SCHEMA METHODS                     //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
   *
   * @returns {Promise<Interface.Schema>}
   */
  public getSchema():Promise<Interface.Schema> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/schema/simple');
  }

  /**
   * List all edgeType properties (aggregated from all edgeTypes)
   *
   * @param params:Interface.RequestProperties
   * @returns {Promise<Interface.PropertyList>}
   */
  public getEdgeTypesProperties(params?:Interface.RequestProperties):Promise<Interface.PropertyList> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/schema/edgeTypes/properties', Utils.sanitizeQuery(params));
  }

  /**
   * List all node-type properties (aggregated from all nodeTypes)
   *
   * @param params:Interface.RequestProperties
   * @returns {Promise<Interface.PropertyList>}
   */
  public getNodeTypesProperties(params?:Interface.RequestProperties):Promise<Interface.PropertyList> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/schema/nodeTypes/properties', Utils.sanitizeQuery(params));
  }

  /**
   * List edge-types indexed by linkurious
   *
   * @param params:Interface.RequestEdgeType
   * @returns {Promise<Interface.TypesList>}
   */
  public getEdgeTypes(params?:Interface.RequestEdgeType):Promise<Interface.TypesList> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/schema/edgeTypes', Utils.sanitizeQuery(params));
  }

  /**
   * List node-types indexed by Linkurious
   *
   * @param params:Interface.RequestNodeType
   * @returns {Promise<Interface.TypesList>}
   */
  public getNodeTypes(params?:Interface.RequestNodeType):Promise<Interface.TypesList> {
    return this.linkuriousFetch('GET', '/{dataSource}/graph/schema/nodeTypes', Utils.sanitizeQuery(params));
  }



  // ----------------------------------------------------- //
  //                                                       //
  //                    SEARCH METHODS                     //
  //                                                       //
  // ----------------------------------------------------- //


  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @returns {Promise<Interface.IndexationStatus>}
   */
  public getIndexationStatus():Promise<Interface.IndexationStatus> {
    return this.linkuriousFetch('GET', '/{dataSource}/search/status')
      .then((res) => {
        if(res.indexed_source !== this.state.currentSource.key) {
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
  public runIndexation():Promise<boolean> {
    return this.linkuriousFetch('GET', '/{dataSource}/search/reindex')
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Search for nodes based on a query string and optional parameters. Return formatted results for the Linkurious client.
   *
   * @param item:Interface.Item
   * @param params:Interface.RequestSearchItems
   * @returns {Promise<Interface.ResultSearchItems>}
   */
  public searchItems(item:Interface.Item, params:Interface.RequestSearchItems):Promise<Interface.ResultSearchItems> {
    return this.linkuriousFetch('GET', '/{dataSource}/search/' + item, params);
  }

  /**
   * Search for nodes based on a query strig and optional parameters. Return full Node objects.
   *
   * @param item:Interface.Item
   * @param params:Interface.RequestSearchItems
   * @returns {Promise<Array<Interface.Node>>}
   */
  public searchFullItems(item:Interface.Item, params:Interface.RequestSearchItems):Promise<Array<Interface.Node>> {
    return this.linkuriousFetch('GET', '/{dataSource}/search/' + item + '/full', Utils.sanitizeQuery(params));
  }

  /**
   * Search in the directory.
   *
   * @param data:Interface.RequestDirectory
   * @returns {Promise<Interface.ResultSearchDirectory>}
   */
  public searchDirectory(data:Interface.RequestDirectory):Promise<Interface.ResultSearchDirectory> {
    return this.linkuriousFetch('POST', '/{dataSource}/directory', data);
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
    return this.linkuriousFetch('POST', '/admin/source/' + sourceIndex + '/connect')
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Create a new data-source configuration (contains a graph database configuration and an index configuration).
   *
   * @param data:Interface.Form.dataSource.create
   * @returns {Promise<boolean>}
   */
  public configureDataSource(data:Interface.Form.dataSource.create):Promise<boolean> {
    return this.linkuriousFetch('POST', '/admin/sources/config', data)
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
    return this.linkuriousFetch('DELETE', '/admin/sources/config/' + sourceIndex)
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
   * @returns {Promise<Interface.ResultDeleteDatas>}
   */
  public deleteDatas(data:Interface.RequestDeleteDatas):Promise<Interface.ResultDeleteDatas>{

    let mergeOptions = (data.mergeInto)? {mergeInto:data.mergeInto} : null;

    return this.linkuriousFetch('DELETE', '/admin/sources/data/' + data.sourceKey, Utils.sanitizeQuery(mergeOptions));
  }

  /**
   * Get information for all data-source, including data-sources that do not exist online.
   *
   * @returns {Promise<Interface.ResultAdminDataSource>}
   */
  public getAllDataSOurces():Promise<Interface.ResultAdminDataSource> {
    return this.linkuriousFetch('GET', '/admin/sources');
  }

  /**
   * Get the list of edge-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenEdgeProperties(dataSource?:string):Promise<Array<string>> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }
    return this.linkuriousFetch('GET', '/admin/source/' + dataSource + '/hidden/edgeProperties');
  }

  /**
   * Get the list of node-properties hidden for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getHiddenNodeProperties(dataSource?:string):Promise<Array<string>> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }
    return this.linkuriousFetch('GET', '/admin/source/' + dataSource + '/hidden/nodeProperties');
  }

  /**
   * Get the list of edge-properties that re not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedEdgeProperties(dataSource?:string):Promise<Array<string>> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }
    return this.linkuriousFetch('GET', '/admin/source/' + dataSource + '/noIndex/edgeProperties');
  }

  /**
   * Get the list of node-properties that are not indexed for the given data-source.
   *
   * @param dataSource:string
   * @returns {Promise<Array<string>>}
   */
  public getNonIndexedNodeProperties(dataSource?:string):Promise<Array<string>> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }
    return this.linkuriousFetch('GET', '/admin/source/' + dataSource + '/noIndex/nodeProperties');
  }

  /**
   * Set the list of edge-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenEdgeProperties(data:Interface.RequestArrayProperties, dataSource?:string):Promise<boolean> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }
    return this.linkuriousFetch('PUT', '/admin/source/' + dataSource + '/hidden/edgeProperties', data);
  }

  /**
   * Set the list of node-properties that are hidden for the given data-source.
   *
   * @param dataSource:string
   * @param data:Interface.RequestArrayProperties
   * @returns {Promise<boolean>}
   */
  public setHiddenNodeProperties(data:Interface.RequestArrayProperties, dataSource?:string):Promise<boolean> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }
    return this.linkuriousFetch('PUT', '/admin/source/' + dataSource + '/hidden/nodeProperties', data)
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
  public setNotIndexedEdgeProperties(data:Interface.RequestArrayProperties, dataSource?:string):Promise<boolean> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }
    return this.linkuriousFetch('PUT', '/admin/source/' + dataSource + '/noIndex/edgeProperties', data)
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
  public setNotIndexedNodeProperties(data:Interface.RequestArrayProperties, dataSource?:string):Promise<boolean> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }
    return this.linkuriousFetch('PUT', '/admin/source/' + dataSource + '/noIndex/nodeProperties', data)
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
   * @param data:Interface.Form.user.create
   * @returns {Promise<Interface.User>}
   */
  public createUser(data:Interface.Form.user.create):Promise<Interface.User> {
    return this.linkuriousFetch('POST', '/admin/users', data);
  }

  /**
   * Deletes a user in the application.
   *
   * @param userId:number
   * @returns {Promise<string>}
   */
  public deleteUser(userId:number):Promise<string> {
    return this.linkuriousFetch('DELETE', '/admin/users/' + userId)
      .then(() => 'User ' + userId + ' deleted');
  }

  /**
   * Adds a new group to the application.
   * @param data:Interface.Form.group.create
   * @returns {Promise<Interface.Group>}
   */
  public createGroup(data:Interface.Form.group.create):Promise<Interface.Group> {
    return this.linkuriousFetch('POST', 'admin/groups', data);
  }

  /**
   * Deletes a group in the application.
   *
   * @param groupId:number
   * @returns {Promise<string>}
   */
  public deleteGroup(groupId:number):Promise<string> {
    return this.linkuriousFetch('DELETE', '/admin/groups/' + groupId)
      .then(() => 'group ' + groupId + 'deleted');
  }

  /**
   * List a group already defined in the database.
   *
   * @param groupId:number
   * @returns {Promise<Interface.Group>}
   */
  public getGroup(groupId:number):Promise<Interface.Group> {
    return this.linkuriousFetch('GET', '/admin/groups/' + groupId);
  }

  /**
   * List all the groups already defined in the database.
   *
   * @param dataSource:string
   * @returns {Promise<Array<Interface.Group>>}
   */
  public getAllGroups(dataSource?:string):Promise<Array<Interface.Group>> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }

    return this.linkuriousFetch('GET', '/admin/' + dataSource + '/groups');
  }

  /**
   * Get possible targetType, type and action names.
   *
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<Interface.GroupRights>}
   */
  public getGroupRight(dataSource ?: string):Promise<Interface.GroupRights> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }

    return this.linkuriousFetch('GET', '/admin/' + dataSource + '/groups/rights_info');
  }

  /**
   * Bulk-set rights for a whole targetType on one or many groups.
   *
   * @param data:Interface.Form.group.batchRights
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<boolean>}
   */
  public updateBatchGroupsRights(data:Interface.Form.group.batchRights, dataSource?:string):Promise<boolean> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }

    return this.linkuriousFetch('PUT', '/admin/' + dataSource + '/groups/group_rights', data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Overrides a given right with the one specified.
   *
   * @param data:Interface.Form.group.updateRights
   * @param groupId:number
   * @param dataSource?:string default : take the current source key.
   * @returns {Promise<Interface.ResultUpdateGroupRights>}
   */
  public updateGroupRights(data:Interface.Form.group.updateRights,groupId:number,  dataSource?:string):Promise<Interface.ResultUpdateGroupRights> {
    if(!dataSource){
      dataSource = '{dataSource}';
    }

    return this.linkuriousFetch('PUT', '/admin/' + dataSource + 'groups/' + groupId + '/group_rights', data);
  }

  /**
   * Patches users in the application. Beware, if all the groups for a given user are deleted, the user is added to the default group.
   *
   * @param data:Interface.Form.user.batch
   * @returns {Promise<boolean>}
   */
  public updateBatchUser(data:Interface.Form.user.batch):Promise<boolean> {
    return this.linkuriousFetch('PATCH', '/admin/users', data)
      .then(() => true);
  }

  /**
   * Patches a user in the application
   *
   * @param data:Interface.Form.user.update
   * @param userId:number
   * @returns {Promise:User}
   */
  public updateUser(data:Interface.Form.user.update, userId:number):Promise<User> {
    return this.linkuriousFetch('PATCH', '/admin/users/' + userId, data);
  }



  // ----------------------------------------------------- //
  //                                                       //
  //                 VISUALIZATION METHODS                 //
  //                                                       //
  // ----------------------------------------------------- //

  /**
   * Get the number of visualizations for this data-source.
   *
   * @returns {Promise<Interface.Count>}
   */
  public countViz():Promise<Interface.Count> {
    return this.linkuriousFetch('GET', '/{dataSource}/visualizations/count');
  }

  /**
   * Create a widget for a visualization.
   *
   * @param data:Interface.Form.visualization.createWidget
   * @returns {Promise<string>}
   */
  public createWidget(data:Interface.Form.visualization.createWidget):Promise<string> {
    return this.linkuriousFetch('POST', '/widget', data);
  }

  /**
   * Create a folder for visualizations
   *
   * @param data:Interface.Form.visualization.createFolder
   * @returns {Promise<boolean>}
   */
  public createFolder(data:Interface.Form.visualization.createFolder):Promise<boolean> {
    return this.linkuriousFetch('POST', '/{dataSource}/visualizations/folder', data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Create a new visualization.
   *
   * @param data:Interface.Form.visualization.create
   * @returns {Promise<Interface.Visualization>}
   */
  public createViz(data:Interface.Form.visualization.create):Promise<Interface.Visualization> {
    return this.linkuriousFetch('POST', '/{dataSource}/visualization', data);
  }

  /**
   * Delete a widget for a visualization.
   *
   * @param widgetKey:string
   * @returns {Promise<string>}
   */
  public deleteWidget(widgetKey:string):Promise<string> {
    return this.linkuriousFetch('DELETE', '/widget/' + widgetKey)
      .then(() => 'Widget ' + widgetKey + ' deleted');
  }

  /**
   * Remove the specified folder and its children (visualizations and sub-folders)
   *
   * @param folderId:number
   * @returns {Promise<string>}
   */
  public deleteFolder(folderId:number):Promise<string> {
    return this.linkuriousFetch('DELETE', '/{dataSource}/visualizations/folder/' + folderId)
      .then(() => 'folder ' + folderId + ' deleted');
  }

  /**
   * Duplicates a visualization.
   *
   * @param vizId:number
   * @returns {Promise<Interface.Visualization>}
   */
  public duplicateViz(vizId:number):Promise<Interface.Visualization> {
    return this.linkuriousFetch('POST', '/{dataSource}/visualizations/' + vizId + '/duplicate');
  }

  /**
   * Get a visualization widget's data by key
   *
   * @param widgetKey:string
   * @returns {Promise<Interface.Widget>}
   */
  public getWidget(widgetKey:string):Promise<Interface.Widget> {
    return this.linkuriousFetch('GET', '/widget/' + widgetKey);
  }

  /**
   * Return the visualization sandbox of the current user for a given data-source
   *
   * @param params:Interface.RequestSandbox
   * @returns {Promise<Interface.Visualization>}
   */
  public getVizSandbox(params:Interface.RequestSandbox):Promise<Interface.Visualization> {
    return this.linkuriousFetch('GET', '/{dataSource}/sandbox', Utils.sanitizeQuery(params));
  }

  /**
   * Return one visualizations selected by ID.
   *
   * @param vizId:number
   * @returns {Promise<Interface.Visualization>}
   */
  public getViz(vizId:number):Promise<Interface.Visualization> {
    return this.linkuriousFetch('GET', '/{dataSource}/visualizations/' + vizId);
  }

  /**
   * Return visualizations ordered with folders hierarchy.
   *
   * @returns {Promise<Interface.VisualizationTree>}
   */
  public getVizTree():Promise<Interface.VisualizationTree> {
    return this.linkuriousFetch('GET', '/{dataSource}/visualizations/tree');
  }

  /**
   * Remove visualization selected by id.
   *
   * @param vizId:number
   * @returns {Promise<string>}
   */
  public deleteViz(vizId:number):Promise<string> {
    return this.linkuriousFetch('DELETE', '/{dataSource}/visualizations/' + vizId)
      .then(() => 'Visualization ' + vizId + ' deleted');
  }

  /**
   * Get all share rights on a visualization
   * @param vizId:number
   * @returns {Promise<Interface.VisualizationSharer>}
   */
  public getVizSharer(vizId:number):Promise<Interface.VisualizationSharer> {
    return this.linkuriousFetch('GET', '/{dataSource}/visualizations/' + vizId + '/shares');
  }

  /**
   * Set the share right of a user on a visualization
   *
   * @param data:Interface.Form.visualization.share
   * @returns {Promise<Interface.VisualizationShare>}
   */
  public shareViz(data:Interface.Form.visualization.share):Promise<Interface.VisualizationShare> {

    let shareParams = {
      right : data.right
    };

    return this.linkuriousFetch('PUT', '/{dataSource}/visualizations/' + data.vizId + '/shared/' + data.userId, shareParams);
  }

  /**
   * Remove a share right of a user on a visualization
   *
   * @param data:Interface.Form.visualization.share
   * @returns {Promise<string>}
   */
  public unshareViz(data:Interface.Form.visualization.share):Promise<string> {
    return this.linkuriousFetch('DELETE', '/{dataSource}/visualization/' + data.vizId + '/share/' + data.userId)
      .then(() => 'Visualization ' + data.vizId + 'unshared');
  }

  /**
   * Update a property of a folder
   *
   * @param folderId:number
   * @param data:Interface.Form.visualization.updateFolder
   * @returns {Promise<boolean>}
   */
  public updateFolder(folderId:number, data:Interface.Form.visualization.updateFolder):Promise<boolean> {
    return this.linkuriousFetch('PATCH', '/{dataSource}/visualizations/folder/' + folderId, data)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Update the sandbox of the current user for a given data-source.
   *
   * @param data:Interface.Form.visualization.updateSandbox
   * @returns {Promise<boolean>}
   */
  public updateVizSandbox(data:Interface.Form.visualization.updateSandbox):Promise<boolean> {
    return this.linkuriousFetch('PATCH', '/{dataSource}/sandbox', data)
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
  public updateViz(vizId:number, data:Interface.Form.visualization.update):Promise<boolean> {
    return this.linkuriousFetch('PATCH', '/{dataSource}/visualizations/' + vizId, data)
      .then(() => true)
      .catch(() => false);
  }
}

export = Linkurious;