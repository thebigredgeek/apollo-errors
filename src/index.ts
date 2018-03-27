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
  name: string;
  time_thrown: string;
  data?: object;
  path?: string;
  locations?: any;
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

  constructor(name: string, config: ErrorConfig, newConfig?: ErrorConfig) {
    super((newConfig && newConfig.message) || (config && config.message) || '');

    const t = (newConfig && newConfig.time_thrown) || (config && config.time_thrown) || (new Date()).toISOString();
    const m = (newConfig && newConfig.message) || (config && config.message) || '';
    const newConfigData = (newConfig && newConfig.data) || {};
    const configData = (config && config.data) || {};
    const d = { ...this.data, ...configData, ...newConfigData };
    const newConfigOptions = (newConfig && newConfig.options) || {};
    const configOptions = (config && config.options) || {};
    const opts = { ...configOptions, ...newConfigOptions };


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
      name,
      time_thrown,
      data,
      path,
      locations
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
