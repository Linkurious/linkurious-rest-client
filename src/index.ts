/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-04-25.
 */

import {
  IAppStatus,
  IAppVersion,
  IClientState,
  IFullUser,
  ILoggerDriver, InvalidParameter, Success, Unauthorized
} from '../index';

import {Logger, LogLevel} from './log/Logger';
import {Fetcher} from './http/fetcher';
import {FetcherFactory} from './http/FetcherFactory';
import {ErrorListener} from './errorListener';
import {AdminModule} from './module/AdminModule';
import {AlertModule} from './module/AlertModule';
import {EdgeModule} from './module/EdgeModule';
import {GraphModule} from './module/GraphModule';
import {MyModule} from './module/MyModule';
import {NodeModule} from './module/NodeModule';
import {SchemaModule} from './module/SchemaModule';
import {SearchModule} from './module/SearchModule';
import {VisualizationModule} from './module/VisualizationModule';
import {Rejection} from './response/errors';
import {Transformer} from './transformer';
import { IGetUserDataSourceResponse, IUserDataSource } from './models/DataSource';
import { DataSourceModule } from './module/DataSourceModule';
import { ConfigurationModule } from './module/ConfigurationModule';

export class Linkurious {
  private readonly _fetcher: Fetcher;
  private readonly _transformer: Transformer;
  private readonly _errorListener: ErrorListener;
  private readonly _clientState: IClientState;
  private readonly _logger: Logger;
  private readonly _admin: AdminModule;
  private readonly _my: MyModule;
  private readonly _edge: EdgeModule;
  private readonly _graph: GraphModule;
  private readonly _node: NodeModule;
  private readonly _search: SearchModule;
  private readonly _visualization: VisualizationModule;
  private readonly _alert: AlertModule;
  private readonly _schema: SchemaModule;
  private readonly _dataSource: DataSourceModule;
  private readonly _configuration: ConfigurationModule;

  get state(): IClientState {
    return this._clientState;
  }

  constructor(
    baseUrl: string,
    logLevel: LogLevel,
    loggerDriver?: ILoggerDriver,
    fetcherFactory?: FetcherFactory
  ) {
    this._clientState = {} as IClientState;
    this._clientState.guestMode = false;
    this._logger = new Logger(logLevel, loggerDriver);
    if (!fetcherFactory) {
      fetcherFactory = new FetcherFactory();
    }
    this._fetcher = fetcherFactory.create(this._logger, this._clientState, baseUrl);
    this._transformer = new Transformer();
    this._errorListener = new ErrorListener();
    this._admin = new AdminModule(
      this._fetcher,
      this._transformer,
      this._errorListener,
      this._logger,
      this._clientState
    );
    this._my = new MyModule(this._fetcher, this._transformer, this._errorListener);
    this._graph = new GraphModule(this._fetcher, this._transformer, this._errorListener);
    this._edge = new EdgeModule(this._fetcher, this._transformer, this._errorListener);
    this._node = new NodeModule(this._fetcher, this._transformer, this._errorListener);
    this._search = new SearchModule(this._fetcher, this._transformer, this._errorListener);
    this._visualization = new VisualizationModule(
      this._fetcher,
      this._transformer,
      this._errorListener
    );
    this._alert = new AlertModule(this._fetcher, this._transformer, this._errorListener);
    this._schema = new SchemaModule(this._fetcher, this._transformer, this._errorListener);
    this._dataSource = new DataSourceModule(this._fetcher, this._transformer, this._errorListener);
    this._configuration = new ConfigurationModule(this._fetcher, this._transformer, this._errorListener);
  }

  /**
   * @returns {Function}
   */
  public setErrorListener(fn: (e: Rejection) => unknown): void {
    this._errorListener.setErrorListener(fn);
  }

  /**
   * @returns {Fetcher}
   */
  get fetcher(): Fetcher {
    return this._fetcher;
  }

  /**
   * @returns {AdminModule}
   */
  get admin(): AdminModule {
    return this._admin;
  }

