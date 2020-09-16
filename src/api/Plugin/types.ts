/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-17.
 */

import * as express from 'express';

import {RestClient} from '../../index';
import {GenericObject} from '../commonTypes';

export enum PluginRequestHeader {
  USER_ID = 'linkurious-user-id',
  USER_EMAIL = 'linkurious-user-email',
  PLUGIN_SECRET = 'linkurious-plugin-secret'
}

export enum PluginState {
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR_RUNTIME = 'error-runtime',
  ERROR_MANIFEST = 'error-manifest'
}

export interface InstalledPlugin {
  name: string;
  version?: string; // defined except if state='error-manifest'
  basePath?: string; // defined except if state='error-manifest'
  state: PluginState;
  error?: string; // defined if state='error-runtime' or state='error-manifest'
}

export interface IPluginConfig extends GenericObject {
  basePath?: string;
  debugPort?: number;
}

export interface PluginConfig extends GenericObject {
  // LKE will always pass the basePath to the plugin
  // https://github.com/Linkurious/linkurious-server/issues/2214
  basePath: string;
  debugPort?: string;
}

export interface PluginRouteOptions<C extends PluginConfig = PluginConfig> {
  router: express.Router;
  configuration: C;
  getRestClient: (req: express.Request) => RestClient;
}
