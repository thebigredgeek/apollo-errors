import * as assert from 'assert';
import ExtendableError from 'extendable-error';

const isString = d => Object.prototype.toString.call(d) === '[object String]';
const isObject = d => Object.prototype.toString.call(d) === '[object Object]';

export interface ErrorConfig {
  message: string;
  time_thrown?: string;
  data?: any;
  options?: {
    showPath?: boolean;
    showLocations?: boolean;
  };
}

export interface ErrorInfo {
  message: string;
  name: string;
  time_thrown: string;
  data?: {};
  path?: string;
  locations?: any;
}

export class ApolloError extends ExtendableError {
  name: string;
  message: string;
  time_thrown: string;
  data: any;
  path: any;
  locations: any;
  _showLocations: boolean = false;

  constructor(name: string, config: ErrorConfig) {
    super((arguments[2] && arguments[2].message) || '');

    const t = (arguments[2] && arguments[2].time_thrown) || (new Date()).toISOString();
    const m = (arguments[2] && arguments[2].message) || '';
    const configData = (arguments[2] && arguments[2].data) || {};
    const d = { ...this.data, ...configData }
    const opts = ((arguments[2] && arguments[2].options) || {})

    this.name = name;
    this.message = m;
    this.time_thrown = t;
    this.data = d;
    this._showLocations = !!opts.showLocations;
  }

  serialize(): ErrorInfo {
    const { name, message, time_thrown, data, _showLocations, path, locations } = this;

    let error: ErrorInfo = {
      message,
      name,
      time_thrown,
      data,
      path,
      locations
    };

    if (_showLocations) {
      error.locations = locations;
      error.path = path;
    }

    return error;
  }
}

export const isInstance = e => e instanceof ApolloError;

export const createError = (name: string, config: ErrorConfig) => {
  assert(isObject(config), 'createError requires a config object as the second parameter');
  assert(isString(config.message), 'createError requires a "message" property on the config object passed as the second parameter');
  return new ApolloError(name, config);
};

export const formatError = (error, returnNull = false): ErrorInfo => {
  const originalError = error ? error.originalError || error : null;

  if (!originalError) return returnNull ? null : error;

  const { name } = originalError;

  if (!name || !isInstance(originalError)) return returnNull ? null : error;

  const { time_thrown, message, data, _showLocations } = originalError;

  if (_showLocations) {
    const { locations, path } = error;
    originalError.locations = locations;
    originalError.path = path;
  }

  return originalError.serialize();
};