  /**
   * @returns {MyModule}
   */
  get my(): MyModule {
    return this._my;
  }

  /**
   * @returns {GraphModule}
   */
  get graph(): GraphModule {
    return this._graph;
  }

  /**
   * @returns {EdgeModule}
   */
  get edge(): EdgeModule {
    return this._edge;
  }

  /**
   * @returns {NodeModule}
   */
  get node(): NodeModule {
    return this._node;
  }

  /**
   * @returns {SchemaModule}
   */
  get schema(): SchemaModule {
    return this._schema;
  }

  /**
   * @returns {DataSourceModule}
   */
  get dataSource(): DataSourceModule {
    return this._dataSource;
  }

  /**
   * @returns {ConfigurationModule}
   */
  get configuration(): ConfigurationModule {
    return this._configuration;
  }

  /**
   * @returns {SearchModule}
   */
  get search(): SearchModule {
    return this._search;
  }

  /**
   * @returns {VisualizationModule}
   */
  get visualization(): VisualizationModule {
    return this._visualization;
  }

  /**
   * @returns {AlertModule}
   */
  get alerts(): AlertModule {
    return this._alert;
  }

  /**
   * set guest mode
   */
  public setGuestMode(value: boolean): void {
    this._clientState.guestMode = value;
  }

  /**
   * remove user form state
   */
  public destroySession(): void {
    this._clientState.user = undefined;
  }

  /**
   * Collect all the analytics and log files in a compressed tarball and return it.
   */
  public report(): void {
    this._fetcher.fetch({
      url: '/admin/report',
      ignoreContentType: true,
      method: 'GET'
    });
  }

  /**
   * Send a user event / navigation event or login to server
   *
   * @param {any}data
   * @return {Promise<any>}
   */
  public analytics(data: {
    type: string;
    userId?: number;
    event?: string;
    name?: string;
    properties?: any;
    traits?: any;
    timestamp?: string;
    context?: any;
  }): Promise<void> {
    return this._fetcher.fetch({
      url: '/analytics',
      method: 'POST',
      body: data
    });
  }

  /**
   * Process to login of the corresponding user and return it.
   *
   * @param {Object} data
   * @returns {Promise<boolean>}
   */
  public login(data: {usernameOrEmail: string; password: string}): Promise<any> {
    const config: {url: string; method: 'POST'; body: any} = {
      url: '/auth/login',
      method: 'POST',
      body: data
    };

    if (this._clientState.user) {
      return this.logout()
        .then(() => {
          return this._fetcher.fetch(config);
        })
        .then((res: any) => {
          this._clientState.user = res;
          return this._clientState.user;
        });
    } else {
      return this._fetcher.fetch(config).then((res: any) => {
        this._clientState.user = res;
        return this._clientState.user;
      });
    }
  }

  public OAuthAuthentication(data: {code: string; state: string}): Promise<boolean> {
    return this._fetcher.fetch({
      url: '/auth/sso/return',
      method: 'GET',
      query: data
    });
  }

