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

import {Logger, LogLevel} from './log/Logger';
import {ILoggerDriver} from './log/ILoggerDriver';

import Fetcher from './http/fetcher';
import {IFetchConfig} from './http/IFetchConfig';

import AdminModule from './module/AdminModule';
import MyModule from './module/MyModule';
import GraphModule from './module/GraphModule';
import EdgeModule from './module/EdgeModule';
import NodeModule from './module/NodeModule';
import SearchModule from './module/SearchModule';
import VisualizationModule from './module/VisualizationModule';

import LinkuriousError from './LinkuriousError';

import {
  DataSource, User, StateModel, App, IndexationCallback, Schema
} from './interfaces';

class Linkurious {
  private _fetcher:Fetcher;
  private _currentSource:DataSource.clientModel;
  private _user:User.model;
  private _logger:Logger;

  private _admin:AdminModule;
  private _my:MyModule;
  private _edge:EdgeModule;
  private _graph:GraphModule;
  private _node:NodeModule;
  private _search:SearchModule;
  private _visualization:VisualizationModule;

  get currentSource() {
    return this._currentSource;
  }

  get user() {
    return this._user;
  }

  /**
   *
   * @param {string} host           - Host URL of the linkurious server
   * @param {string} logLevel       - Level of log wanted
   * @param {object} [loggerDriver] - logger object
   */
  constructor(host:string, logLevel:LogLevel, loggerDriver?:ILoggerDriver) {
    this._currentSource = <DataSource.clientModel> {};
    this._user          = <User.model>undefined;
    this._logger        = new Logger(logLevel, loggerDriver);
    this._fetcher       = new Fetcher(this._logger, this._currentSource, host);

    this._admin         = new AdminModule(this._fetcher);
    this._my            = new MyModule(this._fetcher);
    this._graph         = new GraphModule(this._fetcher);
    this._edge          = new EdgeModule(this._fetcher);
    this._node          = new NodeModule(this._fetcher);
    this._search        = new SearchModule(this._fetcher);
    this._visualization = new VisualizationModule(this._fetcher);
  }

  /**
   * @returns {AdminModule}
   */
  get admin() {
    return this._admin;
  }

  /**
   * @returns {MyModule}
   */
  get my() {
    return this._my;
  }

  /**
   * @returns {GraphModule}
   */
  get graph() {
    return this._graph;
  }

  /**
   * @returns {EdgeModule}
   */
  get edge() {
    return this._edge;
  }

  /**
   * @returns {NodeModule}
   */
  get node() {
    return this._node;
  }

  /**
   * @returns {SearchModule}
   */
  get search() {
    return this._search;
  }

  /**
   * @returns {VisualizationModule}
   */
  get visualization() {
    return this._visualization;
  }

  /**
   *
   * @param source:Source.model
   * @param property:string
   * @param matchValue:any
   * @returns {DataSource.clientModel}
   */
  private storeSource(source:DataSource.model, property:string, matchValue:string|number|boolean):DataSource.clientModel {
    if (source[property] === matchValue) {
      this._currentSource.name        = source.name;
      this._currentSource.key         = source.key;
      this._currentSource.configIndex = source.configIndex;

      return this._currentSource;
    } else {
      return null;
    }
  }

  /**
   * Process to login of the corresponding user and return it.
   *
   * @param data : User.form.login
   * @returns {Promise<boolean>}
   */
  public login(data:User.form.login):Promise<boolean> {
    let config:IFetchConfig = {
      url   : '/auth/login',
      method: 'POST',
      body  : data
    };

    if (this._user) {
      return this.logout().then(() => {
        return this._fetcher.fetch(config);
      }).then(res => {
        this._user = res.user;
        return true;
      });
    } else {
      return this._fetcher.fetch(config).then(res => {
        this._user = res.user;
        return true;
      });
    }
  }

