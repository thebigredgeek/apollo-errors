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
    showLocations,
    showPath,
  }) {
    const t = (arguments[2] && arguments[2].thrown_at) || time_thrown;
    const d = Object.assign({}, data, ((arguments[2] && arguments[2].data) || {}));
    const l = showLocations && (arguments[2] && arguments[2].locations);
    const p = showPath && (arguments[2] && arguments[2].path);
    super(serializeName([
      name,
      t,
      Object.assign({}, d, {
        toString: () => JSON.stringify(d)
      })
    ]));

    this._name = name;
    this._humanized_message = message || '';
    this._time_thrown = t;
    this._data = d;
    this._locations = l;
    this._path = p;
  }
  serialize () {
    const name = this._name;
    const message = this._humanized_message;
    const time_thrown = this._time_thrown;
    const data = this._data;
    const locations = this._locations;
    const path = this._path;
    return {
      message,
      name,
      time_thrown,
      data,
      locations,
      path,
    };
  }
}

export const createError = (name, data = { message: 'An error has occurred', showLocations, showPath }) => {
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
