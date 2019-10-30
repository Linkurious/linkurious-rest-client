/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-24.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {LinkuriousRestClient} from '../../index';

export * from './types';
import {GetUserDataSourcesResponse, IGetUserDataSourcesParams, IGetIndexationStatusParams, IGetIndexationStatusResponse, IStartIndexationParams} from './types';
const {FORBIDDEN, NOT_FOUND, UNAUTHORIZED} = LkErrorKey;

export class DataSourceAPI extends Request {
  async getUserDataSources(params?: IGetUserDataSourcesParams) {
    const response = await this.handle(UNAUTHORIZED).request<GetUserDataSourcesResponse>({
      url: '/dataSources',
      method: 'GET',
      params: params
    });

    if (response.isSuccess()) {
      this.props.clientState.sources = response.body;
      const currentSource = LinkuriousRestClient.getCurrentSource(response.body, {
        userId: this.props.clientState.user ? this.props.clientState.user.id : -1
      });
      this.props.clientState.currentSource = currentSource;
      try {
        if (currentSource.key && this.props.clientState.user) {
          localStorage.setItem(
            'lk-lastSeenSourceKey-' + this.props.clientState.user.id,
            currentSource.key
          );
        }
      } catch (_) {
        // Silent fail
      }
    }
    return response;
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   *
   * @breakingChange admin startIndexation method signature changed to the new params/response format
   */
  public startIndexation(params: IStartIndexationParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request({
          url: '/:sourceKey/search/index',
          method: 'POST'
        }
      );
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   *
   * @breakingChange admin getIndexationStatus method signature changed to the new params/response format
   */
  public getIndexationStatus(params: IGetIndexationStatusParams) {
    return this
      .handle(
        UNAUTHORIZED,
        FORBIDDEN,
        NOT_FOUND)
      .request<IGetIndexationStatusResponse>({
          url: '/:sourceKey/search/status',
          method: 'GET',
          params: params
        }
      );
  }
}
