export interface ILoggerDriver {
    debug: (message: string) => void;
    error: (message: string) => void;
}
