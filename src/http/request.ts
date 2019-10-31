/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-26.
 */

import {Response as SuperAgentResponse} from 'superagent';

import {RestClient} from '../index';
import {GenericObject} from '../api/commonTypes';

import {ConnectionRefused, ErrorResponses, LkErrorKey, Response} from './response';
import {ModuleProps, RawFetchConfig, FetchConfig} from './types';

export abstract class Request {
  constructor(protected readonly props: ModuleProps) {}

  /*
    In `request<S, E extends LkErrorKey>(...)` we want S to be explicit and E to be inferred,
    to do so in TS is not possible today, so `handle` is a workaround for this issue.
    There is an issue and a PR about it: https://github.com/microsoft/TypeScript/issues/10571
   */
  protected handle<E extends LkErrorKey>(...errors: E[]) {
    return {
      request: <S = void>(raw: RawFetchConfig) => this.request<S, E>({errors: errors, ...raw})
    };
  }

  /**
   * Render `config.url` using `config.params` and set optional properties to default values
   */
  private static renderURL(
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

      // 2) Get `sourceKey` value from the ClientState or from the local storage
      if (key === 'sourceKey') {
        paramValue =
          (moduleProps.clientState.currentSource && moduleProps.clientState.currentSource.key) ||
          RestClient.getCurrentSource(
            moduleProps.clientState.sources || [],
            moduleProps.clientState.user && {userId: moduleProps.clientState.user.id}
          ).key;
      }

      // 3) Get other param values using `configParams`
      // @ts-ignore
      if (configParams[key] !== undefined) {
        // @ts-ignore
        paramValue = configParams[key];
        // @ts-ignore
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
      params: configParams
    };
  }

  /**
   * Return object in input with keys transformed from camelCase to snake_case
   */
  public static toSnakeCaseKeys(obj: GenericObject) {
    const result: GenericObject = {};
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
   * Sort `config.params` into `config.body` and `config.query`
   * and set `guest` and `_` query params.
   */
  public static splitParams(
    config: Required<RawFetchConfig>,
    moduleProps: ModuleProps
  ): FetchConfig {
    // 1) Default values for `body` and `query`
    let body: GenericObject | undefined;
    let query: GenericObject = {
      _: Date.now(),
      guest: moduleProps.clientState.guestMode ? true : undefined
    };

    // 2) Split params into `body` and `query` depending on the method
    if (['GET', 'DELETE'].includes(config.method)) {
      query = {...query, ...config.params};
    } else {
      body = config.params;
    }

    // 3) Return a valid fetch config
    return {
      method: config.method,
      url: moduleProps.baseUrl + config.url,
      body: body,
      query: Request.toSnakeCaseKeys(query)
    };
  }

  protected async request<S = void, EK extends LkErrorKey = LkErrorKey.CONNECTION_REFUSED>(
    rawFetchConfig: RawFetchConfig
  ) {
    // 1) Render URL template using params
    const requiredConfig = Request.renderURL(rawFetchConfig, this.props);

    // 2) Sort remaining params into body and query
    const fetchConfig = Request.splitParams(requiredConfig, this.props);

    // 3) Make the HTTP request
    let response: SuperAgentResponse;
    try {
      response = await this.props.agent[
        fetchConfig.method.toLowerCase() as 'get' | 'delete' | 'post' | 'put' | 'patch'
      ](fetchConfig.url)
        .ok(res => res.status < 500)
        .withCredentials()
        .send(fetchConfig.body)
        .query(fetchConfig.query);
    } catch (ex) {
      // 4.a) Return error when there is no connection
      if (!ex.response) {
        const error: ConnectionRefused = {
          key: LkErrorKey.CONNECTION_REFUSED,
          message: 'offline',
          fetchConfig: fetchConfig
        };
        this.props.dispatchError(error.key, error);
        return new Response({body: error});
      }

      // 4.b) Throw error if status code is 5xx
      throw new Error('Internal server error: ' + JSON.stringify(ex.response.body));
    }

    if (response.body.key in requiredConfig.errors) {
      // 4.c) Dispatch server error if expected
      this.props.dispatchError(response.body.key, {
        serverError: response.body,
        fetchConfig: fetchConfig
      });

      return new Response({
        status: response.status,
        header: response.header,
        body: response.body
      }) as ErrorResponses<EK>;
    } else if (response.body.key) {
      // 4.d) Throw error if unexpected
      throw new Error('Unexpected error: ' + JSON.stringify(response.body));
    }

    // 4.e) Return the success
    return new Response({
      status: response.status,
      header: response.header,
      body: response.body
    }) as Response<S>;
  }
}
