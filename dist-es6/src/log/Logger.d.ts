import { LinkuriousError } from '../LinkuriousError';
import { ILoggerDriver } from './ILoggerDriver';
export declare type LogLevel = 'debug' | 'error' | 'quiet';
export declare class Logger {
    level: LogLevel;
    driver: ILoggerDriver;
    private numericalLevel;
    constructor(level: LogLevel, driver?: ILoggerDriver);
    debug(error: LinkuriousError): void;
    error(error: LinkuriousError): void;
    private log(level, error);
}
