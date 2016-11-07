import { IClientState } from './../interfaces';
import { Logger } from './../log/Logger';
import { IHttpDriver } from './IHttpDriver';
import { IFetchConfig } from './IFetchConfig';
export declare class Fetcher {
    private static SOURCE_KEY_TEMPLATE;
    private static SOURCE_INDEX_TEMPLATE;
    private static OBJECT_ID_TEMPLATE;
    private _httpDriver;
    private _logger;
    private _host;
    private _clientState;
    private _baseUrl;
    constructor(logger: Logger, clientState: IClientState, host: string, httpDriver?: IHttpDriver);
    /**
     * HTTPDriver wrapper method
     *
     * @param {IFetchConfig} configData
     * @returns {Promise.<*>} the response body
     */
    fetch(configData: IFetchConfig): Promise<any>;
    private addSourceKeyToUrl(url, explicitSource?);
    private addSourceIndexToUrl(url, explicitSource?);
    private handleIdInUrl(url, body, query);
    private transformUrl(config, data);
}
