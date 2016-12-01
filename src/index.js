import ExtendableError from 'es6-error';

const errorMap = new Map();

const DELIMITER = '/::/';

const serializeName = (arr = []) => arr.reduce((str, val) => `${str.length > 0 ? str + DELIMITER : str}${val.toString ? val.toString() : val}`, '');
const deserializeName = (name = '') => name.split(DELIMITER);

class ApolloError extends ExtendableError {
  constructor (name, {
    message,
    time_thrown = (new Date()).toISOString(),
    data = {},
    options = {},
  }) {
    const t = (arguments[2] && arguments[2].thrown_at) || time_thrown;
    const d = Object.assign({}, data, ((arguments[2] && arguments[2].data) || {}));
    const opts = Object.assign({}, options, ((arguments[2] && arguments[2].options) || {}));

    super(serializeName([
      name,
      t,
      Object.assign({}, d, {
        toString: () => JSON.stringify(d)
      }),
    ]));

    this._name = name;
    this._humanized_message = message || '';
    this._time_thrown = t;
    this._data = d;
    this._locations = (opts.showLocations && arguments[2] && arguments[2].locations)
    this._path = (opts.showPath && arguments[2] && arguments[2].path);
  }
  serialize () {
    const name = this._name;
    const message = this._humanized_message;
    const time_thrown = this._time_thrown;
    const data = this._data;
    const locations = this._locations;
    const path = this._path;
    let error = {
      message,
      name,
      time_thrown,
      data,
    };
    if (locations) error.locations = locations;
    if (path) error.path = path;
    return error;
  }
}

export const createError = (name, data = { message: 'An error has occurred', options }) => {
  const e = ApolloError.bind(null, name, data);
  errorMap.set(name, e);
  return e;
};

export const formatError = (originalError, returnNull = false) => {
  const [ name, thrown_at, d ] = deserializeName(originalError.message);
  const { locations, path } = originalError;
  const data = d !== undefined ? JSON.parse(d) : {};
  if (!name) return returnNull ? null : originalError;
  const CustomError = errorMap.get(name);
  if (!CustomError) return returnNull ? null : originalError;
  const error = new CustomError({
    thrown_at,
    data,
    locations,
    path,
  });
  return error.serialize();
};
