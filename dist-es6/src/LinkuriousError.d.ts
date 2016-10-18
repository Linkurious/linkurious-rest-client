import { IHttpResponse } from './http/IHttpResponse';
export declare type ErrorType = 'client' | 'communication' | 'access' | 'technical' | 'business';
export declare class LinkuriousError {
    status: number;
    type: ErrorType;
    key: string;
    message: string;
    cause: Error;
    constructor(status: number, type: ErrorType, key: string, message: string, cause?: Error);
    static fromHttpResponse(r: IHttpResponse): LinkuriousError;
    static fromError(error: Error): LinkuriousError;
    stack: string;
    stackArray: Array<string>;
    static fromClientError(key: string, message: string): LinkuriousError;
    static isError(r: IHttpResponse): boolean;
    private static getErrorType(status);
}
