/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-05-16.
 */

// TS2019-DONE

import {IDataSourceParams} from './DataSource';

export interface IMergeVisualizationsParams {
  from: number;
  to: number;
}

export interface IUpdateVisualizationFolderParams extends IDataSourceParams {
  id: number;
  title?: string;
  parent?: number;
}
