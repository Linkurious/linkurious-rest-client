/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-04-25.
 *
 * File:
 * Description :
 */

import { Logger, LogLevel } from './log/Logger';

import { Fetcher } from './http/fetcher';
import { FetcherFactory } from './http/FetcherFactory';

import { AdminModule } from './module/AdminModule';
import { MyModule } from './module/MyModule';
import { GraphModule } from './module/GraphModule';
import { EdgeModule } from './module/EdgeModule';
import { NodeModule } from './module/NodeModule';
import { SearchModule } from './module/SearchModule';
import { VisualizationModule } from './module/VisualizationModule';
import { AlertModule } from './module/AlertModule';
import {
  ILoggerDriver,
  IFetchConfig,
  IFullUser,
  IDataSourceState,
  IAppStatus,
  IAppVersion,
  IAppConfig,
  ISchema,
  IClientState
} from '../index';

export const LONGITUDE_HEURISTIC:Array<string> = ['longitude', 'long', 'lon', 'lng'];
export const LATITUDE_HEURISTIC:Array<string> = ['latitude', 'lat'];

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

  get state ():IClientState {
    return this._clientState;
  }

  /**
   *
   * @param {string} host           - Host URL of the linkurious server
   * @param {string} logLevel       - Level of log wanted
   * @param {object} [loggerDriver] - logger object
   * @param {FetcherFactory} [fetcherFactory] - fetcher factory
   */
  constructor (
    host:string,
    logLevel:LogLevel,
    loggerDriver?:ILoggerDriver,
    fetcherFactory?:FetcherFactory
  ) {
    this._clientState = <IClientState> {};
    this._logger = new Logger(logLevel, loggerDriver);
    if ( !fetcherFactory ) {
      fetcherFactory = new FetcherFactory();
    }
    this._fetcher = fetcherFactory.create(this._logger, this._clientState, host);

    this._admin = new AdminModule(this._fetcher, this._logger, this._clientState);
    this._my = new MyModule(this._fetcher);
    this._graph = new GraphModule(this._fetcher);
    this._edge = new EdgeModule(this._fetcher);
    this._node = new NodeModule(this._fetcher);
    this._search = new SearchModule(this._fetcher);
    this._visualization = new VisualizationModule(this._fetcher);
    this._alert = new AlertModule(this._fetcher);
  }

  /**
   * @returns {Fetcher}
   */
  get fetcher ():Fetcher {
    return this._fetcher;
  }

  /**
   * @returns {AdminModule}
   */
  get admin ():AdminModule {
    return this._admin;
  }

  /**
   * @returns {MyModule}
   */
  get my ():MyModule {
    return this._my;
  }

  /**
   * @returns {GraphModule}
   */
  get graph ():GraphModule {
    return this._graph;
  }

  /**
   * @returns {EdgeModule}
   */
  get edge ():EdgeModule {
    return this._edge;
  }

  /**
   * @returns {NodeModule}
   */
  get node ():NodeModule {
    return this._node;
  }

  /**
   * @returns {SearchModule}
   */
  get search ():SearchModule {
    return this._search;
  }

  /**
   * @returns {VisualizationModule}
   */
  get visualization ():VisualizationModule {
    return this._visualization;
  }

  /**
   * @returns {AlertModule}
   */
  get alerts ():AlertModule {
    return this._alert;
  }

  /**
   * set latitude property at index 0 of heuristic
   *
   * @param {string}lat
   */
  set latitudeProperty(lat:string) {
    LATITUDE_HEURISTIC.splice(0, 0, lat);
  }

  /**
   * set longitude property at index 0 of heuristic
   *
   * @param {string}long
   */
  set longitudeProperty(long:string) {
    LONGITUDE_HEURISTIC.splice(0, 0, long);
  }

  /**
   * remove user form state
   */
  public destroySession():void {
    this._clientState.user = undefined;
  }

  /**
   * Collect all the analytics and log files in a compressed tarball and return it.
   */
  public report():void {
    this._fetcher.fetch({
      url : '/admin/report',
      ignoreContentType : true,
      method : 'GET'
    });
  }

  /**
   * Send a user event / navigation event or login to server
   *
   * @param {any}data
   * @return {Promise<any>}
   */
  public analytics(
    data:{
      type:string;
      userId?:number;
      event?:string;
      name?:string;
      properties?:any;
      traits?:any;
      timestamp?:string;
      context?:any
    }
  ):Promise<void> {
    return this._fetcher.fetch({
      url : '/analytics',
      method : 'POST',
      body : data
    });
  }

  /**
   * Process to login of the corresponding user and return it.
   *
   * @param {Object} data
   * @returns {Promise<boolean>}
   */
  public login ( data:{
    usernameOrEmail:string;
    password:string;
  } ):Promise<any> {
    let config:IFetchConfig = {
      url   : '/auth/login',
      method: 'POST',
      body  : data
    };

    if ( this._clientState.user ) {
      return this.logout().then(
        () => {
          return this._fetcher.fetch(config);
        }
      ).then(
        ( res:any ) => {
          this._clientState.user = res;
          return this._clientState.user;
        }
      );
    } else {
      return this._fetcher.fetch(config).then(
        ( res:any ) => {
          this._clientState.user = res;
          return this._clientState.user;
        }
      );
    }
  }

  public OAuthAuthentication (data:{code:string, state:string}):Promise<boolean> {
    return this._fetcher.fetch(
      {
        url   : '/auth/sso/return',
        method: 'GET',
        query : data
      }
    );
  }

  /**
   * Clear the user session.
   *
   * @returns {Promise<string>}
   */
  public logout ():Promise<string> {
    return this._fetcher.fetch(
      {
        url   : '/auth/logout',
        method: 'GET'
      }
    )
      .then(
        () => {
          this._clientState.user = undefined;
          return 'user disconnected';
        }
      );
  }

  /**
   * Update the current user connected
   *
   * @param {Object} data
   * @returns {Promise<IFullUser>}
   */
  public updateCurrentUser ( data:{
    id:number;
    username ?:string;
    email ?:string;
    password ?:string;
    preferences ?:any;
  } ):Promise<IFullUser> {
    return this._fetcher.fetch(
      {
        url   : '/auth/me',
        method: 'PATCH',
        body  : data
      }
    ).then(
      ( res:IFullUser ) => {
        this._clientState.user = res;
        return this._clientState.user;
      }
    );
  }

  /**
   * Get the source list and set the currentSource to the first source connected
   *
   * @returns {Promise<any>}
   */
  public initSources ():Promise<any> {

    return this.getSourceList().then(
      ( sourceStates:Array<IDataSourceState> ) => {
        return this.storeDefaultCurrentSource(sourceStates);
      }
    );
  }

  /**
   * Get the status of the all data-sources.
   *
   * @returns {Promise<IDataSourceState>}
   */
  public getSourceList ():Promise<Array<IDataSourceState>> {
    return this._fetcher.fetch(
      {
        url   : '/dataSources',
        method: 'GET'
      }
    ).then(( res:any ) => res.sources);
  }

  /**
   * Set the currentSource
   *
   * @param {Array<Object>}sourceList
   * @return {IDataSource}
   */
  public storeDefaultCurrentSource(sourceList:Array<{
    connected:boolean;
    state:string;
    reason:string;
    error?:string;
    name:string;
    key:string;
    configIndex:number;
    features:any;
    settings:any;
  }>):IDataSourceState {
    for ( let sourceState of sourceList ) {
      if ( this.storeSource(sourceState, 'connected', true) ) {
        return this._clientState.currentSource;
      } else {
        this._clientState.currentSource = {
          name       : sourceList[0].name,
          key        : sourceList[0].key,
          configIndex: sourceList[0].configIndex,
          connected  : sourceList[0].connected,
          state      : sourceList[0].state,
          reason     : sourceList[0].reason,
          error      : sourceList[0].error,
          features   : sourceList[0].features,
          settings   : sourceList[0].settings
        };
      }
    }
    return sourceList[0];
  };

  /**
   * Set the currentSource
   *
   * @param {Object} source
   * @returns {Promise<IDataSourceState>}
   */
  public setCurrentSource ( source:{
    name:string;
    key:string;
    configIndex:number;
    connected:boolean;
    state:string;
    reason:string;
    error?:string;
    features:any;
    settings:any;
  } ):void {
    this._clientState.currentSource = {
      name       : source.name,
      key        : source.key,
      configIndex: source.configIndex,
      connected  : source.connected,
      state      : source.state,
      reason     : source.reason,
      error      : source.error,
      features   : source.features,
      settings   : source.settings
    };
  }

  /**
   * Process to login and set the default source state and return the REST client state.
   *
   * @param {Object} data
   * @returns {Promise<IClientState>}
   */
  public init ( data:{
    usernameOrEmail:string;
    password:string;
  } ):Promise<IClientState> {

    return this.login(data).then(
      () => {
        return this.initSources();
      }
    ).then(
      () => {
        return this._clientState;
      }
    );
  }

  /**
   * Get the status of the Linkurious API.
   *
   * @returns {Promise<IAppStatus>}
   */
  public getAppStatus ():Promise<IAppStatus> {
    return this._fetcher.fetch(
      {
        url   : '/status',
        method: 'GET'
      }
    ).then(
      ( res:any ) => {
        return res.status;
      }
    );
  }

  /**
   * Get Linkurious' current version information
   *
   * @returns {Promise<IAppVersion>}
   */
  public getAppVersion ():Promise<IAppVersion> {
    return this._fetcher.fetch(
      {
        method: 'GET',
        url   : '/version'
      }
    );
  }

  /**
   * Return the configuration of the application.
   *
   * @param {number} [sourceIndex]
   * @returns {Promise<IAppConfig>}
   */
  public getAppConfig ( sourceIndex?:number ):Promise<IAppConfig> {
    return this._fetcher.fetch(
      {
        method: 'GET',
        query : { sourceIndex: sourceIndex },
        url   : '/config'
      }
    );
  }

  /**
   * Restart the server and send the new URL
   */
  public restartServer():Promise<string> {
    return this._fetcher.fetch({
      method: 'POST',
      url   : '/admin/restart'
    }).then((response:any) => response.url);
  }

  /**
   * List nodeCategories, edgeTypes, nodeProperties and edgeProperties before the first indexation.
   *
   * @returns {Promise<ISchema>}
   */
  public getSchema ():Promise<ISchema> {
    return this._fetcher.fetch(
      {
        method: 'GET',
        url   : '/{dataSourceKey}/graph/schema/simple'
      }
    );
  }

  public track ( data:any ):Promise<any> {
    return this._fetcher.fetch(
      {
        method: 'POST',
        url   : '/track',
        body  : data
      }
    );
  }

  /**
   * Store a source in clientState if condition is verified
   *
   * @param {IDataSourceState} source
   * @param {string} property
   * @param {string|number|boolean} matchValue
   * @returns {IDataSourceState}
   */
  private storeSource (
    source:IDataSourceState,
    property:string,
    matchValue:string|number|boolean
  ):IDataSourceState {
    if ( (<any> source)[property] === matchValue ) {
      this._clientState.currentSource = {
        name       : source.name,
        key        : source.key,
        configIndex: source.configIndex,
        connected  : source.connected,
        state      : source.state,
        reason     : source.reason,
        error      : source.error,
        features   : source.features,
        settings   : source.settings
      };
      return this._clientState.currentSource;
    } else {
      return undefined;
    }
  }
}
