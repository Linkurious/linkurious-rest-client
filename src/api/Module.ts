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
import {GenericObject} from "./commonTypes";
import * as request from "superagent";

import {IFullUser, IUserDataSource} from "../../index";
export type RawFetchConfig = {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  params?: GenericObject<any>;
  query?: GenericObject<any>;
}

export interface FetchConfig {
  url: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
  body: GenericObject<any>;
  query: GenericObject<any>;
}

export interface IClientState {
  user?: IFullUser;
  currentSource?: IUserDataSource;
  guestMode?: boolean;
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

    // Sanitize config
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

    // HTTP request
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

    // Dispatch server Errors
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
    const params = config.params || {};
    delete config.params;

    // Iterate over path params in route-like format `/:id/`
    const regexp: RegExp = /(?<=:)[^/]+(?=\/)/g;
    let match;
    while ((match = regexp.exec(config.url)) !== null) {
      const key = match[0];
      let paramValue = this.getValueFromClientState({paramKey: key});

      // Take path param values from `config.params`
      if (params[key]) {
        paramValue = !paramValue && params[key];
        delete params[key];
      }

      // Replace param
      if (paramValue) {
        config.url = config.url.replace(':' + key, encodeURIComponent(paramValue as string));
      } else {
        throw {pathParamKey: key};
      }
    }

    // Sort remaining params into query and body
    let body: GenericObject<unknown> = {};
    let query: GenericObject<unknown> = {};
    let extraQuery = {
      _: Date.now(),
      guest: this.props.clientState.guestMode ? true : undefined
    };
    if (['GET', 'DELETE'].includes(config.method)) {
      query = {...extraQuery, ...params};
    } else if (!config.query) {
      query = extraQuery;
      body = params;
    } else {
      query = {...extraQuery, ...config.query};
      for (const key in params) {
        if (!config.query[key]) {
          body[key] = params[key];
        }
      }
    }

    return {method: config.method, url: this.props.baseUrl + config.url, body, query: Module.toSnakeCaseKeys(query)};
  }

  private getValueFromClientState(props: {paramKey: string}): unknown {
    const SOURCE_KEY_PATH_PARAM = 'sourceKey';
    const SOURCE_INDEX_PATH_PARAM = 'sourceIndex';

    let paramValue: unknown;
    if (props.paramKey === SOURCE_KEY_PATH_PARAM) {
      paramValue = this.props.clientState.currentSource &&
        this.props.clientState.currentSource.key &&
        this.props.clientState.currentSource.key;
    } else if (props.paramKey === SOURCE_INDEX_PATH_PARAM ) {
      paramValue = this.props.clientState.currentSource && this.props.clientState.currentSource.configIndex;
    }
    return paramValue;
  }

  private static toSnakeCaseKeys(obj: GenericObject<unknown>) {
    const result: GenericObject<unknown> = {};
    for (const key in obj) {
      const fixedKey = key
        .replace(/(^[A-Z])/, (first) => first.toLowerCase())
        .replace(/(?<=_)([A-Z])/g, (letter) => letter.toLowerCase())
        .replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);
      result[fixedKey] = obj[key];
    }
    return result;
  }
}
