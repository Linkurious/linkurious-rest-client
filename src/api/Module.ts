/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-26.
 */

import {ErrorListener} from './errorListener';
import {
  ILkError,
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
  readonly props: ModuleProps;

  constructor(moduleConfig?: ModuleProps) {
    this.props = moduleConfig || {
      baseUrl: '/api',
      agent: request,
      clientState: {},
      dispatchError: (() => {})
    }
  }

  protected async request<C extends LkResponse>(rawFetchConfig: RawFetchConfig): Promise<C> {
    // 1) Sanitize config
    let fetchConfig: FetchConfig;
    try {
      fetchConfig = this.sanitizeConfig(rawFetchConfig);
    } catch (e) {
      return this.dispatchErrorAndReturn({
        key: LkErrorKey.BAD_FETCH_CONFIG,
        message: `You need to set "${e.pathParamKey}" to fetch this API (${rawFetchConfig.url}).`,
        rawFetchConfig: rawFetchConfig
      }) as C;
    }

    // 2) Make HTTP request
    let response: request.Response;
    try {
      response = await this.props.agent(fetchConfig.method, fetchConfig.url)
        .withCredentials()
        .send(fetchConfig.body)
        .query(fetchConfig.query);
    } catch (_) {
      return this.dispatchErrorAndReturn({
        key: LkErrorKey.CONNECTION_REFUSED,
        message: 'offline',
        fetchConfig: fetchConfig
      }) as C;
    }

    // 3) Dispatch server Errors
    if (response.body.key in LkErrorKey) {
      this.props.dispatchError(response.body.key, {
        serverError: response.body,
        fetchConfig: fetchConfig
      });
    }

    return new LkResponse({
      status: response.status,
      header: response.header,
      body: response.body
    }) as C;
  }

  private dispatchErrorAndReturn<E extends ILkError>(error: E) {
    this.props.dispatchError(error.key, error);
    return new LkResponse({body: error});
  }

  private sanitizeConfig(config: RawFetchConfig): FetchConfig {
    const {params, url} = this.renderURl(config.url, config.params);
    delete config.params;

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

  private renderURl(templateURL: string, params?: Record<string, unknown>) {
    const copiedParams = params ? {...params} : {};
    let renderedURL = templateURL;
    // Iterate over path params in route-like format `/:id/`
    const regexp: RegExp = /(?<=:)[^/]+(?=\/)/g;
    let match;
    while ((match = regexp.exec(renderedURL)) !== null) {
      const key = match[0];
      let paramValue = this.getValueFromClientState({paramKey: key});

      // Take path param values from `config.params`
      if (copiedParams[key]) {
        paramValue = !paramValue && copiedParams[key];
        delete copiedParams[key];
      }

      // Replace param in url template
      if (paramValue) {
        renderedURL = renderedURL.replace(':' + key, encodeURIComponent(paramValue as string));
      } else {
        throw {pathParamKey: key};
      }
    }
    return {
      params: copiedParams,
      url: renderedURL
    };
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

  private getValueFromClientState(props: {paramKey: string}): unknown {
    const SOURCE_KEY_PATH_PARAM = 'sourceKey';
    const SOURCE_INDEX_PATH_PARAM = 'sourceIndex';

    let paramValue;
    switch (props.paramKey) {
      case SOURCE_KEY_PATH_PARAM: {
        paramValue = this.props.clientState.currentSource &&
          this.props.clientState.currentSource.key &&
          this.getDataSourcePropertyValue('key');
        break;
      }
      case SOURCE_INDEX_PATH_PARAM: {
        paramValue = this.props.clientState.currentSource &&
          this.props.clientState.currentSource.configIndex &&
          this.getDataSourcePropertyValue('configIndex');
        break;
      }
      default: {
        break;
      }
    }

    return paramValue;
  }

  private getDataSourcePropertyValue(key: keyof IUserDataSource): unknown {
    const source = LinkuriousRestClient.getCurrentSource(
      this.props.clientState.sources || [],
      this.props.clientState.user && this.props.clientState.user.id
    );
    return source && source[key];
  }
}
