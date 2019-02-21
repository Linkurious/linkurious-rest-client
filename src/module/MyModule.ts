/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maximeallex on 2016-05-30.
 *
 * File:
 * Description :
 */

'use strict';

import { IFullUser, IBaseGroup } from '../../index';
import { Module } from './Module';
import { Fetcher } from '../http/fetcher';
import { Success } from '../response/success';
import { Forbidden, Rejection, Unauthorized } from '../response/errors';

export class MyModule extends Module {
  constructor(fetcher: Fetcher) {
    super(fetcher);
  }

  /**
   * get authenticated user infos
   *
   * @returns {Promise<IFullUser>}
   */
  public infos(status?: boolean): Promise<Success<IFullUser> | Rejection> {
    let data: any = {
      guest: status,
    };
    return this.fetch({
      url: '/auth/me',
      method: 'GET',
      query: data,
    })
      .then((response: IFullUser) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * get styles and captions fo the current user
   *
   * @param {string} dataSourceKey
   * @returns {Promise<any>}
   */
  public stylesAndCaptions(
    dataSourceKey?: string
  ): Promise<
    | Success<{
        styles: {
          node: Array<{
            index: number;
            itemType: string | null | undefined;
            input: Array<string>;
            value: any;
            style: { color: string | any };
          }>;
          edge: Array<{
            index: number;
            itemType: string | null | undefined;
            input: Array<string>;
            value: any;
            style: { color: string | any };
          }>;
        };
        captions: {
          node: { [key: string]: { displayName: boolean; properties: Array<string>; active: boolean } };
          edge: { [key: string]: { displayName: boolean; properties: Array<string>; active: boolean } };
        };
        palettes: { [key: string]: string };
      }>
    | Rejection
  > {
    return this.fetch({
      url: '/{dataSourceKey}/sandbox',
      method: 'GET',
      dataSource: dataSourceKey,
    })
      .then(
        (response: any) =>
          new Success({
            styles: response.visualization.design.styles,
            captions: {
              node: response.visualization.nodeFields.captions,
              edge: response.visualization.nodeFields.captions,
            },
            palettes: response.visualization.design.palette,
          })
      )
      .catch((error) => new Rejection(error));
  }

  /**
   * Check if the user is authenticated.
   *
   * @returns {Promise<boolean>}
   */
  public IsAuth(): Promise<Success<boolean> | Rejection> {
    return this.fetch({
      url: '/auth/authenticated',
      method: 'GET',
    })
      .then((response: boolean) => new Success(response))
      .catch((error) => new Rejection(error));
  }

  /**
   * List all the groups for the current source
   */
  public getGroups(
    data: {
      action: string;
    },
    dataSourceKey?: string
  ): Promise<Success<Array<IBaseGroup>> | Unauthorized | Forbidden> {
    return this.fetch({
      url: '/{dataSourceKey}/groups',
      method: 'GET',
      query: data,
      dataSource: dataSourceKey,
    })
      .then((response: Array<IBaseGroup>) => new Success(response))
      .catch((error) => new Rejection(error) as Unauthorized | Forbidden);
  }

  /**
   * Delete a saved Graph Query owned by the current user
   *
   * @param {Object} data
   * @param {string}dataSourceKey
   * @returns {Promise<boolean>}
   */
  public deleteGraphQuery(
    data: {
      id: number;
    },
    dataSourceKey?: string
  ): Promise<Success<void> | Rejection> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/my/rawQuery/{id}',
      method: 'DELETE',
      body: data,
      dataSource: dataSourceKey,
    })
      .then(() => new Success(undefined))
      .catch((error) => new Rejection(error));
  }
}
