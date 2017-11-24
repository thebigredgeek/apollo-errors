import * as assert from 'assert';
import ExtendableError from 'extendable-error';

const isSomething = (something : string ) => d => Object.prototype.toString.call(d) === something;
const isString = isSomething('[object String]');
const isObject = isSomething('[object Object]');

interface ErrorConfig {
  message ?: string;
  time_thrown ?: string;
  data ?: any,
  options ?: any,
}

class ApolloError extends ExtendableError {
  name: string;
  message: string;
  time_thrown: string;
  data: any;
  path: any;
  locations: any;
  _showLocations: boolean=false;

  constructor(
    name: string,
    baseConfig: ErrorConfig = {},
    extendedConfig : ErrorConfig = {}) {
      super(baseConfig.message || extendedConfig.message || '');
      let config = {...baseConfig, ...extendedConfig}
      const { message, time_thrown, data, options } = config
      this.name = name || '';
      this.message = message ||'';
      this.time_thrown = time_thrown || new Date().toISOString();
      this.data = { ...this.data, ...(data || {}) };
      this._showLocations = options && !!options.showLocations;
  }
  serialize () {
    const { name, message, time_thrown, data, _showLocations, path, locations } = this;

    let error = {
      message,
      name,
      time_thrown,
      data,
      ...(_showLocations ? {
      path,
      locations
      } : {} )
    };
    if (_showLocations) {
      error.locations = locations;
      error.path = path;
    }
    return error;
  }
}

export const isInstance = e => e instanceof ApolloError;

export const createError = (name:string, config: ErrorConfig) => {
  assert(isObject(config), 'createError requires a config object as the second parameter');
  assert(isString(config.message), 'createError requires a "message" property on the config object passed as the second parameter');
  const e = ApolloError.bind(null, name, config);
  return e;
};

export const formatError = (error, returnNull = false) => {
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
