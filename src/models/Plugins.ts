/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-17.
 */

// TS2019-DONE

export enum PluginRequestHeader {
  USER_ID = 'X-linkurious-user-id',
  USER_EMAIL = 'X-linkurious-user-email',
  PLUGIN_SECRET = 'X-linkurious-plugin-secret'
}

export enum PluginState {
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR_RUNTIME = 'error-runtime',
  ERROR_MANIFEST = 'error-manifest'
}

export interface IInstalledPlugin {
  name: string;
  version?: string;
  basePath?: string;
  state: PluginState;
  error?: string
}

export type GetPluginsResponse = IInstalledPlugin[]
