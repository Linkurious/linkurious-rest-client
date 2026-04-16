/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-26.
 */

import {InternalServerError, UnexpectedServerError} from '../errorListener';
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
import {FetchConfig, ModuleProps, RawFetchConfig, SendBeaconConfig} from './types';

class RestClientError extends Error {
  readonly key: LkErrorKey;

  constructor(params: {key: LkErrorKey; message: string}) {
    super(params.message);
    this.key = params.key;
  }
}

// create a new URL, and throw a more specific error message if the URL is invalid
function newURL(url: string, base?: string): URL {
  try {
    return new URL(url, base);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Invalid URL: ${url}`);
    }
    throw error;
  }
}

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
          throw new RestClientError({
            key: LkErrorKey.DATA_SOURCE_UNAVAILABLE,
            message: `Current source "${moduleProps.clientState.currentSource.name}" is not ready.`
          });
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
   * - Split `config.params` into body and query-string parameters depending on the HTTP method.
   * - Set `guest` and `_` query-string params.
   * - Normalize query-string params to snake_case, as this is what the Linkurious server expects.
   * - Construct the URL by merging `baseUrl`, `config.url` and the query-string parameters.
   */
  public static getFetchConfig(
    config: Required<RawFetchConfig>,
    moduleProps: ModuleProps,
    now: number = Date.now()
  ): FetchConfig {
    // 1. Default values for `body` and `query`
    let body: GenericObject | undefined;
    let query: GenericObject = {
      _: now,
      guest: moduleProps.clientState.guestMode ? true : undefined
    };

    // 2. Split params into `body` and `query` depending on the method
    if (includes(['GET', 'DELETE'], config.method)) {
      query = {...query, ...config.params};
    } else {
      body = config.params;
    }

    // 3. Normalize query-string params to snake_case, as this is what the Linkurious server expects
    const normalizedQuery = Request.toSnakeCaseKeys(query);

    // 4. Merge the query-string params into the URL
    // this can throw if the constructed URL is invalid (e.g. if baseUrl is not a valid URL)
    const url = this.getUrlWithQueryString(moduleProps.baseUrl + config.url, normalizedQuery);

    // 5. Return a valid fetch config
    return {
      // important: make sure the methods is uppercase, we had errors when using lowercase "patch"
      // see https://github.com/nodejs/undici/issues/1805#issuecomment-1344797706
      method: config.method.toUpperCase() as FetchConfig['method'],
      url: url,
      body: body
    };
  }

  private static getUrlWithQueryString(url: string, queryString: GenericObject): URL {
    const urlWithQueryString = newURL(url, globalThis.document?.baseURI);
    for (const [key, value] of Object.entries(queryString)) {
      if (value === undefined || value === null) {
        continue;
      }
      const valueAsArray = Array.isArray(value) ? value : [value];
      for (const v of valueAsArray) {
        urlWithQueryString.searchParams.append(key, String(v));
      }
    }
    return urlWithQueryString;
  }

  /**
   * Send a post request using the Navigator.sendBeacon api.
   * - Note that only url parameters are supported.
   * - The sendBeacon api does not return any response.
   *
   * This is useful to send a query while the page is closing (for example releasing a viz lock)
   */
  public async sendBeacon<EK extends LkErrorKey = never>(
    rawFetchConfig: SendBeaconConfig<EK>
  ): Promise<void> {
    // 1) Render URL template using params
    const requiredConfig = Request.renderURL(rawFetchConfig, this.props);

    // 2) Generate the clean fetch config
    const fetchConfig = Request.getFetchConfig(requiredConfig, this.props);

    // 3) Send the query
    navigator.sendBeacon(fetchConfig.url);
  }

  public async request<EK extends LkErrorKey = never>(rawFetchConfig: RawFetchConfig<EK>) {
    // 1) Render URL template using params
    let requiredConfig: Required<RawFetchConfig>;
    try {
      requiredConfig = Request.renderURL(rawFetchConfig, this.props);
    } catch (error) {
      if (this.isDataSourceUnavailableError(error)) {
        // Return this when currentSource is not connected without performing an HTTP request
        this.props.dispatchError(error.key, error);
        return new Response({body: error}) as ErrorResponses<EK>;
      } else {
        // Throw an exception when path params are missing
        throw error;
      }
    }

    // 2) generate the clean fetch config
    const fetchConfig = Request.getFetchConfig(requiredConfig, this.props);

    // 3) Make the HTTP request
    let response: Response<unknown>;
    try {
      response = await this.doRequest(fetchConfig);
    } catch {
      const error: ConnectionRefusedError = {
        key: LkErrorKey.CONNECTION_REFUSED,
        message: 'offline',
        fetchConfig: fetchConfig
      };
      this.props.dispatchError(error.key, error);
      return new Response({body: error});
    }

    // Throw error if status code is 5xx
    if (response.status >= 500) {
      if (!response.body) {
        response.body = {
          key: LkErrorKey.BUG,
          message: 'Missing response body'
        };
      }
      throw new InternalServerError(response);
    }

    // From here we only deal with responses with status code lower than 500
    if (this.isLkError(response.body)) {
      const errorResponse = response as ErrorResponses<EK>;

      if (includes(requiredConfig.errors, response.body.key)) {
        // Dispatch server error if expected
        this.props.dispatchError(
          response.body.key,
          response.body as LkErrorKeyToInterface[LkErrorKey]
        );

        return errorResponse;
      } else if (response.status < 200 || response.status >= 300) {
        // Throw error if unexpected
        throw new UnexpectedServerError(errorResponse);
      }
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
      body: response.body as S
    });
  }

  public isLkError(body: unknown): body is LkError {
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
    return (
      (error as LkError).key !== undefined &&
      (error as LkError).key === LkErrorKey.DATA_SOURCE_UNAVAILABLE
    );
  }

  private async doRequest<T>(fetchConfig: FetchConfig): Promise<Response<T>> {
    const fetchResponse = await this.props.fetchMethod(fetchConfig.url, {
      method: fetchConfig.method,
      headers: {
        ...(fetchConfig.body ? {'Content-Type': 'application/json'} : {}),
        ...this.props.customHeaders
      },
      credentials: 'include',
      body: fetchConfig.body ? JSON.stringify(fetchConfig.body) : undefined
    });

    // normalize headers
    const normalizedHeaders: GenericObject = {};
    fetchResponse.headers.forEach((value, key) => {
      normalizedHeaders[key.toLowerCase()] = value;
    });

    // Normalize the body:
    // - If the content type is JSON, parse it as JSON.
    // - Otherwise, return the body as an ArrayBuffer (this is the case for binary responses such as Excel extracts).
    const gotJson =
      (fetchResponse.headers.get('content-type') ?? 'unknown')
        .toLowerCase()
        .indexOf('application/json') === 0;
    const body = gotJson
      ? ((await fetchResponse.json().catch(() => undefined)) as unknown)
      : await fetchResponse.arrayBuffer();

    return new Response<T>({
      status: fetchResponse.status,
      header: normalizedHeaders,
      body: body as T
    });
  }
}
