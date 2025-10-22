/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-26.
 */

import {InternalServerError, UnexpectedServerError} from '../errorListener';
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
import {FetchConfig, ModuleProps, RawFetchConfig, SendBeaconConfig} from './types';

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
      if (hasValue(configParams[key])) {
        paramValue = configParams[key] as string;
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
   * Format supplied object into a query string.
   */
  private static formatQuery(obj: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    for (const [key, values] of Object.entries(obj).filter(([, value]) => hasValue(value))) {
      const fixedKey = key
        .replace(/(^[A-Z])/, (first) => first.toLowerCase())
        .replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);

      for (const value of Array.isArray(values) ? values : [values]) {
        searchParams.append(fixedKey, String(value));
      }
    }
    return searchParams.toString();
  }

  /**
   * Sort `config.params` into `config.body` and `config.query`
   * and set `guest` and `_` query params.
   */
  private static splitParams(
    config: Required<RawFetchConfig>,
    moduleProps: ModuleProps
  ): FetchConfig {
    // 1) Default values for `body` and `query`
    let body: Record<string, unknown> | undefined;
    let query: Record<string, unknown> = {
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
      url: moduleProps.baseUrl + config.url + '?' + Request.formatQuery(query),
      body: body
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
    let response: Response<S>;
    try {
      response = await this.props.agent.fetch(fetchConfig);
    } catch (ex) {
      const error: ConnectionRefusedError = {
        key: LkErrorKey.CONNECTION_REFUSED,
        message: 'offline',
        fetchConfig: fetchConfig
      };
      this.props.dispatchError(error.key, error);
      return new Response({body: error});
    }

    if (response.status >= 500) {
      throw new InternalServerError(response);
    }

    // From here we only deal with responses with status code lower than 500
    if (this.isLkError(response.body)) {
      if (includes(requiredConfig.errors, response.body.key)) {
        // Dispatch server error if expected
        this.props.dispatchError(
          response.body.key,
          response.body as LkErrorKeyToInterface[LkErrorKey]
        );

        return response as unknown as ErrorResponses<EK>;
      } else if (response.status < 200 || response.status >= 300) {
        // Throw error if unexpected
        throw new UnexpectedServerError(response as Response<LkError>);
      }
    }

    // Throw error if unexpected status code
    if (!includes([200, 201, 204], response.status)) {
      throw new Error(
        `Unexpected status code "${response.status}": ${JSON.stringify(response.body)}`
      );
    }

    // Return the success
    return response;
  }

  private isLkError(body: unknown): body is LkError {
    return (
      body !== null &&
      typeof body === 'object' &&
      'key' in body &&
      typeof body.key === 'string' &&
      'message' in body &&
      typeof body.message === 'string'
    );
  }

  private isDataSourceUnavailableError(error: unknown): error is DataSourceUnavailableError {
    return this.isLkError(error) && error.key === LkErrorKey.DATA_SOURCE_UNAVAILABLE;
  }
}
