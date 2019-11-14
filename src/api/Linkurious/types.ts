/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-19.
 */

export interface ServerStatus {
  code: number;
  name: string;
  message: string;
  uptime: number;
}

export interface ServerVersion {
  tag_name: string;
  name: string;
  prerelease: boolean;
}

export interface ISendAnalyticsParams {
  type: 'identify' | 'track' | 'page';
  event?: string;
  name?: string;
  properties?: object;
  traits?: object;
  context?: object;
}

export interface IGetReportParams {
  withConfiguration?: boolean;
}

export interface RestartLinkuriousResponse {
  url: string;
}

export interface IGetCustomFilesParams {
  root?: string;
  extensions?: string;
}

export interface CustomFile {
  path: string;
  name: string;
}
