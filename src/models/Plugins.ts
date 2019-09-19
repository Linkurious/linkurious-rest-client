/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-09-17.
 */
// TS2019-DONE

export enum PluginState {
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR_RUNTIME = 'error-runtime',
  ERROR_MANIFEST = 'error-manifest'
}

export interface IInstalledPlugin {
  name: string;
  version: string;
  basePath: string;
  state: PluginState;
  error?: string
}

export type IGetPluginsResponse = IInstalledPlugin[]
