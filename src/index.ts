import * as assert from 'assert';
import ExtendableError from 'extendable-error';

const isString = d => Object.prototype.toString.call(d) === '[object String]';
const isObject = d => Object.prototype.toString.call(d) === '[object Object]';
class ApolloError extends ExtendableError {
  name: any;
  message: any;
  time_thrown: any;
  data: any;
  path: any;
  locations: any;
  _showLocations: any;
  constructor (name, {
    message,
    time_thrown = (new Date()).toISOString(),
    data = {},
    options = {},
  }) {
    const t = (arguments[2] && arguments[2].time_thrown) || time_thrown;
    const d = ((arguments[2] && arguments[2].data) || {})
    const m = (arguments[2] && arguments[2].message) || message;
    const opts = ((arguments[2] && arguments[2].options) || {})

    super(m);

    this.name = name;
    this.message = m;
    this.time_thrown = t;
    this.data = d;
    this._showLocations = !!opts.showLocations;
  }
  serialize () {
    const { name, message, time_thrown, data, _showLocations, path, locations } = this;

    let error = {
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

export const createError = (name, config) => {
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
