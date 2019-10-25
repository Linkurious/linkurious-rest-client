/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-25.
 */

import * as request from 'superagent';

export * from './api/GraphItem/types';

import {IUserDataSource} from '../models/DataSource';

import {IClientState, ModuleProps} from './http/types';
import {LkErrorKey} from './http/response';
import {ErrorListener} from './errorListener';
import {LinkuriousAPI} from './api/Linkurious';
import {GraphSchemaAPI} from './api/GraphSchema';
import {CustomActionAPI} from './api/CustomAction';
import {DataSourceAPI} from './api/DataSource';
import {AuthAPI} from './api/Auth';

export class LinkuriousRestClient extends ErrorListener {
  private readonly moduleProps: ModuleProps;
  private readonly coreAgent: request.SuperAgentStatic;

  linkurious: LinkuriousAPI;
  graphSchema: GraphSchemaAPI;
  customAction: CustomActionAPI;
  auth: AuthAPI;
  dataSource: DataSourceAPI;

  constructor(props?: {baseUrl?: string; agent?: request.SuperAgentStatic}) {
    super();
    this.coreAgent = (props && props.agent) || request;
    this.moduleProps = {
      baseUrl: props
        ? props.baseUrl && props.baseUrl.endsWith('/')
          ? props.baseUrl + 'api'
          : props.baseUrl + '/api'
        : '/api',
      agent: () => this.coreAgent,
      clientState: {},
      dispatchError: (key: LkErrorKey, payload: unknown): void => this.dispatchError(key, payload)
    };
    this.linkurious = new LinkuriousAPI(this.moduleProps);
    this.graphSchema = new GraphSchemaAPI(this.moduleProps);
    this.customAction = new CustomActionAPI(this.moduleProps);
    this.auth = new AuthAPI(this.moduleProps);
    this.dataSource = new DataSourceAPI(this.moduleProps);
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

  // TODO: #102 Not used in frontend
  /**
   * Set the currentSource
   *
   * @param {Array<Object>}sourceList
   * @return {IDataSource}
   */
  public storeDefaultCurrentSource(sourceList: IUserDataSource[]): IUserDataSource {
    for (const source of sourceList) {
      if (source.connected) {
        this.clientState.currentSource = {...source};
        return this.moduleProps.clientState.currentSource as IUserDataSource;
      } else {
        this.clientState.currentSource = {...sourceList[0]};
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
    this.clientState.currentSource = {...source};
  }

  /**
   * Process to login and set the default source state and return the REST client state.
   *
   * @param {Object} data
   * @returns {Promise<IClientState>}
  public async init(data: {usernameOrEmail: string; password: string}): Promise<IClientState> {
    const response = await this.auth.login(data);
    const response2 = await this.initSources();
    return this.clientState;
  }
   */

  /*
     TODO: #102
      either frontend adds this in `src/app/services/sources/index/ts`:
      this.list$.subscribe((sources: Array<IDataSourceState>) => {
        this._sources = sources;
        this._restClient.setDataSources(sources) // <== New Line
      });
      or I add it to `admin.deleteFullDataSource()`, `admin.deleteDataSourceConfig()` and `getUserDataSources()`
   */
  public setDataSources(sources: IUserDataSource[]): void {
    this.clientState.sources = sources;
  }

  // TODO: #102
  /*
    throws Error
   */
  public static getCurrentSource(
    dataSources: IUserDataSource[],
    by?: {userId: number} | {sourceKey: string} | {sourceIndex: number}
  ): IUserDataSource {
    if (!dataSources.length) {
      throw new Error('RestClient::getCurrentSource - Datasources cannot be empty');
    }

    if (by) {
      let source: IUserDataSource | undefined;
      if ('userId' in by) {
        // Return last seen dataSource by user in localstorage if it's connected
        try {
          const sourceKey: string | null = localStorage.getItem(
            'lk-lastSeenSourceKey-' + by.userId
          );
          source = dataSources.find(s => s.connected && s.key === sourceKey);
        } catch (_) {
          source = undefined;
        }
      } else if ('sourceKey' in by) {
        // Return dataSource whose key matches sourceKey
        source = dataSources.find(s => s.connected && s.key === by.sourceKey);
      } else {
        // Return dataSource whose index matches configIndex
        source = dataSources.find(s => s.connected && s.configIndex === by.sourceIndex);
      }
      if (source) {
        return source;
      }
    }

    // Return the first connected data-source
    for (const firstConnected of dataSources) {
      if (firstConnected.connected) {
        return firstConnected;
      }
    }
    // Return the first data-source
    return dataSources[0];
  }
}
