import ExtendableError from 'extendable-error';
export interface ErrorConfig {
    message: string;
    time_thrown?: string;
    data?: object;
    internalData?: object;
    options?: {
        showPath?: boolean;
        showLocations?: boolean;
    };
}
export interface ErrorInfo {
    message: string;
    name: string;
    time_thrown: string;
    data?: object;
    path?: string;
    locations?: any;
}
export declare class ApolloError extends ExtendableError {
    name: string;
    message: string;
    time_thrown: string;
    data: object;
    internalData: object;
    path: any;
    locations: any;
    _showLocations: boolean;
    _showPath: boolean;
    constructor(name: string, config: ErrorConfig, ctorConfig: ErrorConfig);
    serialize(): ErrorInfo;
}
export declare const isInstance: (e: any) => boolean;
export declare const createError: (name: string, config: ErrorConfig) => any;
export declare const formatError: (error: any, returnNull?: boolean) => ErrorInfo;
