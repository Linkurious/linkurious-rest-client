export interface IFetchConfig {
    url: string;
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
    dataSource?: IDataSourceRelative;
    body?: any;
    query?: any;
}
export interface IDataSourceRelative {
    dataSourceKey?: string;
    dataSourceIndex?: number;
}
export interface IDataToSend {
    queryData?: any;
    bodyData?: any;
}
