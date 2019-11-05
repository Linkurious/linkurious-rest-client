/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-24.
 */

import {Request} from '../../http/request';
import {LkErrorKey} from '../../http/response';

import {IGetDataSourcesStatusParams, UserDataSource} from './types';

export * from './types';

const {UNAUTHORIZED, DATA_SOURCE_UNAVAILABLE, GUEST_DISABLED} = LkErrorKey;

export class DataSourceAPI extends Request {
  /**
   * Get the status of all the data-sources.
   * Users can only see data-sources with at least one group belonging to that data-source.
   * If a user has the "admin.connect" access right, it can also see all the disconnected
   * data-sources.
   */
  public getDataSourcesStatus(params: IGetDataSourcesStatusParams) {
    return this.handle(UNAUTHORIZED, GUEST_DISABLED).request<UserDataSource>({
      url: '/dataSources',
      method: 'GET',
      params: params
    });

    // TODO add set current source method
    //
    // if (response.isSuccess()) {
    //   this.props.clientState.sources = response.body;
    //   const currentSource = LinkuriousRestClient.getCurrentSource(response.body, {
    //     userId: this.props.clientState.user ? this.props.clientState.user.id : -1
    //   });
    //   this.props.clientState.currentSource = currentSource;
    //   try {
    //     if (currentSource.key && this.props.clientState.user) {
    //       localStorage.setItem(
    //         'lk-lastSeenSourceKey-' + this.props.clientState.user.id,
    //         currentSource.key
    //       );
    //     }
    //   } catch (_) {
    //     // Silent fail
    //   }
    // }
  }

  public getAllSourceInfo(params: IGetAllSourceInfoParams) {
    return this.request<GetAllSourceInfoResponse>({
      url: '/admin/sources',
      method: 'GET',
      params: params
    });
  }

  public connectDataSource(params: IConnectDataSourceParams) {
    return this.request<ConnectDataSourceResponse>({
      url: '/admin/source/:dataSourceIndex/connect',
      method: 'POST',
      params: params
    });
  }

  public resetSourceStyles(params: IResetSourceStylesParams) {
    return this.handle(DATA_SOURCE_UNAVAILABLE).request<ResetSourceStylesResponse>({
      url: '/admin/source/:sourceKey/resetDefaults',
      method: 'POST',
      params: params
    });
  }

  public setDefaultSourceStyles(params: ISetDefaultSourceStylesParams) {
    return this.handle(DATA_SOURCE_UNAVAILABLE).request<SetDefaultSourceStylesResponse>({
      url: '/admin/source/:sourceKey/setDefaults',
      method: 'POST',
      params: params
    });
  }

  public createSourceConfig(params: ICreateSourceConfigParams) {
    return this.request<CreateSourceConfigResponse>({
      url: '/admin/sources/config',
      method: 'POST',
      params: params
    });
  }

  // TODO refresh data-source status on API (deleteFullDataSource, deleteDataSourceConfig)
  public deleteSourceConfig(params: IDeleteSourceConfigParams) {
    return this.request<DeleteSourceConfigResponse>({
      url: '/admin/sources/config/:configIndex',
      method: 'POST',
      params: params
    });
  }

  public deleteSourceData(params: IDeleteSourceDataParams) {
    return this.request<DeleteSourceDataResponse>({
      url: '/admin/sources/data/:sourceKey',
      method: 'POST',
      params: params
    });
  }
}
