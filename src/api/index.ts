/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2016-04-25.
 */

import * as request from 'superagent';

import {ErrorListener} from './errorListener';

import {GraphSchemaModule} from './GraphSchema/module';
import {LinkuriousModule} from './Linkurious/module';
import {IUserDataSource} from "../models/DataSource";

import {ModuleProps, IClientState} from "./Module";

export class LinkuriousRestClient extends ErrorListener {
  private readonly moduleProps: ModuleProps;

  readonly linkurious: LinkuriousModule;
  readonly graphSchema: GraphSchemaModule;

  constructor(baseUrl: string, agent = request) {
    super();
    this.moduleProps = {
      baseUrl: baseUrl.endsWith('/') ? baseUrl + 'api' : baseUrl + '/api',
      agent: agent,
      clientState: {},
      dispatchError: this.dispatchError
    };
    this.linkurious = new LinkuriousModule(this.moduleProps);
    this.graphSchema = new GraphSchemaModule(this.moduleProps);
  }

  get clientState(): IClientState {
    return this.moduleProps.clientState;
  }

  /**
   * set guest mode
   */
  public setGuestMode(value: boolean): void {
    this.clientState.guestMode = value;
  }

  /**
   * remove user form state
   */
  public destroySession(): void {
    this.clientState.user = undefined;
  }

  /**
   * Set the currentSource
   *
   * @param {Array<Object>}sourceList
   * @return {IDataSource}
   */
  public storeDefaultCurrentSource(sourceList: IUserDataSource[]): IUserDataSource {
    for (const sourceState of sourceList) {
      if (this.storeSource(sourceState, 'connected', true)) {
        return this.moduleProps.clientState.currentSource as IUserDataSource;
      } else {
        this.clientState.currentSource = {
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
    this.clientState.currentSource = {
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
        return this.clientState;
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
      this.clientState.currentSource = {
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
      return this.clientState.currentSource;
    } else {
      return undefined;
    }
  }

  public static getCurrentSourceKey(dataSources: IUserDataSource[], userId?: number): IUserDataSource | undefined {
    // Return last seen dataSource by user in localstorage if it's connected
    if (userId) {
      try {
        const item: string | null = localStorage.getItem('lk-dataSource-lastSeen-' + userId);
        const parsedDataSource = JSON.parse(item + '');
        if (parsedDataSource.connected) {
          return parsedDataSource;
        }
      } catch (_) {}
    }

    // Return the first connected data-source
    for (let firstConnected of dataSources) {
      if(firstConnected.connected) {
        return firstConnected;
      }
    }

    // Return the first data-source
    return dataSources[0];
  }
}
