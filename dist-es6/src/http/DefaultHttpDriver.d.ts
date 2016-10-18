import { IHttpResponse } from './IHttpResponse';
import { IHttpDriver } from './IHttpDriver';
export declare class DefaultHttpDriver implements IHttpDriver {
    private cookie;
    constructor();
    POST(uri: string, data?: any, query?: any): Promise<IHttpResponse>;
    PUT(uri: string, data: any, query?: any): Promise<IHttpResponse>;
    PATCH(uri: string, data: any, query?: any): Promise<IHttpResponse>;
    GET(uri: string, query?: any): Promise<IHttpResponse>;
    DELETE(uri: string, data?: any, query?: any): Promise<IHttpResponse>;
    private handleResponse(resolve, reject, err, res);
}
