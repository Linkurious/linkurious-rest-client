/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-25.
 */

import * as request from 'superagent';

import {IUserDataSource} from './api/DataSource';

import {IClientState, ModuleProps} from './http/types';
import {LkErrorKey} from './http/response';
import {ErrorListener} from './errorListener';
import {LinkuriousAPI} from './api/Linkurious';
import {GraphSchemaAPI} from './api/GraphSchema';
import {GraphNodeAPI} from './api/GraphNode';
import {GraphEdgeAPI} from './api/GraphEdge';
import {AlertsAPI} from './api/Alerts';
import {CustomActionAPI} from './api/CustomAction';
import {DataSourceAPI} from './api/DataSource';
import {AuthAPI} from './api/Auth';

export class LinkuriousRestClient extends ErrorListener {
  private readonly moduleProps: ModuleProps;

  linkurious: LinkuriousAPI;
  graphSchema: GraphSchemaAPI;
  graphNode: GraphNodeAPI;
  graphEdge: GraphEdgeAPI;
  alerts: AlertsAPI;
  customAction: CustomActionAPI;
  auth: AuthAPI;
  dataSource: DataSourceAPI;

  constructor(props?: {baseUrl?: string; agent?: request.SuperAgentStatic}) {
    super();
    this.moduleProps = {
      baseUrl: props
        ? props.baseUrl && props.baseUrl.endsWith('/')
          ? props.baseUrl + 'api'
          : props.baseUrl + '/api'
        : '/api',
      agent: (props && props.agent) || request.agent(),
      clientState: {},
      dispatchError: (key: LkErrorKey, payload: unknown): void => this.dispatchError(key, payload)
    };
    this.linkurious = new LinkuriousAPI(this.moduleProps);
    this.graphSchema = new GraphSchemaAPI(this.moduleProps);
    this.graphNode = new GraphNodeAPI(this.moduleProps);
    this.graphEdge = new GraphEdgeAPI(this.moduleProps);
    this.alerts = new AlertsAPI(this.moduleProps);
    this.customAction = new CustomActionAPI(this.moduleProps);
    this.auth = new AuthAPI(this.moduleProps);
    this.dataSource = new DataSourceAPI(this.moduleProps);
  }

  get clientState(): IClientState {
    return this.moduleProps.clientState;
  }

  /**
   * Process to login and set the default source state and return the REST client state.
   *
   * @param {Object} data
   * @returns {Promise<IClientState>}
   */
  async init(data: {usernameOrEmail: string; password: string}): Promise<void> {
    await this.auth.login(data);
    await this.dataSource.getDataSourcesStatus({
      withCaptions: true,
      withStyles: true
    });
  }

  /*
     TODO: Update sources in I add it to
      [ ] `admin.deleteFullDataSource()`,
      [ ] `admin.deleteDataSourceConfig()` and
      [X] `getUserDataSources()`
   */

  /*
    throws Error
   */
  static getCurrentSource(
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
