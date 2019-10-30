/**
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-10-30.
 */

export interface ICreateAlertParams {

}

export interface CreateAlertResponse {

}

export interface IUpdateAlertParams {

}

export interface UpdateAlertResponse {

}

export interface IDeleteAlertParams {

}

export interface ICreateAlertFolderParams {

}

export interface CreateAlertFolderResponse {

}

export interface IUpdateAlertFolderParams {

}

export interface UpdateAlertFolderResponse {

}

export interface IDeleteAlertFolderParams {

}

export interface IGetAlertTreeParams {

}

export interface GetAlertTreeResponse {

}

export interface IGetAlertParams {

}

export interface GetAlertResponse {

}

export interface IGetMatchParams {

}

export interface GetMatchResponse {

}

export interface IGetMatchesParams {

}

export interface GetMatchesResponse {

}

export interface IGetMatchActionsParams {

}

export interface GetMatchActionsResponse {

}

export interface IDoMatchActionParams {

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
//
// export interface ICreateAlertParams extends IDataSourceParams {
//   title?: string;
//   query?: string;
//   dialect?: string;
//   enabled?: boolean;
//   cron?: string;
//   matchTTL?: number;
//   scoreColumn?: string;
//   scoreDirection?: string;
//   maxMatches?: number;
//   maxRuntime?: number;
//   folder?: number;
// }
//
// export interface IUpdateAlertParams extends Partial<ICreateAlertParams> {
//   id: number;
// }
//
// export interface IUpdateAlertResponse extends ICreateAlertResponse {}
//
// export interface IDeleteAlertParams extends IDataSourceParams {
//   id: number;
// }
//
