/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-25.
 *
 * File:
 * Description :
 */

import {Logger, LogLevel} from './src/log/Logger';
import {ILoggerDriver} from './src/log/ILoggerDriver';

import {Fetcher} from './src/http/fetcher';
import {FetcherFactory} from './src/http/FetcherFactory';
import {IFetchConfig} from './src/http/IFetchConfig';

import {AdminModule} from './src/module/AdminModule';
import {MyModule} from './src/module/MyModule';
import {GraphModule} from './src/module/GraphModule';
import {EdgeModule} from './src/module/EdgeModule';
import {NodeModule} from './src/module/NodeModule';
import {SearchModule} from './src/module/SearchModule';
import {VisualizationModule} from './src/module/VisualizationModule';
import {AlertModule} from './src/module/AlertModule';
import * as Query from './src/Query';
import {
  IDataSource,
  IFullUser,
  IDataSourceState,
  IAppStatus,
  IAppVersion,
  IAppConfig,
  ISchema,
  IClientState
} from './src/interfaces';

export class Linkurious {
  private _fetcher:Fetcher;
  private _clientState:IClientState;
  private _logger:Logger;

  private _admin:AdminModule;
  private _my:MyModule;
  private _edge:EdgeModule;
  private _graph:GraphModule;
  private _node:NodeModule;
  private _search:SearchModule;
  private _visualization:VisualizationModule;
  private _alert:AlertModule;

  get state():IClientState {
    return this._clientState;
  }

  /**
   *
   * @param {string} host           - Host URL of the linkurious server
   * @param {string} logLevel       - Level of log wanted
   * @param {object} [loggerDriver] - logger object
   * @param {FetcherFactory} [fetcherFactory] - fetcher factory
   */
  constructor(host:string, logLevel:LogLevel, loggerDriver?:ILoggerDriver, fetcherFactory?: FetcherFactory) {
    this._clientState   = <IClientState> {};
    this._logger        = new Logger(logLevel, loggerDriver);
    if (!fetcherFactory) { fetcherFactory = new FetcherFactory(); }
    this._fetcher       = fetcherFactory.create(this._logger, this._clientState, host);

    this._admin         = new AdminModule(this._fetcher, this._logger, this._clientState);
    this._my            = new MyModule(this._fetcher);
    this._graph         = new GraphModule(this._fetcher);
    this._edge          = new EdgeModule(this._fetcher);
    this._node          = new NodeModule(this._fetcher);
    this._search        = new SearchModule(this._fetcher);
    this._visualization = new VisualizationModule(this._fetcher);
    this._alert         = new AlertModule(this._fetcher);
  }

  /**
   * @returns {Fetcher}
   */
  get fetcher():Fetcher {
    return this._fetcher;
  }

  /**
   * @returns {AdminModule}
   */
  get admin():AdminModule {
    return this._admin;
  }

  /**
   * @returns {MyModule}
   */
  get my():MyModule {
    return this._my;
  }

  /**
   * @returns {GraphModule}
   */
  get graph():GraphModule {
    return this._graph;
  }

  /**
   * @returns {EdgeModule}
   */
  get edge():EdgeModule {
    return this._edge;
  }

  /**
   * @returns {NodeModule}
   */
  get node():NodeModule {
    return this._node;
  }

  /**
   * @returns {SearchModule}
   */
  get search():SearchModule {
    return this._search;
  }

  /**
   * @returns {VisualizationModule}
   */
  get visualization():VisualizationModule {
    return this._visualization;
  }

  /**
   * @returns {AlertModule}
   */
  get alerts():AlertModule {
    return this._alert;
  }

  /**
   * Process to login of the corresponding user and return it.
   *
   * @param {ILoginUser} data
   * @returns {Promise<boolean>}
   */
  public login(data:Query.ILoginUser):Promise<any> {
    let config:IFetchConfig = {
      url   : '/auth/login',
      method: 'POST',
      body  : data
    };

    if (this._clientState.user) {
      return this.logout().then(() => {
        return this._fetcher.fetch(config);
      }).then((res:any) => {
        this._clientState.user = res.user;
        return this._clientState.user;
      });
    } else {
      return this._fetcher.fetch(config).then((res:any) => {
        this._clientState.user = res.user;
        return this._clientState.user;
      });
    }
  }