  /**
   * Clear the user session.
   *
   * @returns {Promise<string>}
   */
  public logout(): Promise<string> {
    return this._fetcher
      .fetch({
        url: '/auth/logout',
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
   * @param {Object} data
   * @returns {Promise<IFullUser>}
   */
  public updateCurrentUser(data: {
    id: number;
    username?: string;
    email?: string;
    password?: string;
    preferences?: any;
  }): Promise<IFullUser> {
    return this._fetcher
      .fetch({
        url: '/auth/me',
        method: 'PATCH',
        body: data
      })
      .then((res: IFullUser) => {
        this._clientState.user = res;
        return this._clientState.user;
      });
  }

  /**
   * Get the source list and set the currentSource to the first source connected
   *
   * @returns {Promise<any>}
   */
  public async initSources(data?: {withStyles?: boolean; withCaptions?: boolean}
  ): Promise<Success<IUserDataSource> | Unauthorized | InvalidParameter> {
    const response = await this.dataSource.getUserDataSources(data);
    if (response.isSuccess()) {
      return new Success(await this
        .storeDefaultCurrentSource(response.response!.sources));
    }
    return response;
  }

  /**
   * Set the currentSource
   *
   * @param {Array<Object>}sourceList
   * @return {IDataSource}
   */
  public storeDefaultCurrentSource(sourceList: IUserDataSource[]
  ): IUserDataSource {
    for (const sourceState of sourceList) {
      if (this.storeSource(sourceState, 'connected', true)) {
        return this._clientState.currentSource;
      } else {
        this._clientState.currentSource = {
          name: sourceList[0].name,
          key: sourceList[0].key,
          configIndex: sourceList[0].configIndex,
          connected: sourceList[0].connected,
          state: sourceList[0].state,
          reason: sourceList[0].reason,
          error: sourceList[0].error,
          features: sourceList[0].features,
          settings: sourceList[0].settings
        };
      }
    }
    return sourceList[0];
  }

  /**
   * Set the currentSource
   *
   * @param {Object} source
   * @returns {Promise<IUserDataSource>}
   */
  public setCurrentSource(source: IUserDataSource): void {
    this._clientState.currentSource = {
      name: source.name,
      key: source.key,
      configIndex: source.configIndex,
      connected: source.connected,
      state: source.state,
      reason: source.reason,
      error: source.error,
      features: source.features,
      settings: source.settings
    };
  }

  /**
   * Process to login and set the default source state and return the REST client state.
   *
   * @param {Object} data
   * @returns {Promise<IClientState>}
   */
  public init(data: {usernameOrEmail: string; password: string}): Promise<IClientState> {
    return this.login(data)
      .then(() => {
        return this.initSources();
      })
      .then(() => {
        return this._clientState;
      });
  }

  /**
   * Get the status of the Linkurious API.
   *
   * @returns {Promise<IAppStatus>}
   */
  public getAppStatus(): Promise<IAppStatus> {
    return this._fetcher
      .fetch({
        url: '/status',
        method: 'GET'
      })
      .then((res: any) => {
        return res.status;
      });
  }

  /**
   * Get Linkurious' current version information
   *
   * @returns {Promise<IAppVersion>}
   */
  public getAppVersion(): Promise<IAppVersion> {
    return this._fetcher.fetch({
      method: 'GET',
      url: '/version'
    });
  }

  /**
   * Return a sorted list of files stored on server
   *
   * @param {any} data
   * @returns {Promise<any>}
   */
  public getCustomFiles(data?: {
    root?: string;
    extensions?: string;
  }): Promise<{results: Array<{path: string; name: 'string'}>}> {
    return this._fetcher.fetch({
      method: 'GET',
      query: data,
      url: '/customFiles'
    });
  }

  /**
   * Restart the server and send the new URL
   */
  public restartServer(): Promise<string> {
    return this._fetcher
      .fetch({
        method: 'POST',
        url: '/admin/restart'
      })
      .then((response: any) => response.url);
  }

  public track(data: any): Promise<any> {
    return this._fetcher.fetch({
      method: 'POST',
      url: '/track',
      body: data
    });
  }

  /**
   * Store a source in clientState if condition is verified
   *
   * @param {IUserDataSource} source
   * @param {string} property
   * @param {string|number|boolean} matchValue
   * @returns {IUserDataSource}
   */
  private storeSource(
    source: IUserDataSource,
    property: string,
    matchValue: string | number | boolean
  ): IUserDataSource | undefined {
    if ((source as any)[property] === matchValue) {
      this._clientState.currentSource = {
        name: source.name,
        key: source.key,
        configIndex: source.configIndex,
        connected: source.connected,
        state: source.state,
        reason: source.reason,
        error: source.error,
        features: source.features,
        settings: source.settings
      };
      return this._clientState.currentSource;
    } else {
      return undefined;
    }
  }
}
