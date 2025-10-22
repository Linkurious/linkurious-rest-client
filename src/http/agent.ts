import {hasValue} from '../utils';

import {Response as RestClientResponse} from './response';
import {FetchConfig, Interceptor} from './types';

export class Agent {
  constructor(private readonly interceptors: Interceptor[]) {}

  async fetch<T>(fetchConfig: FetchConfig): Promise<RestClientResponse<T>> {
    const request = this.createRequest(fetchConfig);
    const response = await this.fetchResponse(request);
    return new RestClientResponse({
      status: response.status,
      header: this.extractHeaders(response),
      body: await this.extractBody(response)
    });
  }

  private createRequest(fetchConfig: FetchConfig): Request {
    let request = new Request(fetchConfig.url, {
      method: fetchConfig.method,
      headers: new Headers([['Content-Type', 'application/json; charset=utf-8']]),
      body: fetchConfig.body ? JSON.stringify(fetchConfig.body) : undefined
    });
    for (const interceptor of this.interceptors) {
      request = interceptor.onRequest?.(request) ?? request;
    }
    return request;
  }

  private async fetchResponse(request: Request): Promise<Response> {
    let response = await fetch(request);
    for (const interceptor of this.interceptors) {
      response = interceptor.onResponse?.(response) ?? response;
    }
    return response;
  }

  private extractHeaders(response: Response): Record<string, string> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  private async extractBody<T>(response: Response): Promise<T> {
    const contentType = (response.headers.get('Content-Type') ?? '').split(';')[0];
    if (hasValue(response.body)) {
      switch (contentType) {
        case 'application/json': {
          const text = await response.text();
          if (text.length > 0) {
            return JSON.parse(text) as T;
          }
          break;
        }
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
          return (await response.arrayBuffer()) as T;
        }
      }
    }
    return undefined as T;
  }
}
