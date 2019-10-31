/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-24.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

export * from './types';

const {} = LkErrorKey;

export class DataSourceAPI extends Request {
  // TODO refresh data-source status on API (deleteFullDataSource, deleteDataSourceConfig)
  // async getUserDataSources(params?: IGetUserDataSourcesParams) {
  //   const response = await this.handle(UNAUTHORIZED).request<GetUserDataSourcesResponse>({
  //     url: '/dataSources',
  //     method: 'GET',
  //     params: params
  //   });
  //
  //   if (response.isSuccess()) {
  //     this.props.clientState.sources = response.body;
  //     const currentSource = LinkuriousRestClient.getCurrentSource(response.body, {
  //       userId: this.props.clientState.user ? this.props.clientState.user.id : -1
  //     });
  //     this.props.clientState.currentSource = currentSource;
  //     try {
  //       if (currentSource.key && this.props.clientState.user) {
  //         localStorage.setItem(
  //           'lk-lastSeenSourceKey-' + this.props.clientState.user.id,
  //           currentSource.key
  //         );
  //       }
  //     } catch (_) {
  //       // Silent fail
  //     }
  //   }
  //   return response;
  // }
  //

  public getDataSourcesStatus(params: IGetDataSourcesStatusParams) {
    return this.handle().request<GetDataSourcesStatusResponse>({
      url: '/dataSources',
      method: 'GET',
      params: params
    });
  }

  /**
   * Request to reindex the graph database. One may want to do it after editing the index configuration.
   */
  public startIndexation(params: IStartIndexationParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request({
      url: '/:sourceKey/search/index',
      method: 'POST'
    });
  }

  /**
   * Get the status of the Search API and return the indexing progress.
   */
  public getIndexationStatus(params: IGetIndexationStatusParams) {
    return this.handle(UNAUTHORIZED, FORBIDDEN, NOT_FOUND).request<GetIndexationStatusResponse>({
      url: '/:sourceKey/search/status',
      method: 'GET',
      params: params
    });
  }

  public connectDataSource(params: IConnectDataSourceParams) {
    return this.handle().request<ConnectDataSourceResponse>({
      url: '/admin/source/:dataSourceIndex/connect',
      method: 'POST',
      params: params
    });
  }

  public resetSourceStyles(params: IResetSourceStylesParams) {
    return this.handle().request<ResetSourceStylesResponse>({
      url: '/admin/source/:sourceKey/resetDefaults',
      method: 'POST',
      params: params
    });
  }

  public setDefaultSourceStyles(params: ISetDefaultSourceStylesParams) {
    return this.handle().request<SetDefaultSourceStylesResponse>({
      url: '/admin/source/:dataSource/setDefaults',
      method: 'POST',
      params: params
    });
  }

  public getAllSourceInfo(params: IGetAllSourceInfoParams) {
    return this.handle().request<GetAllSourceInfoResponse>({
      url: '/admin/sources',
      method: 'GET',
      params: params
    });
  }

  public createSourceConfig(params: ICreateSourceConfigParams) {
    return this.handle().request<CreateSourceConfigResponse>({
      url: '/admin/sources/config',
      method: 'POST',
      params: params
    });
  }

  public deleteSourceConfig(params: IDeleteSourceConfigParams) {
    return this.handle().request<DeleteSourceConfigResponse>({
      url: '/admin/sources/config/:configIndex',
      method: 'POST',
      params: params
    });
  }

  public deleteSourceData(params: IDeleteSourceDataParams) {
    return this.handle().request<DeleteSourceDataResponse>({
      url: '/admin/sources/data/:sourceKey',
      method: 'POST',
      params: params
    });
  }
}
