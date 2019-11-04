/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-25.
 */

import * as request from 'superagent';

import {ClientState, ModuleProps} from './http/types';
import {LkErrorKey, LkErrorKeyToInterface} from './http/response';
import {ErrorListener} from './errorListener';
import {AlertsAPI} from './api/Alerts';
import {ApplicationsAPI} from './api/Applications';
import {AuthAPI} from './api/Auth';
import {CustomActionAPI} from './api/CustomAction';
import {DataSourceAPI, IUserDataSource} from './api/DataSource';
import {GraphAPI} from './api/Graph';
import {GraphEdgeAPI} from './api/GraphEdge';
import {GraphNodeAPI} from './api/GraphNode';
import {GraphQueryAPI} from './api/GraphQuery';
import {GraphSchemaAPI} from './api/GraphSchema';
import {LinkuriousAPI} from './api/Linkurious';
import {UserAPI} from './api/User';
import {VisualizationAPI} from './api/Visualization';

export class RestClient extends ErrorListener {
  private readonly moduleProps: ModuleProps;

  public readonly alerts: AlertsAPI;
  public readonly applications: ApplicationsAPI;
  public readonly auth: AuthAPI;
  public readonly customAction: CustomActionAPI;
  public readonly dataSource: DataSourceAPI;
  public readonly graph: GraphAPI;
  public readonly graphEdge: GraphEdgeAPI;
  public readonly graphNode: GraphNodeAPI;
  public readonly graphQuery: GraphQueryAPI;
  public readonly graphSchema: GraphSchemaAPI;
  public readonly linkurious: LinkuriousAPI;
  public readonly user: UserAPI;
  public readonly visualization: VisualizationAPI;

  constructor(options?: {baseUrl?: string; agent?: request.SuperAgentStatic}) {
    super();

    this.moduleProps = {
      baseUrl: options
        ? options.baseUrl && options.baseUrl.endsWith('/')
          ? options.baseUrl + 'api'
          : options.baseUrl + '/api'
        : '/api',
      agent: (options && options.agent) || request.agent(),
      clientState: {},
      dispatchError: <T extends LkErrorKey>(key: T, payload: LkErrorKeyToInterface[T]): void =>
        this.dispatchError(key, payload)
    };

    this.alerts = new AlertsAPI(this.moduleProps);
    this.applications = new ApplicationsAPI(this.moduleProps);
    this.auth = new AuthAPI(this.moduleProps);
    this.customAction = new CustomActionAPI(this.moduleProps);
    this.dataSource = new DataSourceAPI(this.moduleProps);
    this.graph = new GraphAPI(this.moduleProps);
    this.graphEdge = new GraphEdgeAPI(this.moduleProps);
    this.graphNode = new GraphNodeAPI(this.moduleProps);
    this.graphQuery = new GraphQueryAPI(this.moduleProps);
    this.graphSchema = new GraphSchemaAPI(this.moduleProps);
    this.linkurious = new LinkuriousAPI(this.moduleProps);
    this.user = new UserAPI(this.moduleProps);
    this.visualization = new VisualizationAPI(this.moduleProps);
  }

  public get clientState(): ClientState {
    return this.moduleProps.clientState;
  }

  /**
   * Login a user and populate the client state with the list of the data-sources.
   */
  public async init(data: {usernameOrEmail: string; password: string}): Promise<void> {
    await this.auth.login(data);
    await this.dataSource.getDataSourcesStatus({
      withCaptions: true,
      withStyles: true
    });
  }

  public static getCurrentSource(
    dataSources: IUserDataSource[],
    by?: {userId: number} | {sourceKey: string} | {configIndex: number}
  ): IUserDataSource {
    if (!dataSources.length) {
      throw new Error('RestClient::getCurrentSource - dataSources cannot be empty.');
    }

    if (by) {
      let source: IUserDataSource | undefined;
      if ('userId' in by) {
        // Return the last seen data-source by the current user if the data-source is connected
        try {
          const sourceKey = localStorage.getItem('lk-lastSeenSourceKey-' + by.userId);
          source = dataSources.find(s => s.connected && s.key === sourceKey);
        } catch (_) {
          source = undefined;
        }
      } else if ('sourceKey' in by) {
        // Return the data-source whose sourceKey matches sourceKey in input
        source = dataSources.find(s => s.connected && s.key === by.sourceKey);
      } else {
        // Return the data-source whose configIndex matches configIndex in input
        source = dataSources.find(s => s.connected && s.configIndex === by.configIndex);
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
