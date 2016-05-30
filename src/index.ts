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

import LogDriver from './logDriver';
import Fetcher from './fetcher';
import Admin from './admin';
import My from './my';
import Edge from './edge';
import Graph from './graph';
import Node from './node';
import Search from './search';
import Visualization from './visualization';
import * as i from './interfaces';

class Linkurious {

  public log:i.LogDriver;
  public admin:i.Admin;
  public my:i.My;
  public edge:i.Edge;
  public graph:i.Graph;
  public node : i.Node;
  public search: i.Search;
  public visualization : i.Visualization;
  private fetcher:i.Fetcher;
  private _currentSource:i.Source.clientModel;
  private _user:i.User.model;

  get currentSource() {
    return this._currentSource;
  }

  get user(){
    return this._user;
  }

  /**
   *
   * @param {string} host           - Host URL of the linkurious server
   * @param {string} log            - Level of log wanted
   * @param {object} [logger]       - logger object
   */
  constructor(host:string, log:string, logger?:i.LoggerPlugin) {
    this._currentSource = <i.Source.clientModel> {};
    this._user          = <i.User.model>{};
    this.log            = <i.LogDriver>new LogDriver(log, logger);
    this.fetcher        = <i.Fetcher>new Fetcher(this.log, this._currentSource, host);
    this.admin          = <i.Admin>new Admin(this.fetcher);
    this.my             = <i.My>new My(this.fetcher);
    this.edge           = <i.Edge>new Edge(this.fetcher);
    this.graph          = <i.Graph>new Graph(this.fetcher);
    this.node           = <i.Node>new Node(this.fetcher);
    this.search         = <i.Search>new Search(this.fetcher);
    this.visualization  = <i.Visualization>new Visualization(this.fetcher);
  }

  /**
   *
   * @param source:Source.model
   * @param property:string
   * @param matchValue:any
   * @returns {Source.clientModel}
   */
  private storeSource(source:i.Source.model, property:string, matchValue:string|number|boolean):i.Source.clientModel {
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
   * @param userLogin : string
   * @param password : string
   * @returns {Promise<boolean>}
   */
  public login(userLogin:string, password:string):Promise<boolean> {

    let data = {
      usernameOrEmail: userLogin,
      password       : password
    };

    if(this.user.id){
      return this.logout().then(() => {
        return this.fetcher.fetch('POST', '/auth/login', data);
      }).then(res => {
        this._user = res.user;
        return true;
      });
    } else {
      return this.fetcher.fetch('POST', '/auth/login', data).then(res => {
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
    return this.fetcher.fetch('GET', '/auth/logout')
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
  public updateCurrentUser(data:i.User.form.update):Promise<any> {
    return this.fetcher.fetch('PATCH', '/auth/me', data)
      .then((res) => {
        this._user.username = res.username;
        this._user.email = res.email;
        this._user.groups = res.groups;
        this._user.ldap = res.ldap;
        this._user.admin = res.admin;
        this._user.preferences = res.preferences;
        return res;
      })
      .catch((err) => Promise.reject(err));
  }

  /**
   * Get the status of the all data-sources.
   *
   * @returns {Promise<Source.list>}
   */
  public getSourceList():Promise<i.Source.list> {
    return this.fetcher.fetch('GET', '/dataSources');
  }

  /**
   * Set the currentSource to the first source connected
   *
   * @returns {Promise<Source.clientModel>}
   */
  public initCurrentSource():Promise<i.Source.clientModel> {
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
   * @returns {Promise<Source.clientModel>}
   */
  public setCurrentSource(keyOrConfig:string | number):Promise<i.Source.clientModel> {
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
   * @param userLogin:string
   * @param password:string
   * @returns {Promise<StateModel>}
   */
  public startClient(userLogin:string, password:string):Promise<i.StateModel> {

    return this.login(userLogin, password).then(() => {
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
  public getAppStatus():Promise<i.App.status> {
    return this.fetcher.fetch('GET', '/status');
  }

  /**
   * Get Linkurious' current version information
   *
   * @returns {Promise<App.version>}
   */
  public getAppVersion():Promise<i.App.version> {
    return this.fetcher.fetch('GET', '/version');
  }

  /**
   * Return the configuration of the application.
   *
   * @param sourceIndex:number
   * @returns {Promise<App.config>}
   */
  public getAppConfig(sourceIndex?:number):Promise<i.App.config> {
    return this.fetcher.fetch('GET', '/config', sourceIndex);
  }

  /**
   * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
   *
   * @returns {Promise<Schema.model>}
   */
  public getSchema():Promise<i.Schema.model> {
    return this.fetcher.fetch('GET', '/{dataSource}/graph/schema/simple');
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @returns {Promise<Source.indexationStatus>}
   */
  public getIndexationStatus():Promise<i.Source.indexationStatus> {
    return this.fetcher.fetch('GET', '/{dataSource}/search/status')
      .then((res) => {
        // TODO: this is not really an error, this should not reject
        if (res.indexed_source !== this._currentSource.key) {
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
   * Launch the indexation and return true when finish. Possibility to had callback called each 300ms during indexation.
   *
   * @param timeout:number
   * @param callback:Function
   * @returns {Promise<boolean>}
   */
  public processIndexation(timeout:number, callback?:i.IndexationCallback):Promise<boolean> {
    // TODO: move to admin module
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
  private listenIndexation(timeout:number, callback?:i.IndexationCallback):Promise<boolean> {

    return this.getIndexationStatus()
      .then((res) => {
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