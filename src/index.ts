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

import Logger from './Logger';
import Fetcher from './fetcher';
import Admin from './admin';
import My from './my';
import Edge from './edge';
import Graph from './graph';
import Node from './node';
import Search from './search';
import Visualization from './visualization';
import * as i from './interfaces';
import LinkuriousError from './LinkuriousError';
import {FetchConfig} from "./interfaces";

class Linkurious {
  private _fetcher: Fetcher;
  private _currentSource: i.Source.clientModel;
  private _user: i.User.model;
  private _logger: Logger;

  // todo: use the classes instead of the interfaces for all internal components
  public admin:i.Admin;
  public my:i.My;
  public edge:i.Edge;
  public graph:i.Graph;
  public node : i.Node;
  public search: i.Search;
  public visualization : i.Visualization;


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
  constructor(host: string, logLevel: i.LogLevel, loggerDriver?: i.LoggerDriver) {
    this._currentSource = <i.Source.clientModel> {};
    this._user          = <i.User.model>undefined;
    this._logger        = new Logger(logLevel, loggerDriver);
    this._fetcher       = new Fetcher(this._logger, this._currentSource, host);

    this.admin          = <i.Admin>new Admin(this._fetcher);
    this.my             = <i.My>new My(this._fetcher);
    this.edge           = <i.Edge>new Edge(this._fetcher);
    this.graph          = <i.Graph>new Graph(this._fetcher);
    this.node           = <i.Node>new Node(this._fetcher);
    this.search         = <i.Search>new Search(this._fetcher);
    this.visualization  = <i.Visualization>new Visualization(this._fetcher);
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
   * @param data : User.form.login
   * @returns {Promise<boolean>}
   */
  public login(data:i.User.form.login):Promise<boolean> {
    let config: FetchConfig = {
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
  public updateCurrentUser(data:i.User.form.update):Promise<any> {
    return this._fetcher.fetch({
      url   : '/auth/me',
      method: 'PATCH',
      body  : data
    })
      .then((res) => {
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
   * @returns {Promise<Source.list>}
   */
  public getSourceList():Promise<i.Source.list> {
    return this._fetcher.fetch({
      url   : '/dataSources',
      method: 'GET'
    });
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
   * @param data:User.form.login
   * @returns {Promise<StateModel>}
   */
  public startClient(data:i.User.form.login):Promise<i.StateModel> {

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
  public getAppStatus():Promise<i.App.status> {
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
  public getAppVersion():Promise<i.App.version> {
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
  public getAppConfig(sourceIndex?:number):Promise<i.App.config> {
    return this._fetcher.fetch({
      url   : '/config',
      method: 'GET',
      query : sourceIndex
    });
  }

  /**
   * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
   *
   * @returns {Promise<Schema.model>}
   */
  public getSchema():Promise<i.Schema.model> {
    return this._fetcher.fetch({
      url   : '/{dataSource}/graph/schema/simple',
      method: 'GET'
    });
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @returns {Promise<Source.indexationStatus>}
   */
  public getIndexationStatus():Promise<i.Source.indexationStatus> {
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
  public processIndexation(timeout:number, callback?:i.IndexationCallback):Promise<boolean> {

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