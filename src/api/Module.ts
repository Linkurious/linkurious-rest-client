/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-26.
 */

import {ErrorListener} from './errorListener';
import {
  ConnectionRefused,
  LkErrorKey,
  LkResponse
} from './response';
import * as request from "superagent";

import {IFullUser, IUserDataSource} from "../../index";
import {LinkuriousRestClient} from "./index";
import {GenericObject} from "./commonTypes";

export type RawFetchConfig = {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  params?: GenericObject<any>;
  query?: Record<string, unknown>;
}

export interface FetchConfig {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  body: Record<string, unknown>;
  query: Record<string, unknown>;
}

export interface IClientState {
  user?: IFullUser;
  currentSource?: IUserDataSource;
  guestMode?: boolean;
  sources?: IUserDataSource[];
}

// Because it's easier to pass the same params to all the modules
export interface ModuleProps {
  baseUrl: string,
  agent: request.SuperAgentStatic,
  clientState: IClientState,
  dispatchError: ErrorListener['dispatchError']
}

export abstract class Module {

  constructor(private readonly props: ModuleProps) {}

  // It can throw from RestClient::getCurrentSource or Module::renderURL
  protected async request<C extends LkResponse>(rawFetchConfig: RawFetchConfig): Promise<C> {
    // 1) Sanitize config
    let fetchConfig: FetchConfig;
    fetchConfig = this.sanitizeConfig(rawFetchConfig);

    // 2) Make HTTP request
    let response: request.Response;
    try {
      response = await this.props.agent(fetchConfig.method, fetchConfig.url)
        .withCredentials()
        .send(fetchConfig.body)
        .query(fetchConfig.query);
    } catch (_) {
      const error: ConnectionRefused = {
        key: LkErrorKey.CONNECTION_REFUSED,
        message: 'offline',
        fetchConfig: fetchConfig
      };
      this.props.dispatchError(error.key, error);
      return new LkResponse({body: error}) as C;
    }

    // 3) Dispatch server errors
    if (response.body.key in LkErrorKey) {
      this.props.dispatchError(response.body.key, {
        serverError: response.body,
        fetchConfig: fetchConfig
      });
    }

    // 4) Return server response yay
    return new LkResponse({
      status: response.status,
      header: response.header,
      body: response.body
    }) as C;
  }

  private sanitizeConfig(config: RawFetchConfig): FetchConfig {
    const {params, url} = this.renderURl(config);

    // Sort remaining params into query and body
    let body: Record<string, unknown> = {};
    let query: Record<string, unknown> = {
      _: Date.now(),
      guest: this.props.clientState.guestMode ? true : undefined
    };
    if (['GET', 'DELETE'].includes(config.method)) {
      query = {...query, ...params};
    } else if (!config.query) {
      body = params;
    } else {
      for (const key in params) {
        if (config.query[key]) {
          query[key] = config.query[key];
        } else {
          body[key] = params[key];
        }
      }
    }

    return {method: config.method, url: this.props.baseUrl + url, body, query: Module.toSnakeCaseKeys(query)};
  }

  private static toSnakeCaseKeys(obj: Record<string, unknown>) {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      const fixedKey = key
        .replace(/(^[A-Z])/, (first) => first.toLowerCase())
        .replace(/(?<=_)([A-Z])/g, (letter) => letter.toLowerCase())
        .replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);
      result[fixedKey] = obj[key];
    }
    return result;
  }

  private renderURl(config: RawFetchConfig) {
    const copiedParams = config.params ? {...config.params} : {};
    let renderedURL = config.url;
    // Iterate over path params in route-like format `/:id/`
    const regexp: RegExp = /(?<=:)[^/]+(?=\/)/g;
    let match;
    while ((match = regexp.exec(renderedURL)) !== null) {
      const key = match[0];
      let paramValue;

      // Get `sourceKey` value
      if (key === 'sourceKey') {
        paramValue = this.props.clientState.currentSource &&
          this.props.clientState.currentSource.key ||
          LinkuriousRestClient.getCurrentSource(
            this.props.clientState.sources || [],
            this.props.clientState.user && {userId: this.props.clientState.user.id}
          ).key;
      }

      // Take path param values from `config.params`
      if (copiedParams[key]) {
        paramValue = !paramValue && copiedParams[key];
        delete copiedParams[key];
      }

      // Replace param in url template
      if (paramValue) {
        renderedURL = renderedURL.replace(':' + key, encodeURIComponent(paramValue as string));
      } else {
        throw new Error(`Module::renderURL - You need to set "${key}" to fetch this API (${renderedURL}).`);
      }
    }
    return {
      params: copiedParams,
      url: renderedURL
    };
  }
}
