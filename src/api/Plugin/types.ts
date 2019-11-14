/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-17.
 */

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
