/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-24.
 */
import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';
import {LinkuriousRestClient} from '../../index';

export * from './types';
import {GetUserDataSourcesResponse, IGetUserDataSourcesParams} from './types';

const {UNAUTHORIZED} = LkErrorKey;

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
}