  public oAuthAzure():Promise<boolean> {
    return this._fetcher.fetch({
      url : '/auth/azuread/login',
      method : 'GET'
    }).then(() => true);
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
        this._clientState.user = undefined;
        return 'user disconnected';
      });
  }

  /**
   * Update the current user connected
   *
   * @param {IUpdateUser} data
   * @returns {Promise<IFullUser>}
   */
  public updateCurrentUser(data:Query.IUpdateUser):Promise<IFullUser> {
    return this._fetcher.fetch({
      url   : '/auth/me',
      method: 'PATCH',
      body  : data
    }).then((res:IFullUser) => {
      this._clientState.user = Object.assign(this._clientState.user, res);
      return this._clientState.user;
    });
  }

  /**
   * Get the status of the all data-sources.
   *
   * @returns {Promise<IDataSourceState>}
   */
  public getSourceList():Promise<Array<IDataSourceState>> {
    return this._fetcher.fetch({
      url   : '/dataSources',
      method: 'GET'
    }).then((res:any) => res.sources);
  }

  /**
   * Set the currentSource to the first source connected
   *
   * @returns {Promise<any>}
   */
  public initSources():Promise<any> {

    return this.getSourceList().then((sourceStates:Array<IDataSourceState>) => {
      for (let sourceState of sourceStates) {
        if (this.storeSource(sourceState, 'connected', true)) {
          return {
            sources : sourceStates,
            currentSource : this._clientState.currentSource
          };
        }
      }
    });
  }

  /**
   * Set the currentSource by passing the sourceKey or configIndex
   *
   * @param {string|number} keyOrConfig
   * @returns {Promise<IDataSourceState>}
   */
  public setCurrentSource(keyOrConfig:string | number):Promise<IDataSource> {
    return this.getSourceList().then((sourceStates:Array<IDataSourceState>) => {
      for (let sourceState of sourceStates) {
        let sourceComparator:string;

        if (typeof keyOrConfig === 'string') {
          sourceComparator = 'key';
        } else {
          sourceComparator = 'configIndex';
        }

        if (this.storeSource(sourceState, sourceComparator, keyOrConfig)) {
          return this._clientState.currentSource;
        }
      }
      return undefined;
    });
  }

  /**
   * Process to login and set the default source state and return the REST client state.
   *
   * @param {ILoginUser} data
   * @returns {Promise<IClientState>}
   */
  public init(data:Query.ILoginUser):Promise<IClientState> {

    return this.login(data).then(() => {
      return this.initSources();
    }).then(() => {
      return this._clientState;
    });
  }

  /**
   * Get the status of the Linkurious API.
   *
   * @returns {Promise<IAppStatus>}
   */
  public getAppStatus():Promise<IAppStatus> {
    return this._fetcher.fetch({
      url   : '/status',
      method: 'GET'
    }).then((res:any) => {
      return res.status;
    });
  }

  /**
   * Get Linkurious' current version information
   *
   * @returns {Promise<IAppVersion>}
   */
  public getAppVersion():Promise<IAppVersion> {
    return this._fetcher.fetch({
      method: 'GET',
      url   : '/version'
    });
  }

  /**
   * Return the configuration of the application.
   *
   * @param {number} [sourceIndex]
   * @returns {Promise<IAppConfig>}
   */
  public getAppConfig(sourceIndex?:number):Promise<IAppConfig> {
    return this._fetcher.fetch({
      method: 'GET',
      query : {sourceIndex: sourceIndex},
      url   : '/config'
    }).then(response => response.config);
  }

  /**
   * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
   *
   * @returns {Promise<ISchema>}
   */
  public getSchema():Promise<ISchema> {
    return this._fetcher.fetch({
      method: 'GET',
      url   : '/{dataSourceKey}/graph/schema/simple'
    });
  }

  public track(data:any):Promise<any> {
    return this._fetcher.fetch({
      method: 'POST',
      url : '/track',
      body : data
    });
  }

  /**
   * Store a source in clientState if condition is verified
   *
   * @param {IFullDataSource} source
   * @param {string} property
   * @param {string|number|boolean} matchValue
   * @returns {IDataSource}
   */
  private storeSource(
    source:IDataSourceState,
    property:string,
    matchValue:string|number|boolean
  ):IDataSource {
    if ((<any> source)[property] === matchValue) {
      this._clientState.currentSource = {
        name : source.name,
        key : source.key,
        configIndex : source.configIndex
      };

      return this._clientState.currentSource;
    } else {
      return undefined;
    }
  }
}