/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import {PersistedItem} from '../commonTypes';

export enum ApiRight {
  // visualization actions
  VISUALIZATION_READ = 'visualization.read',
  VISUALIZATION_CREATE = 'visualization.create',
  VISUALIZATION_DUPLICATE = 'visualization.duplicate',
  VISUALIZATION_EDIT = 'visualization.edit',
  VISUALIZATION_DELETE = 'visualization.delete',
  VISUALIZATION_LIST = 'visualization.list',

  // visualization folder actions
  VISUALIZATION_FOLDER_CREATE = 'visualizationFolder.create',
  VISUALIZATION_FOLDER_EDIT = 'visualizationFolder.edit',
  VISUALIZATION_FOLDER_DELETE = 'visualizationFolder.delete',

  // visualization sharing actions
  VISUALIZATION_SHARE_READ = 'visualizationShare.read',
  VISUALIZATION_SHARE_CREATE = 'visualizationShare.create',
  VISUALIZATION_SHARE_DELETE = 'visualizationShare.delete',

  // sandbox action
  SANDBOX = 'sandbox',

  // widget actions
  WIDGET_READ = 'widget.read',
  WIDGET_CREATE = 'widget.create',
  WIDGET_EDIT = 'widget.edit',
  WIDGET_DELETE = 'widget.delete',

  // graph item actions
  GRAPH_ITEM_READ = 'graphItem.read',
  GRAPH_ITEM_CREATE = 'graphItem.create',
  GRAPH_ITEM_EDIT = 'graphItem.edit',
  GRAPH_ITEM_DELETE = 'graphItem.delete',
  GRAPH_ITEM_SEARCH = 'graphItem.search',

  // saved graph query actions
  SAVED_GRAPH_QUERY_READ = 'savedGraphQuery.read',
  SAVED_GRAPH_QUERY_CREATE = 'savedGraphQuery.create',
  SAVED_GRAPH_QUERY_EDIT = 'savedGraphQuery.edit',
  SAVED_GRAPH_QUERY_DELETE = 'savedGraphQuery.delete',
  GRAPH_RUN_QUERY = 'graph.runQuery',

  // alert actions
  ALERT_READ = 'alert.read',
  ALERT_DO_ACTION = 'alert.doAction',
  ADMIN_ALERTS = 'admin.alerts',
  MANAGE_ALERTS = 'manageAlert',

  // schema action
  SCHEMA = 'schema',

  // index action
  ADMIN_INDEX = 'admin.index'
}

export interface Application extends PersistedItem {
  name: string;
  apiKey: string;
  enabled: boolean;
  groups: number[];
  rights: ApiRight[];
}

export interface ICreateApplicationParams {
  name: string;
  enabled?: boolean;
  groups: number[];
  rights: ApiRight[];
}

export interface IUpdateApplicationParams extends Partial<ICreateApplicationParams> {
  id: number;
}
