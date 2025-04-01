/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-25.
 */

import * as request from 'superagent';

import {ClientState, ModuleProps} from './http/types';
import {LkErrorKey, LkErrorKeyToInterface} from './http/response';
import {ErrorListener} from './errorListener';
import {AccessRightAPI} from './api/AccessRight';
import {AlertAPI} from './api/Alert';
import {ApplicationAPI} from './api/Application';
import {AuthAPI} from './api/Auth';
import {ConfigAPI} from './api/Config';
import {CustomActionAPI} from './api/CustomAction';
import {DataSourceAPI, DataSourceUserInfo} from './api/DataSource';
import {FavoriteAPI} from './api/favorite';
import {GraphEdgeAPI} from './api/GraphEdge';
import {GraphNodeAPI} from './api/GraphNode';
import {GraphQueryAPI} from './api/GraphQuery';
import {GraphSchemaAPI} from './api/GraphSchema';
import {LicenseAPI} from './api/License';
import {LinkuriousAPI} from './api/Linkurious';
import {PluginAPI} from './api/Plugin';
import {SearchAPI} from './api/Search';
import {UserAPI} from './api/User';
import {VisualizationAPI} from './api/Visualization';
import {WebhookAPI} from './api/webhook';
import {endsWith, find} from './utils';
import {MailerAPI} from './api/mailer';
import {SpacesAPI} from './api/spaces';
import {NodeGroupingAPI} from './api/nodeGrouping';
import {TagAPI} from './api/Tag';
import {EntityResolutionAPI} from './api/entityResolution';

export class RestClient extends ErrorListener {
  public readonly clientState: ClientState;
  public readonly moduleProps: ModuleProps;

  public readonly accessRight: AccessRightAPI;
  public readonly alert: AlertAPI;
  public readonly application: ApplicationAPI;
  public readonly auth: AuthAPI;
  public readonly config: ConfigAPI;
  public readonly customAction: CustomActionAPI;
  public readonly dataSource: DataSourceAPI;
  public readonly favorite: FavoriteAPI;
  public readonly graphEdge: GraphEdgeAPI;
  public readonly graphNode: GraphNodeAPI;
  public readonly graphQuery: GraphQueryAPI;
  public readonly graphSchema: GraphSchemaAPI;
  public readonly license: LicenseAPI;
  public readonly linkurious: LinkuriousAPI;
  public readonly plugin: PluginAPI;
  public readonly search: SearchAPI;
  public readonly mailer: MailerAPI;
  public readonly user: UserAPI;
  public readonly visualization: VisualizationAPI;
  public readonly webhook: WebhookAPI;
  public readonly spaces: SpacesAPI;
  public readonly nodeGrouping: NodeGroupingAPI;
  public readonly tag: TagAPI;
  public readonly entityResolution: EntityResolutionAPI;

  constructor(options?: {baseUrl?: string; agent?: request.SuperAgentStatic}) {
    super();

    this.clientState = {};
    this.moduleProps = {
      baseUrl: options?.baseUrl
        ? endsWith(options.baseUrl, '/')
          ? options.baseUrl + 'api'
          : options.baseUrl + '/api'
        : '/api',
      agent: (options && options.agent) || request.agent(),
      clientState: this.clientState,
      dispatchError: <T extends LkErrorKey>(key: T, payload: LkErrorKeyToInterface[T]): void =>
        this.dispatchError(key, payload)
    };

    this.accessRight = new AccessRightAPI(this.moduleProps);
    this.alert = new AlertAPI(this.moduleProps);
    this.application = new ApplicationAPI(this.moduleProps);
    this.auth = new AuthAPI(this.moduleProps);
    this.config = new ConfigAPI(this.moduleProps);
    this.customAction = new CustomActionAPI(this.moduleProps);
    this.dataSource = new DataSourceAPI(this.moduleProps);
    this.favorite = new FavoriteAPI(this.moduleProps);
    this.graphEdge = new GraphEdgeAPI(this.moduleProps);
    this.graphNode = new GraphNodeAPI(this.moduleProps);
    this.graphQuery = new GraphQueryAPI(this.moduleProps);
    this.graphSchema = new GraphSchemaAPI(this.moduleProps);
    this.license = new LicenseAPI(this.moduleProps);
    this.linkurious = new LinkuriousAPI(this.moduleProps);
    this.plugin = new PluginAPI(this.moduleProps);
    this.search = new SearchAPI(this.moduleProps);
    this.mailer = new MailerAPI(this.moduleProps);
    this.user = new UserAPI(this.moduleProps);
    this.visualization = new VisualizationAPI(this.moduleProps);
    this.webhook = new WebhookAPI(this.moduleProps);
    this.spaces = new SpacesAPI(this.moduleProps);
    this.nodeGrouping = new NodeGroupingAPI(this.moduleProps);
    this.tag = new TagAPI(this.moduleProps);
    this.entityResolution = new EntityResolutionAPI(this.moduleProps);
  }

  /**
   * Login a user and populate the client state with the list of the data-sources.
   */
  public async init(data: {usernameOrEmail: string; password: string}): Promise<void> {
    await this.auth.login(data);
    await this.dataSource.getDataSources({
      withCaptions: true,
      withStyles: true
    });
  }

  public setGuestMode(guestMode: boolean) {
    this.clientState.guestMode = guestMode;
  }

  public setCurrentSource(dataSource: DataSourceUserInfo) {
    this.clientState.currentSource = dataSource;
    try {
      if (dataSource.key && this.clientState.user) {
        localStorage.setItem(`lk-lastSeenSourceKey-${this.clientState.user.id}`, dataSource.key);
      }
    } catch (_) {
      // Silently fail if localStorage is not supported
    }
  }

  public static getCurrentSource(
    dataSources: DataSourceUserInfo[],
    by?: {userId: number} | {sourceKey: string} | {configIndex: number},
    storage?: Storage
  ): DataSourceUserInfo {
    if (dataSources.length === 0) {
      throw new Error('RestClient::getCurrentSource - dataSources cannot be empty.');
    }

    if (by) {
      let source: DataSourceUserInfo | undefined;
      if ('userId' in by) {
        // Return the last seen data-source by the current user if the data-source is connected
        try {
          const sourceKey = (storage || localStorage).getItem(`lk-lastSeenSourceKey-${by.userId}`);
          source = find(dataSources, (s) => s.connected && s.key === sourceKey);
        } catch (_) {
          source = undefined;
        }
      } else if ('sourceKey' in by) {
        // Return the data-source whose sourceKey matches sourceKey in input
        source = find(dataSources, (s) => s.key === by.sourceKey);
      } else {
        // Return the data-source whose configIndex matches configIndex in input
        source = find(dataSources, (s) => s.configIndex === by.configIndex);
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
