import { Fetcher } from './fetcher';
import { Logger } from '../log/Logger';
import { IClientState } from '../interfaces';
export declare class FetcherFactory {
    create(_logger: Logger, _clientState: IClientState, host: string): Fetcher;
}
