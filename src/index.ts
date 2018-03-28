import * as assert from 'assert';
import ExtendableError from 'extendable-error';

const isString = d => Object.prototype.toString.call(d) === '[object String]';
const isObject = d => Object.prototype.toString.call(d) === '[object Object]';

export interface ErrorConfig {
  message: string;
  time_thrown?: string;
  data?: object;
  options?: {
    showPath?: boolean;
    showLocations?: boolean;
  };
}

export interface ErrorInfo {
  message: string;
  path?: string;
  locations?: any;
  extensions?: {
    name: string;
    time_thrown: string;
    data?: object;
  };
}

export class ApolloError extends ExtendableError {
  name: string;
  message: string;
  time_thrown: string;
  data: object;
  path: any;
  locations: any;
  _showLocations: boolean = false;
  _showPath: boolean = false;

  // NOTE: The object passed to the Constructor is actually `ctorData`.
  //       We are binding the constructor to the name and config object
  //       for the first two parameters inside of `createError`
  constructor(name: string, config: ErrorConfig, ctorData: any) {
    super((ctorData && ctorData.message) || '');

    const t = (ctorData && ctorData.time_thrown) || (new Date()).toISOString();
    const m = (ctorData && ctorData.message) || '';
    const configData = (ctorData && ctorData.data) || {};
    const d = { ...this.data, ...configData };
    const opts = ((ctorData && ctorData.options) || {});


    this.name = name;
    this.message = m;
    this.time_thrown = t;
    this.data = d;
    this._showLocations = !!opts.showLocations;
    this._showPath = !!opts.showPath;
  }

  serialize(): ErrorInfo {
    const { name, message, time_thrown, data, _showLocations, _showPath, path, locations } = this;

    let error: ErrorInfo = {
      message,
      path,
      locations,
      extensions: {
        name,
        time_thrown,
        data
      }
    };

    if (_showLocations) {
      error.locations = locations;
    }

    if (_showPath) {
      error.path = path;
    }

    return error;
  }
}

export const isInstance = e => e instanceof ApolloError;

export const createError = (name: string, config: ErrorConfig) => {
  assert(isObject(config), 'createError requires a config object as the second parameter');
  assert(isString(config.message), 'createError requires a "message" property on the config object passed as the second parameter');
  // NOTE: The first two parameters give to the constructor will always be name and config
  //       Parameters passed to the constructor when `new` is invoked will be passed as
  //       subsequent parameters.
  return ApolloError.bind(null, name, config);
};

export const formatError = (error, returnNull = false): ErrorInfo => {
  const originalError = error ? error.originalError || error : null;

  if (!originalError) return returnNull ? null : error;

  const { name } = originalError;

  if (!name || !isInstance(originalError)) return returnNull ? null : error;

  const { time_thrown, message, data, _showLocations, _showPath } = originalError;
  const { locations, path } = error;

  if (_showLocations) {
    originalError.locations = locations;
  }

  if (_showPath) {
    originalError.path = path;
  }

  return originalError.serialize();
};
