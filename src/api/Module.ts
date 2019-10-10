/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-26.
 */

import {ErrorListener} from './errorListener';
import {
  LkErrorKey,
  LkGuards,
  ServerResponse,
  LkSuccessKey,
  Success
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

function toSnakeCaseKeys(obj: GenericObject<any>) {
  const result: GenericObject<any> = {};
  for (const key in obj) {
    const fixedKey = key
      .replace(/(^[A-Z])/, (first) => first.toLowerCase())
      .replace(/(?<=_)([A-Z])/g, (letter) => letter.toLowerCase())
      .replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);
    result[fixedKey] = obj[key];
  }
  return result;
}

const SOURCE_KEY_PATH_PARAM = 'sourceKey';
const SOURCE_INDEX_PATH_PARAM = 'sourceIndex';

/*
  Params:
    - _clientState from RestClient
    - baseURL from RestClient
    - Config from method

  Fills the url template with path params and clientState, throws error if a path param value is missing.
  Sorts the remaining params into query (keys as snake_case) and body params.
  Returns a fetch config.
 */
function sanitizeConfig(baseUrl: string, clientState: IClientState, config: RawFetchConfig): FetchConfig {
  const params: GenericObject<any> = config.params || {};
  delete config.params;
  const regexp: RegExp = /(?<=:)[^/]+(?=\/)/g;
  let match;
  while ((match = regexp.exec(config.url)) !== null) {
    const key = match[0];
    let paramValue;
    if (params[key]) {
      paramValue = params[key];
      delete params[key];
    }

    if (key === SOURCE_KEY_PATH_PARAM) {
      paramValue = clientState.currentSource && clientState.currentSource.key && clientState.currentSource.key;
    } else if (key === SOURCE_INDEX_PATH_PARAM ) {
      paramValue = clientState.currentSource && clientState.currentSource.configIndex;
    }

    if (paramValue) {
      config.url = config.url.replace(':' + key, encodeURIComponent(paramValue));
    } else {
      throw {
        key: LkErrorKey.BAD_FETCH_CONFIG,
        message: `You need to set "${key}" to fetch this API (${config.url}).`
      };
    }
  }

  let body: GenericObject<any> = {};
  let query: GenericObject<any> = {};
  let extraQuery: GenericObject<any> = {_: Date.now()};

  if (clientState.guestMode) {
    extraQuery.guest = true
  }

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

  return {...config, url: baseUrl + config.url, body, query: toSnakeCaseKeys(query)};
}

async function doFetch(responsePromise: Promise<request.Response>): Promise<Success['response']> {
  let response: request.Response;
  try {
    response = await responsePromise;
  } catch (_) {
    throw {
      message: 'offline',
      key: LkErrorKey.CONNECTION_REFUSED
    };
  }

  let body: Success['response'];
  try {
    body = JSON.parse(response.text); // E extends ILKError<LKErrorKey> | IAPIParams
  } catch (ex) {
    body = response.text;
  }

  if ((response.status < 100 || response.status >= 400) && LkGuards.isError(body)) {
    throw {
      message: body.message,
      key: body.key
    }; // Server errors
  }

  return body;
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

  protected async request<C extends ServerResponse<LkErrorKey | LkSuccessKey>>(rawConfig: RawFetchConfig): Promise<C> {

    let config: FetchConfig;
    try {
      config = sanitizeConfig(this.props.baseUrl, this.props.clientState, rawConfig);
    } catch (e) {
      this.props.dispatchError(e.key, {
        error: e,
        rawFetchConfig: rawConfig
      });
      return e;
    }

    // 2) Fetch:
    //   - Params:
    //     - Config from method
    //     - _agent from RestClient
    //   - Does:
    //     - Returns a promise of response
    const responsePromise = this.props.agent(config.method, config.url)
                              .withCredentials()
                              .send(config.body)
                              .query(config.query);

    let body: Success['response'];
    try {
      body = await doFetch(responsePromise);
    } catch (e) {
      this.props.dispatchError(e.key, {
        error: e,
        fetchConfig: config
      });
      return e;
    }

    let success: Success = {
      key: LkSuccessKey.SUCCESS,
      response: body
    };

    return success as ServerResponse<LkSuccessKey> as C;
  }
}
