import { ILoggerDriver } from './ILoggerDriver';
export declare class DefaultLoggerDriver implements ILoggerDriver {
    debug(message: string): void;
    error(message: string): void;
}
