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
import { Forbidden, ServerRejection, Unauthorized } from '../response/errors';

export class MyModule extends Module {
  constructor(fetcher: Fetcher) {
    super(fetcher);
  }

  /**
   * get authenticated user infos
   *
   * @returns {Promise<IFullUser>}
   */
  public infos(status?: boolean): Promise<IFullUser> {
    let data: any = {
      guest: status,
    };
    return this.fetch({
      url: '/auth/me',
      method: 'GET',
      query: data,
    });
  }

  /**
   * get styles and captions fo the current user
   *
   * @param {string} dataSourceKey
   * @returns {Promise<any>}
   */
  public stylesAndCaptions(
    dataSourceKey?: string
  ): Promise<{
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
  }> {
    return this.fetch({
      url: '/{dataSourceKey}/sandbox',
      method: 'GET',
      dataSource: dataSourceKey,
    }).then((res: any) => {
      return {
        styles: res.visualization.design.styles,
        captions: {
          node: res.visualization.nodeFields.captions,
          edge: res.visualization.nodeFields.captions,
        },
        palettes: res.visualization.design.palette,
      };
    });
  }

  /**
   * Check if the user is authenticated.
   *
   * @returns {Promise<boolean>}
   */
  public IsAuth(): Promise<boolean> {
    return this.fetch({
      url: '/auth/authenticated',
      method: 'GET',
    });
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
      .catch((error) => new ServerRejection(error));
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
  ): Promise<void> {
    return this.fetch({
      url: '/{dataSourceKey}/graph/my/rawQuery/{id}',
      method: 'DELETE',
      body: data,
      dataSource: dataSourceKey,
    });
  }
}
