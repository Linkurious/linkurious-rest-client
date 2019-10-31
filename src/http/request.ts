/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-26.
 */
import {Response as SuperAgentResponse} from 'superagent';

import {RestClient} from '../index';

import {LkErrorKey, Response} from './response';
import {ConnectionRefused, ErrorResponses, ModuleProps, RawFetchConfig, FetchConfig} from './types';

export abstract class Request {
  constructor(protected readonly props: ModuleProps) {}

  /*
    In `request<S, E extends LkErrorKey>(...)` we want S to be explicit and E to be inferred,
    to do so in TS is not possible today, so `handle` is a workaround for that issue.
    There's an issue and PR about it: https://github.com/microsoft/TypeScript/issues/10571
   */
  protected handle<E extends LkErrorKey>(...errors: E[]) {
    return {
      request: <S = void>(raw: RawFetchConfig) => this.request<S, E>({errors: errors, ...raw})
    };
  }

  protected async request<S = void, EK extends LkErrorKey = LkErrorKey.CONNECTION_REFUSED>(
    rawFetchConfig: RawFetchConfig
  ) {
    // 1) Render URL template using params
    const requiredConfig = Request.renderURL(rawFetchConfig, this.props);

    // 2) Sort remaining params into body and query
    const fetchConfig = Request.splitParams(requiredConfig, this.props);

    // 3) Make HTTP request
    let response: SuperAgentResponse;
    try {
      // @ts-ignore
      response = await this.props.agent[fetchConfig.method.toLowerCase()](fetchConfig.url)
        .withCredentials()
        .send(fetchConfig.body)
        .query(fetchConfig.query);
    } catch (ex) {
      // 4) Return error when there is no internet
      if (!ex.response) {
        const error: ConnectionRefused = {
          key: LkErrorKey.CONNECTION_REFUSED,
          message: 'offline',
          fetchConfig: fetchConfig
        };
        this.props.dispatchError(error.key, error);
        return new Response({body: error});
      }
      // 5) Dispatch server errors and throw unexpected errors if any
      else {
        response = ex.response;
        if (response.body.key in requiredConfig.errors) {
          this.props.dispatchError(response.body.key, {
            serverError: response.body,
            fetchConfig: fetchConfig
          });
          return new Response({
            status: response.status,
            header: response.header,
            body: response.body
          }) as ErrorResponses<EK>;
        } else if (response.status < 200 && response.status >= 400) {
          throw new Error(
            'Unexpected error, you should add it to RestClient: ' + JSON.stringify(response.body)
          );
        }
      }
    }

    // 6) Return the success
    return new Response({
      status: response.status,
      header: response.header,
      body: response.body
    }) as Response<S>;
  }

  /**
   * Returns input obj with its keys as snakeCase
   */
  public static toSnakeCaseKeys(obj: Record<string, unknown>) {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      const fixedKey = key
        .replace(/(^[A-Z])/, first => first.toLowerCase())
        .replace(/(?<=_)([A-Z])/g, letter => letter.toLowerCase())
        .replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);
      result[fixedKey] = obj[key];
    }
    return result;
  }

  /**
   * Render `config.url` using `config.params`, and set optional properties to default values
   */
  public static renderURL(
    config: RawFetchConfig,
    moduleProps: ModuleProps
  ): Required<RawFetchConfig> {
    // 1) Iterate over path params in route-like format `/:id/`
    const configParams = config.params ? {...config.params} : {};
    let renderedURL = config.url;
    const regexp = /(?<=:)[^/]+/g;
    let match;
    while ((match = regexp.exec(renderedURL)) !== null) {
      const key = match[0];
      let paramValue;

      // 2) Get `sourceKey` value using ClientState
      if (key === 'sourceKey') {
        paramValue =
          (moduleProps.clientState.currentSource && moduleProps.clientState.currentSource.key) ||
          RestClient.getCurrentSource(
            moduleProps.clientState.sources || [],
            moduleProps.clientState.user && {userId: moduleProps.clientState.user.id}
          ).key;
      }

      // 3) Get other param values using `configParams`
      if (configParams[key] !== undefined) {
        paramValue = !paramValue && configParams[key];
        delete configParams[key];
      }

      // 4) Replace the value in the url
      if (paramValue !== undefined) {
        renderedURL = renderedURL.replace(':' + key, encodeURIComponent(paramValue as string));
      } else {
        throw new Error(
          `Request::renderURL - You need to set "${key}" to fetch this API (${renderedURL}).`
        );
      }
    }
    return {
      errors: config.errors || [],
      url: renderedURL,
      method: config.method,
      params: configParams,
      query: config.query || {}
    };
  }

  /**
   * Sort `config.params` into `config.body` and `config.query`
   */
  public static splitParams(
    config: Required<RawFetchConfig>,
    moduleProps: ModuleProps
  ): FetchConfig {
    // 1) Default values for `body` and `query`
    let body: Record<string, unknown> = {};
    let query: Record<string, unknown> = {
      _: Date.now(),
      guest: moduleProps.clientState.guestMode ? true : undefined
    };

    // 2) Split params into `body` and `query` depending on the method
    if (['GET', 'DELETE'].includes(config.method)) {
      query = {...query, ...config.params};
    } else if (!config.query) {
      body = config.params;
    } else {
      for (const key in config.params) {
        if (config.query[key]) {
          query[key] = config.query[key];
        } else {
          body[key] = config.params[key];
        }
      }
    }

    // 3) Return a valid fetch config
    return {
      method: config.method,
      url: moduleProps.baseUrl + config.url,
      body: body,
      query: Request.toSnakeCaseKeys(query)
    };
  }
}