  /**
   * Clear the user session.
   *
   * @returns {Promise<string>}
   */
  public logout():Promise<string> {
    return this._fetcher.fetch({
      url   : '/auth/logout',
      method: 'GET'
    })
      .then(() => {
        this._user = undefined;
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
    return this._fetcher.fetch({
      url   : '/auth/me',
      method: 'PATCH',
      body  : data
    }).then((res) => {
      this.user.username    = res.username;
      this.user.email       = res.email;
      this.user.groups      = res.groups;
      this.user.ldap        = res.ldap;
      this.user.admin       = res.admin;
      this.user.preferences = res.preferences;
      return res;
    });
  }

  /**
   * Get the status of the all data-sources.
   *
   * @returns {Promise<DataSource.list>}
   */
  public getSourceList():Promise<DataSource.list> {
    return this._fetcher.fetch({
      url   : '/dataSources',
      method: 'GET'
    });
  }

  /**
   * Set the currentSource to the first source connected
   *
   * @returns {Promise<DataSource.clientModel>}
   */
  public initCurrentSource():Promise<DataSource.clientModel> {
    return this.getSourceList()
      .then((res) => {
        for (let i = 0, l = res.sources.length; i < l; ++i) {
          let sourceIteration = res.sources[i];

          if (this.storeSource(sourceIteration, 'connected', true)) {
            return this._currentSource;
          }
        }
      });
  }

  /**
   * Set the currentSource by passing the sourceKey or configIndex
   *
   * @param keyOrConfig : string|number
   * @returns {Promise<DataSource.clientModel>}
   */
  public setCurrentSource(keyOrConfig:string | number):Promise<DataSource.clientModel> {
    return this.getSourceList()
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
            return this._currentSource;
          }
        }
      });
  }

  /**
   * Process to login and set the default source state and return the REST client state.
   *
   * @param data:User.form.login
   * @returns {Promise<StateModel>}
   */
  public startClient(data:User.form.login):Promise<StateModel> {

    return this.login(data).then(() => {
      return this.initCurrentSource();
    }).then(() => {
      return {
        user         : this._user,
        currentSource: this._currentSource
      };
    });
  }

  /**
   * Get the status of the Linkurious API.
   *
   * @returns {Promise<App.status>}
   */
  public getAppStatus():Promise<App.status> {
    return this._fetcher.fetch({
      url   : '/status',
      method: 'GET'
    });
  }

  /**
   * Get Linkurious' current version information
   *
   * @returns {Promise<App.version>}
   */
  public getAppVersion():Promise<App.version> {
    return this._fetcher.fetch({
      url   : '/version',
      method: 'GET'
    });
  }

  /**
   * Return the configuration of the application.
   *
   * @param sourceIndex:number
   * @returns {Promise<App.config>}
   */
  public getAppConfig(sourceIndex?:number):Promise<App.config> {
    return this._fetcher.fetch({
      url   : '/config',
      method: 'GET',
      query : {sourceIndex: sourceIndex}
    });
  }

  /**
   * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
   *
   * @returns {Promise<Schema.model>}
   */
  public getSchema():Promise<Schema.model> {
    return this._fetcher.fetch({
      url   : '/{dataSource}/graph/schema/simple',
      method: 'GET'
    });
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @returns {Promise<DataSource.indexationStatus>}
   */
  public getIndexationStatus():Promise<DataSource.indexationStatus> {
    return this._fetcher.fetch({
      url   : '/{dataSource}/search/status',
      method: 'GET'
    }).then(r => {
      if (r.indexed_source !== this._currentSource.key) {
        this._logger.error(LinkuriousError.fromClientError(
          'Indexation error',
          'Server is indexing another source.'
        ));

        return Promise.reject(r);
      }

      return r;
    });
  }

  /**
   * Launch the indexation and return true when finish. Possibility to had callback called each 300ms during indexation.
   *
   * @param timeout:number
   * @param callback:Function
   * @returns {Promise<boolean>}
   */
  public processIndexation(timeout:number, callback?:IndexationCallback):Promise<boolean> {

    const minTimeout = 200,
          maxTimeout = 3000;

    if (timeout < minTimeout) {
      timeout = 200;
    }

    if (timeout > maxTimeout) {
      timeout = 500;
    }

    return this.admin.startIndexation()
      .then(() => this.listenIndexation(timeout, callback))
      .then(() => true);
  }

  /**
   * return true when indexation if finished, else launch callback.
   *
   * @param timeout:number
   * @param callback:Function
   * @returns {Promise<boolean>}
   */
  private listenIndexation(timeout:number, callback?:IndexationCallback):Promise<boolean> {

    return this.getIndexationStatus().then((res) => {
      if (res.indexing !== 'done') {
        setTimeout(() => {
          if (callback) {
            callback(res);
          }
          this.listenIndexation(timeout, callback);
        }, timeout);
      } else {
        return true;
      }
    });
  }
}

export = Linkurious;
