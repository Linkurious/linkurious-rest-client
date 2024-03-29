/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-26.
 */

import {UnexpectedServerError} from '../errorListener';
import {GenericObject} from '../api/commonTypes';
import {hasValue, includes} from '../utils';

import {
  ConnectionRefusedError,
  DataSourceUnavailableError,
  ErrorResponses,
  LkError,
  LkErrorKey,
  LkErrorKeyToInterface,
  Response
} from './response';
import {
  FetchConfig,
  ModuleProps,
  RawFetchConfig,
  SendBeaconConfig,
  SuperAgentResponse
} from './types';

export abstract class Request<S = undefined> {
  constructor(public readonly props: ModuleProps) {}

  /**
   * Render `config.url` using `config.params`
   * and subtract the params used from `config.params`.
   */
  private static renderURL(
    config: RawFetchConfig<LkErrorKey, Record<string, unknown>>,
    moduleProps: ModuleProps
  ): Required<RawFetchConfig> {
    // 1) Iterate over path params in route-like format `/:id/`
    const configParams = config.params ? {...config.params} : {};
    let renderedURL = config.url;
    const regexp = /:[^/]+/g;
    let match;
    while ((match = regexp.exec(config.url)) !== null) {
      const key = match[0].substring(1);
      let paramValue: string | undefined;

      // 2) Get `sourceKey` value from the ClientState or from the local storage
      if (key === 'sourceKey' && moduleProps.clientState.currentSource) {
        if (hasValue(configParams['sourceKey']) && typeof configParams['sourceKey'] === 'string') {
          paramValue = configParams['sourceKey'];
        } else if (moduleProps.clientState.currentSource.key) {
          paramValue = moduleProps.clientState.currentSource.key;
        } else {
          throw {
            key: LkErrorKey.DATA_SOURCE_UNAVAILABLE,
            message: `Current source "${moduleProps.clientState.currentSource.name}" is not ready.`
          };
        }
      }

      // 3) Get other param values using `configParams`
      // @ts-ignore
      if (hasValue(configParams[key])) {
        // @ts-ignore
        paramValue = configParams[key] as string;
        // @ts-ignore
        delete configParams[key];
      }

      // 4) Replace the value in the url
      if (hasValue(paramValue)) {
        renderedURL = renderedURL.replace(':' + key, encodeURIComponent(paramValue));
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
        .replace(/(^[A-Z])/, (first) => first.toLowerCase())
        .replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);
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
    if (includes(['GET', 'DELETE'], config.method)) {
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

  /**
   * Send a post request using the Navigator.sendBeacon api.
   * - Note that only url parameters are supported.
   * - The sendBeacon api does not return any response.
   */
  public async sendBeacon<EK extends LkErrorKey = never>(
    rawFetchConfig: SendBeaconConfig<EK>
  ): Promise<void> {
    // 1) Render URL template using params
    const requiredConfig = Request.renderURL(rawFetchConfig, this.props);

    // 2) Sort remaining params into body and query
    const fetchConfig = Request.splitParams(requiredConfig, this.props);
    navigator.sendBeacon(fetchConfig.url);
  }

  public async request<EK extends LkErrorKey = never>(rawFetchConfig: RawFetchConfig<EK>) {
    // 1) Render URL template using params
    let requiredConfig: Required<RawFetchConfig>;
    try {
      requiredConfig = Request.renderURL(rawFetchConfig, this.props);
    } catch (error) {
      if (this.isDataSourceUnavailableError(error)) {
        // 1.a) Return this when currentSource is not connected without performing an HTTP request
        this.props.dispatchError(error.key, error);
        return new Response({body: error}) as ErrorResponses<EK>;
      } else {
        // 1.b) Throw an exception when path params are missing
        throw error;
      }
    }

    // 2) Sort remaining params into body and query
    const fetchConfig = Request.splitParams(requiredConfig, this.props);

    // 3) Make the HTTP request
    let response: SuperAgentResponse;
    try {
      response = await this.props.agent[
        fetchConfig.method.toLowerCase() as 'get' | 'delete' | 'post' | 'put' | 'patch'
      ](fetchConfig.url)
        .ok((res) => res.status < 500)
        .withCredentials()
        .send(fetchConfig.body)
        .query(fetchConfig.query);
    } catch (ex) {
      // 4.a) Return error when there is no connection
      if (!this.hasResponse(ex)) {
        const error: ConnectionRefusedError = {
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

    // From here we only deal with responses with status code lower than 500
    if (response.body && includes(requiredConfig.errors, response.body.key)) {
      // 4.c) Dispatch server error if expected
      this.props.dispatchError(
        response.body.key as LkErrorKey,
        response.body as unknown as LkErrorKeyToInterface[LkErrorKey]
      );

      return new Response({
        status: response.status,
        header: response.header as unknown as GenericObject | undefined,
        body: response.body as unknown as LkErrorKeyToInterface[LkErrorKey]
      }) as ErrorResponses<EK>;
    } else if ((response.status < 200 || response.status >= 300) && response.body?.key) {
      // 4.d) Throw error if unexpected
      throw new UnexpectedServerError(response);
    }

    // 4.e) Throw error if unexpected status code
    if (!includes([200, 201, 204], response.status)) {
      throw new Error(
        `Unexpected status code "${response.status}": ${JSON.stringify(response.body)}`
      );
    }

    // 4.f) Return the success
    return new Response({
      status: response.status,
      header: response.header as unknown as GenericObject | undefined,
      body: response.body as unknown as S
    });
  }

  private isDataSourceUnavailableError(error: unknown): error is DataSourceUnavailableError {
    return (
      (error as LkError).key !== undefined &&
      (error as LkError).key === LkErrorKey.DATA_SOURCE_UNAVAILABLE
    );
  }

  private hasResponse<B>(error: unknown): error is {response: Response<B>} {
    return (error as {response: Response<B>}).response !== undefined;
  }
}
