import { IHttpResponse } from './IHttpResponse';
export interface IHttpDriver {
    POST(uri: string, data?: any): Promise<IHttpResponse>;
    PUT(uri: string, data: any): Promise<IHttpResponse>;
    PATCH(uri: string, data: any): Promise<IHttpResponse>;
    GET(uri: string, data?: any): Promise<IHttpResponse>;
    DELETE(uri: string, data?: any): Promise<IHttpResponse>;
}
