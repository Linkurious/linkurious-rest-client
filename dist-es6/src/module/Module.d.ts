import { Fetcher } from '../http/fetcher';
import { IFetchConfig } from '../http/IFetchConfig';
/**
 * @abstract
 */
export declare class Module {
    private _fetcher;
    constructor(fetcher: Fetcher);
    protected fetch(config: IFetchConfig): Promise<any>;
    protected setDataSourceKey(dataSourceKey: string): any;
}
