/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

import { IDataSourceParams, IIdentified, IPersistedItem } from "../commonTypes";

export interface ICreateAlertParams extends IDataSourceParams {

}

export interface CreateAlertResponse extends IPersistedItem {

}

export interface IUpdateAlertParams extends IDataSourceParams, IIdentified {

}

export interface UpdateAlertResponse extends IPersistedItem {

}

export interface IDeleteAlertParams extends IDataSourceParams, IIdentified {

}

export interface ICreateAlertFolderParams extends IDataSourceParams {

}

export interface CreateAlertFolderResponse extends IPersistedItem {

}

export interface IUpdateAlertFolderParams extends IDataSourceParams, IIdentified {

}

export interface UpdateAlertFolderResponse extends IPersistedItem {

}

export interface IDeleteAlertFolderParams extends IDataSourceParams, IIdentified {

}

export interface IGetAlertTreeParams extends IDataSourceParams {

}

export interface GetAlertTreeResponse {

}

export interface IGetAlertParams extends IDataSourceParams, IIdentified {

}

export interface GetAlertResponse extends IPersistedItem {

}

export interface IGetMatchParams extends IDataSourceParams {

}

export interface GetMatchResponse extends IPersistedItem {

}

export interface IGetMatchesParams extends IDataSourceParams {

}

export interface GetMatchesResponse {

}

export interface IGetMatchActionsParams extends IDataSourceParams {

}

export interface GetMatchActionsResponse {

}

export interface IDoMatchActionParams extends IDataSourceParams {

}

// export interface ICreateAlertResponse extends IDataSourceParams{
//   title: string;
//   createdAt: string;
//   updatedAt: string;
//   query: string;
//   dialect: string;
//   enabled: boolean;
//   cron: string;
//   nextRun: string;
//   matchTTL: number;
//   scoreColumn: string;
//   sortDirection: string;
//   maxMatches: number;
//   maxRuntime: number;
//   userId: number;
//   lastRun: string;
//   lastRunProblem: IAlertRunProblem;
// }

// export interface ICreateAlertFolderParams extends IDataSourceParams {
//   title: string;
//   parent?: number;
// }
//
// export interface ICreateAlertFolderResponse extends IPersistedItem {
//   title: string;
//   parent: number;
// }
//
// export interface IUpdateAlertFolderParams extends IDataSourceParams {
//   id: number;
//   title?: string;
//   parent?: number;
// }
//
// export interface IDeleteAlertFolderParams extends IDataSourceParams {
//   id: number;
// }
//
// export interface IGetAlertTreeParams extends IDataSourceParams {}
//
// export interface IGetAlertTreeResponse {
//   id: -1;
//   title: 'root';
//   type: 'folder';
//   children: FolderChildren<IGetAlertResponse, 'alert'>;
// }
//
// export interface IGetAlertParams extends IDataSourceParams {
//   id: number;
// }
//
// export interface IGetAlertResponse extends IPersistedItem {
//   folder: number;
//   title: string;
//   sourceKey: string;
//   query: string;
//   dialect: string;
//   enabled: boolean;
//   columns: Array<{type: 'number' | 'string'; columnName: string; columnTitle: string}>;
//   cron: string;
//   lastRun?: string;
//   lastRunProblem?: {
//     error: string;
//     partial: boolean;
//   };
//   nextRun?: string;
// }
